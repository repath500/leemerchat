"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bot, ChevronDown, ImageIcon, MessageSquare } from "lucide-react"
import Link from "next/link"

export default function Component() {
  const [selectedModel, setSelectedModel] = useState("qiwi-reasoning")
  const [textStyle, setTextStyle] = useState("default")

  return (
    <div className="flex min-h-screen flex-col">
      <div className="sticky top-0 z-50 flex items-center justify-between border-b bg-background/95 px-4 py-2 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <span className="text-sm text-muted-foreground">Using limited free plan</span>
        <Button variant="link" className="text-sm font-medium">
          Upgrade
        </Button>
      </div>

      <div className="flex flex-1 flex-col md:grid md:grid-cols-[260px_1fr]">
        <div className="hidden border-r bg-muted/20 md:block">
          <div className="flex h-[60px] items-center px-4">
            <span className="text-lg font-semibold">LeemerChat</span>
          </div>
          <div className="flex flex-col gap-2 p-4">
            <Button variant="ghost" className="justify-start gap-2">
              <MessageSquare className="h-4 w-4" />
              <span>New chat</span>
            </Button>
            <div className="mt-4">
              <h3 className="mb-2 px-2 text-sm font-medium">Recent chats</h3>
              <div className="space-y-1">
                <Button variant="ghost" className="w-full justify-start gap-2 text-left">
                  <Bot className="h-4 w-4" />
                  <div className="flex flex-col items-start">
                    <span className="text-sm">Understanding AI Models</span>
                    <span className="text-xs text-muted-foreground">2 hours ago</span>
                  </div>
                </Button>
                <Button variant="ghost" className="w-full justify-start gap-2 text-left">
                  <Bot className="h-4 w-4" />
                  <div className="flex flex-col items-start">
                    <span className="text-sm">Data Analysis Project</span>
                    <span className="text-xs text-muted-foreground">5 hours ago</span>
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col">
          <div className="flex min-h-[60px] items-center gap-2 border-b px-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2">
                  {selectedModel === "qiwi-reasoning" ? "Qiwi-Reasoning" : "Qiwi-Small"}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => setSelectedModel("qiwi-reasoning")}>Qiwi-Reasoning</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedModel("qiwi-small")}>Qiwi-Small</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex-1 p-4">
            <div className="mx-auto max-w-2xl">
              <h1 className="mb-8 text-center text-3xl font-semibold">Welcome to LeemerChat</h1>
              {/* Chat messages would go here */}
            </div>
          </div>

          <div className="border-t p-4">
            <div className="mx-auto max-w-2xl">
              <div className="relative">
                <Textarea placeholder="Message LeemerChat..." className="min-h-[100px] resize-none pr-20 pt-4" />
                <div className="absolute right-3 top-3 flex items-center gap-2">
                  <Select value={textStyle} onValueChange={setTextStyle}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Text style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="creative">Creative</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost">
                      <ImageIcon className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost">
                      <Link className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                LeemerChat can make mistakes. Consider checking important information.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

