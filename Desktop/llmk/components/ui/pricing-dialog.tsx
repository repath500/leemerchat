import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Pencil,
  Star,
  Sparkles,
  Globe2,
  Image as ImageIcon,
  Bot,
  Zap,
  Award,
  Flag,
  Heart,
  Lock,
} from "lucide-react";
import { useState } from "react";

interface PricingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PricingDialog({ open, onOpenChange }: PricingDialogProps) {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  const pricingTiers = [
    {
      name: "Free",
      icon: <Pencil className="w-4 h-4" />,
      price: { monthly: 0, yearly: 0 },
      description: "Basic access",
      features: [
        "Unlimited Qiwi‑small messages",
        "Rate‑limited qiwi-medium/reasoning messages",
        "Partner models: 25 messages/day",
      ],
      detailedFeatures: {
        models: {
          icon: <Bot className="w-4 h-4" />,
          title: "Available Models",
          items: [
            "Unlimited Qiwi‑small messages",
            "Rate‑limited qiwi-medium/reasoning messages",
            "Partner models: 25 messages/day",
            "DeepSeek‑v3, Nova‑Lite, Qwen‑Plus",
          ],
        },
        limits: {
          icon: <Zap className="w-4 h-4" />,
          title: "Usage Info",
          items: [
            "No token limits",
            "no web access or file upload",
            "Rate limits based on server usage",
            "Fast qiwi response time",
            "Slower partner models response time",
          ],
        },
      },
    },
    {
      name: "Plus",
      icon: <Star className="w-4 h-4" />,
      price: { monthly: 8, yearly: 80 },
      description: "Full access",
      popular: true,
      monthlyEquivalent: 6.67,
      features: ["Unlimited Qiwi Messages", "Web & file upload + Image Gen", "Partner models: Unlimited usage"],
      savings:
        billingCycle === "yearly"
          ? "Save €160/year vs ChatGPT Plus!"
          : "Save €12/month vs ChatGPT Plus!",
      detailedFeatures: {
        models: {
          icon: <Bot className="w-4 h-4" />,
          title: "Enhanced Models",
          items: [
            "Everything in Free tier",
            "25 messages/day to Qiwi‑reasoning‑large or o3‑mini",
            "Nova‑Pro access",
            "Qwen‑Max access",
            "DeepSeek‑R1 access",
          ],
        },
        advanced: {
          icon: <Globe2 className="w-4 h-4" />,
          title: "Advanced Features",
          items: [
            "Web browsing access",
            "File upload & analysis",
            "Partner models: Unlimited usage",
          ],
        },
        generation: {
          icon: <ImageIcon className="w-4 h-4" />,
          title: "Generation",
          items: [
            "100 images/month",
            "Via FLUX.1[dev] or Playground‑v2.5",
            "Priority response time",
          ],
        },
      },
    },
    {
      name: "Pro",
      icon: <Sparkles className="w-4 h-4" />,
      price: { monthly: 15, yearly: 150 },
      description: "Premium features",
      monthlyEquivalent: 12.5,
      features: ["Premium AI Models", "Beta Access", "Partner models: Unlimited usage"],
      savings:
        billingCycle === "yearly"
          ? "Save €2250/year vs ChatGPT Pro!"
          : "Save €185/month vs ChatGPT Pro!",
      detailedFeatures: {
        models: {
          icon: <Bot className="w-4 h-4" />,
          title: "Premium Models",
          items: [
            "Everything in Plus tier",
            "100 messages/day to Qiwi‑reasoning‑large or o3‑mini",
            "Claude 3.5 access",
            "GPT4o access",
            "Gemini‑2‑pro access",
          ],
        },
        generation: {
          icon: <ImageIcon className="w-4 h-4" />,
          title: "Generation",
          items: [
            "250 images/month",
            "Access to FLUX.1[Pro]",
            "Access to Playground‑v2.5",
            "Access to StableDiffusion‑3",
            "Beta access to video generation via Kling‑v1.6",
          ],
        },
      },
    },
  ];

