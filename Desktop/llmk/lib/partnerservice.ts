const OPENROUTER_API_KEY = "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"

export interface PartnerModel {
  id: string
  name: string
  description: string
  provider: string
}

export const partnerModels: PartnerModel[] = [
  {
    id: "deepseek/deepseek-chat:free",
    name: "DeepSeek-v3",
    description: "Leading AI from China comparable to Claude 3.5 Sonnet",
    provider: "DeepSeek"
  },
  {
    id: "amazon/nova-lite-v1",
    name: "Nova-Lite",
    description: "300K Context token LLM from Amazon",
    provider: "Amazon"
  },
  {
    id: "qwen/qwen-plus",
    name: "Qwen-Plus",
    description: "Alibaba's fast 72b parameter model",
    provider: "Alibaba"
  }
]

export async function generatePartnerResponse(messages: any[], model: string) {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://leemerchat.com",
        "X-Title": "LeemerChat",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        stream: true,
      }),
    })

    if (!response.ok) {
      throw new Error(`Partner API error: ${response.status} ${response.statusText}`)
    }

    return response
  } catch (error) {
    console.error("Partner API Error:", error)
    throw error
  }
}
