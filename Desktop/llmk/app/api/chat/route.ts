import { NextResponse } from "next/server"
import { generatePartnerResponse } from "@/lib/partnerservice"
import { partnerModels } from "@/lib/partnerservice"

const GROQ_API_KEY = "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"
const OPENROUTER_API_KEY = "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"

// Mapping for Qiwi models to Groq/OpenAI models
const modelMapping: { [key: string]: string } = {
  "qiwi-reasoning": "deepseek-r1-distill-llama-70b",
  "qiwi-medium": "qwen-2.5-32b",
  "qiwi-small": "llama-3.2-3b-preview",
  "deepseek-r1-distill-llama-70b": "deepseek-r1-distill-llama-70b",
  "qwen-2.5-32b": "qwen-2.5-32b",
  "llama-3.2-3b-preview": "llama-3.2-3b-preview"
}

const getSystemPrompt = (model: string, textStyle: string, isForTitle = false) => {
  if (isForTitle) {
    return "You are a title generator. Generate a very short title (4-6 words) that captures the essence of the conversation. Be concise and clear."
  }

  const basePrompt = `You are ${model} model, a highly capable AI assistant created by OrionAI. `

  const modelSpecificPrompt =
    {
      "qiwi-small": "You are quick and concise, providing instant answers while maintaining accuracy and markdown formatted reply.",
      "qiwi-medium": "You balance speed with intelligence, providing comprehensive yet efficient responses and markdown formatted reply.",
      "qiwi-reasoning":
        "You excel at complex problem-solving. Format your response with reasoning in <think>your step-by-step reasoning process</think> followed by your final response. Use markdown formatting for better readability.",
    }[model] || ""

  const stylePrompt = {
    default: "",
    creative: "Respond with creativity and imagination.",
    professional: "Maintain a formal and professional tone.",
  }[textStyle] || ""

  return `${basePrompt}${modelSpecificPrompt}${stylePrompt}`
}

const getTitleSystemPrompt = () => {
  return `You are an expert at creating concise, descriptive titles for conversations. 
Generate a title that captures the essence of the entire conversation in 2-4 words. 
Be precise, creative, and avoid generic terms. 
Focus on the core topic or main goal of the conversation.

Guidelines:
- Use clear, specific language
- Capture the primary intent or subject
- Avoid vague or overly broad titles
- Prioritize meaningful keywords`
}

export async function POST(req: Request) {
  try {
    const { messages, model, isForTitle = false, textStyle = "default" } = await req.json()

    if (isForTitle) {
      const titleSystemPrompt = getTitleSystemPrompt()
      const titleMessages = [
        { role: "system", content: titleSystemPrompt },
        { role: "user", content: `Analyze the entire conversation and generate a 2-4 word title that best represents its content:\n\n${messages.map(m => `${m.role}: ${m.content}`).join('\n')}` }
      ]

      const titleResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: titleMessages,
          max_tokens: 20,
          temperature: 0.7,
          stream: true
        })
      })

      return new NextResponse(titleResponse.body, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive"
        }
      })
    }

    // Explicitly check if the model is a partner model
    const isPartnerModel = partnerModels.some(
      (partnerModel) => partnerModel.id === model
    )

    if (isPartnerModel) {
      console.log(`Using partner model: ${model}`)
      const partnerResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: model,
          messages: [
            { role: "system", content: getSystemPrompt(model, textStyle, isForTitle) },
            ...messages
          ],
          stream: true,
        }),
      })

      if (!partnerResponse.ok) {
        const errorText = await partnerResponse.text()
        console.error(`OpenRouter API error: ${partnerResponse.status} ${partnerResponse.statusText}`, errorText)
        throw new Error(`OpenRouter API error: ${partnerResponse.status} ${partnerResponse.statusText}`)
      }

      return new NextResponse(partnerResponse.body, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive",
        },
      })
    }

    const groqModel = modelMapping[model] || "llama-3.1-8b-instant"
    console.log(`Using Groq model: ${groqModel}`)

    // Use Groq API for non-partner models
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: groqModel,
        messages: [
          { role: "system", content: getSystemPrompt(model, textStyle, isForTitle) },
          ...messages
        ],
        stream: true,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Groq API error: ${response.status} ${response.statusText}`, errorText)
      throw new Error(`Groq API error: ${response.status} ${response.statusText}`)
    }

    return new NextResponse(response.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "Internal Server Error" 
    }, { status: 500 })
  }
}
