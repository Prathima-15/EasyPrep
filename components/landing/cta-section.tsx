"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"

export function CTASection() {
  const router = useRouter()

  return (
    <section className="py-20 bg-primary">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
          Ready to Transform Your Interview Preparation?
        </h2>
        <p className="text-xl text-primary-foreground/90 mb-8 leading-relaxed">
          Join thousands of students who are already using AI-powered insights to land their dream jobs. Start your
          journey today.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            size="lg"
            onClick={() => router.push("/auth")}
            className="bg-background text-foreground hover:bg-background/90 px-8 py-4 text-lg"
          >
            Get Started Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary px-8 py-4 text-lg bg-transparent"
          >
            Schedule Demo
          </Button>
        </div>
      </div>
    </section>
  )
}
