"use client"

import { X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface InfoPopupProps {
  isOpen: boolean
  onClose: () => void
  selectedModel: string
  onModelChange: (model: string) => void
}

export function InfoPopup({ isOpen, onClose, selectedModel, onModelChange }: InfoPopupProps) {
  const modelInfo = {
    "qiwi-small": {
      name: "Qiwi-Small: The Rapid Responder",
      provider: "OrionAI",
      parameters: "11B",
      description:
        "11B parameter model optimized for instant responses. Perfect for quick queries with 2s response time and 128k context window.",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/replicate-prediction-6kk6q0jjc9rme0cmys2rwhq444-ixxFPilTksFecYtWDbUoidPyMTrOcv.png",
    },
    "qiwi-medium": {
      name: "Qiwi-Medium: The Balanced Brilliance",
      provider: "OrionAI",
      parameters: "32B",
      description:
        "32B parameter model delivering full smart answers. Balanced performance with fast response time and 128k context window.",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/replicate-prediction-7aq5ytpzk1rma0cmys89h0tfc4-6iclTYSCk9cuyL6k7EOUCqCHdE9iVU.png",
    },
    "qiwi-reasoning": {
      name: "Qiwi-Reasoning: The Problem-Solving Titan",
      provider: "OrionAI",
      parameters: "108B",
      description:
        "108B parameter powerhouse for advanced problem solving. Features fast open reasoning and 133k context window.",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/replicate-prediction-mdtwdjxf1drm80cmysbrmq28xw-r4j4t73EZ55dlXXH8cZgN918iH59Cs.png",
    },
  }

  const model = modelInfo[selectedModel as keyof typeof modelInfo]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{model.name}</span>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue={selectedModel} onValueChange={onModelChange}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="qiwi-small">Small</TabsTrigger>
            <TabsTrigger value="qiwi-medium">Medium</TabsTrigger>
            <TabsTrigger value="qiwi-reasoning">Reasoning</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="mt-4 space-y-4">
          <div className="aspect-[4/3] overflow-hidden rounded-lg">
            <img
              src={model.image}
              alt={model.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <h4 className="font-medium">Provider</h4>
            <p className="text-sm text-muted-foreground">{model.provider}</p>
          </div>
          <div>
            <h4 className="font-medium">Parameters</h4>
            <p className="text-sm text-muted-foreground">{model.parameters}</p>
          </div>
          <div>
            <h4 className="font-medium">Description</h4>
            <p className="text-sm text-muted-foreground">{model.description}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
