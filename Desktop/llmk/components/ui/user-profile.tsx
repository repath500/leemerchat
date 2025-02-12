"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X, User } from "lucide-react"

interface UserProfileProps {
  isOpen: boolean
  onClose: () => void
}

export function UserProfile({ isOpen, onClose }: UserProfileProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5" />
              <span>User Profile</span>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="rounded-lg border p-4">
            <h3 className="font-semibold mb-2">Content Warning</h3>
            <p className="text-sm text-muted-foreground">
              LeemerChat is not responsible for its outputs. Please use the service responsibly and verify any important
              information from reliable sources.
            </p>
          </div>
          <div className="grid gap-2">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Email</span>
              <span className="text-muted-foreground">user@example.com</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold">Plan</span>
              <span className="text-muted-foreground">Free</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

