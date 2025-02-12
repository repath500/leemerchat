"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Info, User, Bot, Pencil, Trash2, Menu as MenuIcon, Sun, Moon, ChevronDown, ImageIcon, LinkIcon, Plus } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { generatePartnerResponse, partnerModels } from "@/lib/partnerservice"
import { useState, useRef, useEffect } from "react"
import { InfoPopup } from "@/components/ui/info-popup"
import { AnimatedTabs } from "@/components/ui/animated-tabs"
import { UserProfile } from "@/components/ui/user-profile"
import { MessageActions } from "@/components/ui/message-actions"
import ReactMarkdown from "react-markdown"
import { DemoButton } from "@/components/ui/demo-button"
import { PricingDialog } from "@/components/ui/pricing-dialog"
import { Input } from "@/components/ui/input"

interface Conversation {
  id: string
  title: string
  messages: Message[]
  timestamp: number
}

interface Message {
  role: "user" | "assistant"
  content: string
}

interface ChatProps {
  isDarkMode: boolean
  setIsDarkMode: (isDarkMode: boolean) => void
  isInfoOpen: boolean
  setIsInfoOpen: (isInfoOpen: boolean) => void
}

export default function Chat({ isDarkMode, setIsDarkMode, isInfoOpen, setIsInfoOpen }: ChatProps) {
  const [input, setInput] = useState("")
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null)
  const [selectedModel, setSelectedModel] = useState("qiwi-medium")
  const [isLoading, setIsLoading] = useState(false)
  const [editingConversationId, setEditingConversationId] = useState<string | null>(null)
  const [editedTitle, setEditedTitle] = useState("")
  const [isPartnerModel, setIsPartnerModel] = useState(false)
  const [selectedPartnerModel, setSelectedPartnerModel] = useState(partnerModels[0].id)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isUserProfileOpen, setIsUserProfileOpen] = useState(false)
  const [isPricingOpen, setIsPricingOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDarkMode])

  const handleDemoClick = () => {
    window.location.reload();
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    if (currentConversation?.messages) {
      scrollToBottom()
    }
  }, [currentConversation?.messages, scrollToBottom])

  const handleModelChange = (model: string) => {
    setSelectedModel(model)
    setIsPartnerModel(false)
  }

  const handlePartnerModelChange = (model: string) => {
    setSelectedPartnerModel(model)
    setIsPartnerModel(true)
  }

  const renderMessage = (message: Message, index: number) => {
    const isUser = message.role === "user"
    return (
      <div
        key={index}
        className={cn("flex items-start gap-4", isUser ? "flex-row-reverse" : "flex-row")}
      >
        <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border bg-background shadow">
          {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
        </div>
        <div
          className={cn(
            "flex-1 rounded-lg px-4 py-2 text-sm",
            isUser ? "bg-primary text-primary-foreground" : "bg-muted"
          )}
        >
          {message.content}
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const newMessage: Message = { role: "user", content: input }
    const conversationId = currentConversation?.id || crypto.randomUUID()

    // Create new conversation if none exists
    if (!currentConversation) {
      const newConversation: Conversation = {
        id: conversationId,
        title: "New Chat",
        messages: [newMessage],
        timestamp: Date.now(),
      }
      setCurrentConversation(newConversation)
      setConversations(prev => [newConversation, ...prev])
    } else {
      // Update existing conversation
      const updatedConversation = {
        ...currentConversation,
        messages: [...currentConversation.messages, newMessage],
      }
      setCurrentConversation(updatedConversation)
      setConversations(prev =>
        prev.map(conv => (conv.id === conversationId ? updatedConversation : conv))
      )
    }

    setInput("")
    setIsLoading(true)

    try {
      let response
      if (isPartnerModel) {
        response = await generatePartnerResponse(
          currentConversation ? [...currentConversation.messages, newMessage] : [newMessage],
          selectedPartnerModel
        )
      } else {
        response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: currentConversation
              ? [...currentConversation.messages, newMessage]
              : [newMessage],
            model: selectedModel,
            textStyle: "default",
          }),
        })
      }

      if (!response.ok) throw new Error("Failed to send message")

      const reader = response.body?.getReader()
      if (!reader) throw new Error("No reader available")

      // Add empty assistant message immediately
      const assistantMessage: Message = { role: "assistant", content: "" }
      setCurrentConversation(prev => {
        if (!prev) return prev
        return {
          ...prev,
          messages: [...prev.messages, assistantMessage],
        }
      })

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = new TextDecoder().decode(value)
        const lines = chunk.split("\n")

        for (const line of lines) {
          if (line.startsWith("data: ") && line !== "data: [DONE]") {
            try {
              const data = JSON.parse(line.slice(6))
              if (data.choices[0]?.delta?.content) {
                const content = data.choices[0].delta.content
                setCurrentConversation(prev => {
                  if (!prev) return prev
                  const messages = [...prev.messages]
                  const lastMessage = messages[messages.length - 1]
                  messages[messages.length - 1] = {
                    ...lastMessage,
                    content: lastMessage.content + content,
                  }
                  return { ...prev, messages }
                })
              }
            } catch (e) {
              console.error("Error parsing JSON:", e)
            }
          }
        }
      }

      // Update conversations list with the current conversation
      setConversations(prev =>
        prev.map(conv => {
          if (conv.id === conversationId && currentConversation) {
            return currentConversation
          }
          return conv
        })
      )

      // Generate title for new conversations
      if (!currentConversation?.title || currentConversation.title === "New Chat") {
        try {
          const titleResponse = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              messages: [newMessage],
              model: selectedModel,
              isForTitle: true,
            }),
          })

          if (titleResponse.ok) {
            const reader = titleResponse.body?.getReader()
            let title = ""

            if (reader) {
              while (true) {
                const { done, value } = await reader.read()
                if (done) break

                const chunk = new TextDecoder().decode(value)
                const lines = chunk.split("\n")

                for (const line of lines) {
                  if (line.startsWith("data: ") && line !== "data: [DONE]") {
                    try {
                      const data = JSON.parse(line.slice(6))
                      if (data.choices[0]?.delta?.content) {
                        title += data.choices[0].delta.content
                      }
                    } catch (e) {
                      console.error("Error parsing title JSON:", e)
                    }
                  }
                }
              }

              if (title && title.trim()) {
                const trimmedTitle = title.trim()
                setCurrentConversation(prev => {
                  if (!prev) return prev
                  return { ...prev, title: trimmedTitle }
                })
                setConversations(prev =>
                  prev.map(conv => {
                    if (conv.id === conversationId) {
                      return { ...conv, title: trimmedTitle }
                    }
                    return conv
                  })
                )
              }
            }
          }
        } catch (error) {
          console.error("Error generating title:", error)
        }
      }
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const renderConversationList = () => {
    return conversations.map((conversation) => (
      <div key={conversation.id}>
        <button
          onClick={() => setCurrentConversation(conversation)}
          className={cn(
            "group flex items-center gap-2 rounded-lg px-2 py-1 text-sm hover:bg-accent",
            currentConversation?.id === conversation.id && "bg-accent"
          )}
        >
          {editingConversationId === conversation.id ? (
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onBlur={handleTitleEditSave}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleTitleEditSave()
                if (e.key === "Escape") setEditingConversationId(null)
              }}
              className="flex-1 bg-transparent outline-none"
              autoFocus
            />
          ) : (
            <>
              <span className="flex-1 truncate">{conversation.title}</span>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setEditingConversationId(conversation.id)
                    setEditedTitle(conversation.title)
                  }}
                  className="p-1 hover:bg-accent-foreground/10 rounded"
                >
                  <Pencil className="h-3 w-3" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteConversation(conversation.id)
                  }}
                  className="p-1 hover:bg-accent-foreground/10 rounded text-destructive"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </>
          )}
        </button>
      </div>
    ))
  }

  const handleTitleEditSave = () => {
    if (editedTitle.trim() && editingConversationId) {
      setConversations(prev =>
        prev.map(conv => {
          if (conv.id === editingConversationId) {
            return { ...conv, title: editedTitle.trim() }
          }
          return conv
        })
      )
      if (currentConversation?.id === editingConversationId) {
        setCurrentConversation(prev => {
          if (!prev) return prev
          return { ...prev, title: editedTitle.trim() }
        })
      }
    }
    setEditingConversationId(null)
  }

  const handleDeleteConversation = (id: string) => {
    setConversations(prev => prev.filter(conv => conv.id !== id))
    if (currentConversation?.id === id) {
      setCurrentConversation(null)
    }
  }

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [currentConversation?.messages])

  const createNewConversation = () => {
    const newConversation: Conversation = {
      id: crypto.randomUUID(),
      title: "New Chat",
      messages: [],
      timestamp: Date.now(),
    }
    setConversations((prev) => [newConversation, ...prev])
    setCurrentConversation(newConversation)
  }

  const deleteConversation = (id: string) => {
    setConversations((prev) => prev.filter((conv) => conv.id !== id))
    if (currentConversation?.id === id) {
      setCurrentConversation(null)
    }
  }

  const clearCurrentChat = () => {
    if (currentConversation) {
      setCurrentConversation({
        ...currentConversation,
        messages: [],
      })
    }
  }

  const handleEditMessage = async (index: number, newContent: string) => {
    if (!currentConversation) return

    const updatedMessages = [...currentConversation.messages.slice(0, index), { role: "user", content: newContent }]

    setCurrentConversation({
      ...currentConversation,
      messages: updatedMessages,
    })

    // Trigger new AI response
    const event = new Event("submit")
    handleSubmit(event as React.FormEvent<HTMLFormElement>)
  }

  return (
    <div className={cn("flex min-h-screen flex-col bg-background", isDarkMode && "dark")}>
      {isInfoOpen && (
        <InfoPopup 
          isOpen={isInfoOpen} 
          onClose={() => setIsInfoOpen(false)} 
          selectedModel={selectedModel}
          onModelChange={handleModelChange}
        />
      )}
      {isUserProfileOpen && <UserProfile onClose={() => setIsUserProfileOpen(false)} />}
      <PricingDialog open={isPricingOpen} onOpenChange={setIsPricingOpen} />

      <div className="sticky top-0 z-50 flex items-center justify-between border-b bg-background/95 px-4 py-2 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setIsDarkMode(!isDarkMode)}>
            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setIsUserProfileOpen(true)}>
            <User className="h-4 w-4" />
          </Button>
          <DemoButton onClick={handleDemoClick} />
        </div>
        <Button variant="ghost" size="sm" onClick={() => setIsPricingOpen(true)}>
          Upgrade
        </Button>
      </div>

      <div className="flex flex-1">
        <div
          className={cn(
            "fixed inset-y-0 left-0 z-40 w-64 transform border-r bg-background transition-transform duration-200 ease-in-out",
            isSidebarOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex h-[60px] items-center justify-between border-b px-4">
            <h1 className="text-xl font-semibold">LeemerChat</h1>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                <MenuIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-2 p-4">
            <Button variant="secondary" className="justify-start gap-2" onClick={createNewConversation}>
              <Plus className="h-4 w-4" />
              <span>New chat</span>
            </Button>
            {currentConversation && currentConversation.messages.length > 0 && (
              <Button
                variant="ghost"
                className="justify-start gap-2 text-destructive hover:text-destructive"
                onClick={clearCurrentChat}
              >
                <Trash2 className="h-4 w-4" />
                <span>Clear chat</span>
              </Button>
            )}
            <div className="mt-4">
              <h3 className="mb-2 px-2 text-sm font-medium">Recent chats</h3>
              <div className="space-y-1">
                {renderConversationList()}
              </div>
            </div>
          </div>
        </div>

        <div
          className={cn(
            "flex flex-1 flex-col transition-all duration-200 ease-in-out",
            isSidebarOpen ? "md:ml-64" : "ml-0",
          )}
        >
          <div className="flex min-h-[60px] items-center gap-4 border-b px-4">
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost">
                    {selectedModel === "qiwi-reasoning"
                      ? "Qiwi-Reasoning"
                      : selectedModel === "qiwi-medium"
                        ? "Qiwi-Medium"
                        : "Qiwi-Small"}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem onClick={() => handleModelChange("qiwi-reasoning")}>
                    Qiwi-Reasoning
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleModelChange("qiwi-medium")}>
                    Qiwi-Medium
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleModelChange("qiwi-small")}>
                    Qiwi-Small
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost">Partner Model</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {partnerModels.map((model) => (
                    <DropdownMenuItem key={model.id} onClick={() => handlePartnerModelChange(model.id)}>
                      {model.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="ghost" size="icon" onClick={() => setIsInfoOpen(true)}>
                <Info className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="mx-auto max-w-2xl">
              {!currentConversation || currentConversation.messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center">
                  <h1 className="mb-8 text-center text-3xl font-semibold">Welcome to LeemerChat</h1>
                  <AnimatedTabs className="max-w-3xl" />
                </div>
              ) : (
                <div className="space-y-6">
                  {currentConversation.messages.map((message, i) => renderMessage(message, i))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
          </div>

          <div className="border-t p-4">
            <form onSubmit={handleSubmit} className="mx-auto max-w-2xl">
              <div className="relative">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSubmit(e)
                    }
                  }}
                  placeholder="Message LeemerChat..."
                  className="min-h-[100px] resize-none pr-36 pt-4"
                  disabled={isLoading}
                />
                <div className="absolute right-3 top-3 flex items-center gap-2">
                  <Select value={selectedModel} onValueChange={handleModelChange}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="qiwi-reasoning">Qiwi-Reasoning</SelectItem>
                      <SelectItem value="qiwi-medium">Qiwi-Medium</SelectItem>
                      <SelectItem value="qiwi-small">Qiwi-Small</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={selectedPartnerModel} onValueChange={handlePartnerModelChange}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Partner Model" />
                    </SelectTrigger>
                    <SelectContent>
                      {partnerModels.map((model) => (
                        <SelectItem key={model.id} value={model.id}>
                          {model.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" type="button">
                      <ImageIcon className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" type="button">
                      <LinkIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
