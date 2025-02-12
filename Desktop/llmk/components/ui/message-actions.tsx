"use client"

import { Copy, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"

interface MessageActionsProps {
  content: string
  onEdit: (newContent: string) => void
  isUser: boolean
}

export function MessageActions({ content, onEdit, isUser }: MessageActionsProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(content)

  const handleCopy = () => {
    navigator.clipboard.writeText(content)
  }

  const handleSave = () => {
    onEdit(editedContent)
    setIsEditing(false)
  }

  if (!isUser) {
    return (
      <div className="flex gap-2 mt-2">
        <Button variant="ghost" size="sm" onClick={handleCopy}>
          <Copy className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  if (isEditing) {
    return (
      <div className="mt-2">
        <Textarea
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          className="min-h-[100px] mb-2"
        />
        <div className="flex gap-2">
          <Button size="sm" onClick={handleSave}>
            Save
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>
            Cancel
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-2 mt-2">
      <Button variant="ghost" size="sm" onClick={handleCopy}>
        <Copy className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
        <Pencil className="h-4 w-4" />
      </Button>
    </div>
  )
}