  const specializedTiers = [
    {
      name: "Leestral",
      icon: <Flag className="w-4 h-4" />,
      price: 12,
      description: "Pure European AI Solution",
      theme:
        "bg-gradient-to-r from-orange-50 to-yellow-50",
      badge: {
        text: "Pure European",
        subtext: "OrionAI x Mistral AI",
        className: "bg-orange-100 text-orange-700",
      },
      features: {
        models: [
          "Same qiwi access as Free",
          "Mistral‑large/Codestral‑large/Pixtral‑large",
          "Early access to MistralAi models",
          "Unlimited Mistral Ai access",
        ],
        additional: [
          "Web access & file upload",
          "100x FLUX.1[dev]/Playgroundv2.5 image generations",
          "European data processing",
        ],
      },
    },
    {
      name: "LeemerGemini",
      icon: <Zap className="w-4 h-4" />, // Replacing Flash with Zap
      price: 5,
      description: "Google's Latest Models",
      theme:
        "bg-gradient-to-r from-blue-50 to-cyan-50",
      features: {
        models: [
          "Same qiwi access as Free",
          "250 messages to Gemini‑2‑flash‑thinking",
          "Unlimited Gemini‑2‑flash",
          "2M context tokens",
        ],
        additional: [
          "Web access & file upload",
          "25x Flux.1[schell] image generations",
          "Strong reasoning via Flash-thinking",
        ],
      },
    },
    {
      name: "LeemerGemini Pro",
      icon: <Zap className="w-4 h-4" />, // Replacing Flash with Zap
      price: 12,
      description: "Advanced Google Integration",
      theme:
        "bg-gradient-to-r from-blue-100 to-cyan-100",
      features: {
        models: [
          "Same qiwi access as Free",
          "Unlimited Gemini‑2‑Flash/Pro access",
          "2M context tokens",
          "1000 messages to Gemini‑2‑Flash-thinking",
        ],
        additional: [
          "Web access & file upload",
          "100x Flux.1[schell] image generations",
          "Priority support",
        ],
      },
    },
    {
      name: "LeemerChat+Ari",
      icon: <Heart className="w-4 h-4" />,
      price: "Your Plan + €4",
      description: "Uncensored AI Assistant",
      theme: "bg-gradient-to-r from-gray-800 to-black text-gray-200",
      badge: {
        text: "18+ Only",
        className: "bg-red-100 text-red-900",
      },
      features: {
        models: [
          "12B specialized NSFW ari-1.5",
          "33k context tokens",
          "Uncensored outputs",
          "No content restrictions",
        ],
        additional: [
          "Perfect for adult content writers",
          "Creative writing assistance",
          "Unrestricted conversations",
        ],
      },
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto p-4 bg-background">
        {/* Header & Billing Cycle */}
        <div className="text-center mb-4">
          <h2 className="text-xl font-bold mb-2 text-primary">Choose Your Plan</h2>
          <Tabs
            value={billingCycle}
            onValueChange={(v) => setBillingCycle(v as "monthly" | "yearly")}
            className="inline-flex mb-2"
          >
            <TabsList className="grid w-full max-w-[300px] grid-cols-2">
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="yearly" className="relative">
                Yearly
                <span className="absolute -top-2 -right-2 bg-green-100 text-green-700 text-[10px] px-1 rounded-full">
                  -16%
                </span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="text-xs text-muted-foreground">
            Currently on: <span className="font-medium text-primary">Free Tier</span>
          </div>
        </div>

        {/* Pricing Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {pricingTiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative p-3 rounded-lg border bg-card hover:shadow-md transition-all ${
                tier.popular
                  ? "border-primary shadow-sm ring-1 ring-primary/20"
                  : "border-border hover:border-primary/50"
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-2 right-2 bg-primary text-primary-foreground px-2 py-0.5 rounded-full text-xs">
                  Popular
                </div>
              )}

              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 rounded-md bg-primary/10 text-primary">
                  {tier.icon}
                </div>
                <div>
                  <h3 className="font-semibold">{tier.name}</h3>
                  <p className="text-xs text-muted-foreground">{tier.description}</p>
                </div>
              </div>

              <div className="mb-3">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold">{tier.price[billingCycle]}</span>
                  <span className="text-xs text-muted-foreground">
                    {billingCycle === "yearly" && tier.monthlyEquivalent
                      ? `/year (€${tier.monthlyEquivalent}/mo)`
                      : tier.price.monthly > 0
                      ? "/month"
                      : ""}
                  </span>
                </div>
                {tier.savings && (
                  <div className="mt-0.5 text-xs text-green-600 dark:text-green-400">
                    {tier.savings}
                  </div>
                )}
              </div>

              <Button className="w-full mb-3 py-1 h-8 text-sm" variant={tier.popular ? "default" : "outline"}>
                Get Started
              </Button>

              <div className="space-y-3">
                <ul className="space-y-1 text-xs">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-1.5">
                      <div className="rounded-full bg-primary/10 p-0.5">
                        <svg className="w-2 h-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="features" className="border-none">
                    <AccordionTrigger className="text-xs py-1 hover:no-underline">
                      View detailed features
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3 text-xs">
                        {Object.entries(tier.detailedFeatures).map(([key, category]) => (
                          <div key={key} className="space-y-1">
                            <div className="flex items-center gap-1.5">
                              {category.icon}
                              <h4 className="font-medium">{category.title}</h4>
                            </div>
                            <ul className="space-y-1 text-muted-foreground ml-4">
                              {category.items.map((item, index) => (
                                <li key={index} className="flex items-center gap-1.5">
                                  <div className="w-1 h-1 rounded-full bg-primary/50" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          ))}
        </div>

        {/* 1-Week Trial Offer */}
        <div className="mt-4 pt-3 border-t">
          <div className="bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-900 dark:to-blue-800 rounded-lg p-4 flex flex-col md:flex-row items-center justify-between gap-2">
            <span className="text-sm text-blue-700 dark:text-blue-300 text-center md:text-left font-medium">
              Try Plus tier for 1 week with unlimited access
            </span>
            <Button
              variant="default"
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white w-full md:w-auto animate-pulse"
            >
              €5 one‑time
            </Button>
          </div>
        </div>

{/* Specialized Solutions */}
<div className="mt-6 pt-4 border-t">
  <h3 className="text-lg font-semibold mb-4 text-center">Specialized Solutions</h3>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {specializedTiers.map((tier) => (
      <div
        key={tier.name}
        className={`relative p-6 rounded-xl border hover:shadow-lg transition-all ${tier.theme} overflow-hidden`}
      >
        {tier.badge && (
          <div className="absolute -top-2 right-4 px-3 py-1 rounded-full text-xs flex flex-col items-center gap-0.5">
            <span className={`${tier.badge.className} font-medium py-0.5 px-2 rounded-full`}>
              {tier.badge.text}
            </span>
            {tier.badge.subtext && (
              <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                {tier.badge.subtext}
              </span>
            )}
          </div>
        )}

        <div className="flex items-start gap-3 mb-4">
          <div
            className={`p-2 rounded-lg ${
              tier.name.includes("Gemini")
                ? "bg-blue-100 text-blue-700"
                : tier.name.includes("Mistral")
                ? "bg-orange-100 text-orange-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {tier.icon}
          </div>
          <div>
            <h3 className="font-semibold text-lg">{tier.name}</h3>
            <p className="text-sm text-muted-foreground">{tier.description}</p>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold">
              {typeof tier.price === "number" ? `€${tier.price}` : tier.price}
            </span>
            <span className="text-sm text-muted-foreground">/month</span>
          </div>
        </div>

        {tier.features.warning ? (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/50 text-red-700 dark:text-red-300 rounded-lg text-sm flex items-center gap-2">
            <Lock className="w-4 h-4 flex-shrink-0" />
            <span>{tier.features.warning}</span>
          </div>
        ) : null}

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="features" className="border-none">
            <AccordionTrigger className="text-sm py-2 hover:no-underline">
              Available Features
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-3">Models</h4>
                  <ul className="space-y-2">
                    {tier.features.models.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Bot className="w-4 h-4 text-primary flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-3">Additional Features</h4>
                  <ul className="space-y-2">
                    {tier.features.additional.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Award className="w-4 h-4 text-primary flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Button 
          variant="outline" 
          size="lg" 
          className="w-full mt-6 font-medium"
        >
          Subscribe Now
        </Button>
      </div>
    ))}
  </div>
</div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t">
          <div className="flex flex-col items-center text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              All plans include free partner model support, regular updates, and our security guarantee
            </p>
            <Button variant="link" size="sm" className="text-primary">
              Compare all features
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
