import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Pencil, Star, Sparkles } from "lucide-react"
import { useState } from "react"

interface PricingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PricingDialog({ open, onOpenChange }: PricingDialogProps) {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")

  const pricingTiers = [
    {
      name: "Free",
      icon: <Pencil className="w-4 h-4" />,
      price: { monthly: 0, yearly: 0 },
      description: "Basic access",
      features: ["Rate limited", "Qiwi-small/medium/reasoning", "Access to Nova-Lite/Qwen-Plus/DeepSeek-v3"],
    },
    {
      name: "Plus",
      icon: <Star className="w-4 h-4" />,
      price: { monthly: 8, yearly: 80 },
      description: "Full access",
      features: ["Unlimited access",  "Qiwi-reasoning-ultra","Access to Nova-Pro/Qwen-Max/DeepSeek-R1"],
      popular: true,
      monthlyEquivalent: 6.67,
    },
    {
      name: "Pro",
      icon: <Sparkles className="w-4 h-4" />,
      price: { monthly: 15, yearly: 150 },
      description: "Enterprise features",
      features: ["Everything in Plus", "Access to Claude 3.5/Gemini-2/o3-mini"],
      monthlyEquivalent: 12.50,
    },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-4 bg-background">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold mb-2">Choose your plan</h2>
          <Tabs value={billingCycle} onValueChange={(v) => setBillingCycle(v as "monthly" | "yearly")} className="inline-flex mb-2">
            <TabsList>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="yearly">Yearly (Save 16%)</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="text-sm text-muted-foreground">
            Currently on: <span className="font-medium text-primary">Free Tier</span>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          {pricingTiers.map((tier) => (
            <div key={tier.name} className={`relative p-4 rounded-lg border ${tier.popular ? 'border-blue-500 shadow-md' : 'border-border'}`}>
              {tier.popular && (
                <div className="absolute -top-2 right-2 bg-blue-500 text-white px-2 py-0.5 rounded-full text-xs">
                  Popular
                </div>
              )}
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 rounded-md bg-muted">
                  {tier.icon}
                </div>
                <h3 className="font-semibold">{tier.name}</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{tier.description}</p>
              <div className="mb-3">
                <span className="text-2xl font-bold">
                  €{tier.price[billingCycle]}
                </span>
                <span className="text-sm text-muted-foreground">
                  {billingCycle === "yearly" && tier.monthlyEquivalent ? 
                    ` /year (€${tier.monthlyEquivalent}/mo)` : 
                    tier.price.monthly > 0 ? " /month" : ""}
                </span>
              </div>
              <ul className="space-y-2 text-sm">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="rounded-full bg-green-100 p-1">
                      <svg className="w-2 h-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-3 border-t">
          <div className="bg-blue-50 dark:bg-blue-950 rounded-md p-3 flex items-center justify-between text-sm">
            <span className="text-blue-700 dark:text-blue-300">
              Get 1 Week unlimited acess to Plus tier
            </span>
            <Button variant="outline" size="sm" className="bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800">
              €4 one-time
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
