const OPENROUTER_API_KEY = "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"

export interface PartnerModel {
  id: string
  name: string
  description: string
  provider: string
  details: {
    contextTokens: number
    parameters: number
    comparableModel: string
  }
}

export const partnerModels: PartnerModel[] = [
  {
    id: "deepseek/deepseek-chat:free",
    name: "DeepSeek-v3",
    description: "Leading AI from China comparable to Claude 3.5 Sonnet",
    provider: "DeepSeek",
    details: {
      contextTokens: 300000,
      parameters: 13000000000,
      comparableModel: "Claude 3.5 Sonnet",
    },
  },
  {
    id: "amazon/nova-lite-v1",
    name: "Nova-Lite",
    description: "300K Context token LLM from Amazon",
    provider: "Amazon",
    details: {
      contextTokens: 300000,
      parameters: 10000000000,
      comparableModel: "Llama 2",
    },
  },
  {
    id: "qwen/qwen-plus",
    name: "Qwen-Plus",
    description: "Alibaba's fast 72b parameter model",
    provider: "Alibaba",
    details: {
      contextTokens: 2048000,
      parameters: 72000000000,
      comparableModel: "Llama 3",
    },
  },
]

export async function generatePartnerResponse(messages: any[], model: string) {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        stream: true,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`)
    }

    return response
  } catch (error) {
    console.error("Partner service error:", error)
    throw error
  }
}

// Helper function to parse SSE data
export function parseSSEResponse(chunk: string) {
  if (chunk.includes("[DONE]")) return null
  
  try {
    const jsonStr = chunk.replace(/^data: /, "").trim()
    if (!jsonStr) return null
    
    const json = JSON.parse(jsonStr)
    return json.choices[0]?.delta?.content || ""
  } catch (e) {
    console.error("Error parsing SSE:", e)
    return null
  }
}
