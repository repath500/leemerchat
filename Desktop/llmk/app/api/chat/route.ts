import { NextResponse } from "next/server"

const GROQ_API_KEY = "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"

// Update the model mapping and system prompt handling
const getSystemPrompt = (model: string, textStyle: string, isForTitle = false) => {
  if (isForTitle) {
    return "You are a title generator. Generate a very short title (4-6 words) that captures the essence of the conversation. Be concise and clear."
  }

  const basePrompt = `You are ${model} model, a highly capable AI assistant created by OrionAI. `

  const modelSpecificPrompt =
    {
      "qiwi-small": "You are quick and concise, providing instant answers while maintaining accuracy.",
      "qiwi-medium": "You balance speed with intelligence, providing comprehensive yet efficient responses.",
      "qiwi-reasoning":
        "You excel at complex problem-solving. Format your response with reasoning in <think>your step-by-step reasoning process</think> followed by your final response. Use markdown formatting for better readability.",
    }[model] || ""

  const stylePrompt =
    {
      default: "You communicate in a clear and natural way.",
      professional: "You communicate in a formal and business-like manner.",
      casual: "You communicate in a friendly and relaxed way.",
      creative: "You communicate with flair and imagination.",
    }[textStyle] || "You communicate in a clear and natural way."

  return `${basePrompt} ${modelSpecificPrompt} ${stylePrompt}`
}

export async function POST(req: Request) {
  try {
    const { messages, model, textStyle = "default", isForTitle = false } = await req.json()

    const groqModel =
      model === "qiwi-reasoning"
        ? "deepseek-r1-distill-llama-70b"
        : model === "qiwi-medium"
          ? "qwen-2.5-32b"
          : "llama-3.1-8b-instant"

    const systemPrompt = getSystemPrompt(model, textStyle, isForTitle)

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: groqModel,
        messages: [
          { role: "system", content: systemPrompt },
          ...messages.map(({ role, content }: { role: string; content: string }) => ({
            role,
            content,
          })),
        ],
        temperature: 0.7,
        max_tokens: isForTitle ? 20 : 1024,
        top_p: 0.95,
        stream: true,
      }),
    })

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status} ${response.statusText}`)
    }

    const reader = response.body?.getReader()
    const encoder = new TextEncoder()
    const decoder = new TextDecoder()

    const stream = new ReadableStream({
      async start(controller) {
        if (!reader) {
          controller.close()
          return
        }

        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            const chunk = decoder.decode(value)
            const lines = chunk.split("\n")

            for (const line of lines) {
              if (line.startsWith("data: ") && line !== "data: [DONE]") {
                try {
                  const data = JSON.parse(line.slice(6))
                  if (data.choices[0]?.delta?.content) {
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
                  }
                } catch (e) {
                  console.error("Error parsing JSON:", e)
                }
              }
            }
          }
        } catch (error) {
          console.error("Stream reading error:", error)
        } finally {
          controller.close()
        }
      },
    })

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

