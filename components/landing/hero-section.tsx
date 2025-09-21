"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Brain, TrendingUp, Users } from "lucide-react"
import { useRouter } from "next/navigation"

export function HeroSection() {
  const router = useRouter()

  return (
    <section id="home" className="bg-background py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Hero Headline */}
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Transform Your Interview
            <br />
            <span className="text-primary">Preparation with AI</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Get personalized feedback, difficulty analytics, and AI-powered insights from thousands of real interview
            experiences. Join students who've landed their dream jobs.
          </p>

          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button
              size="lg"
              onClick={() => router.push("/auth")}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg"
            >
              Start Preparing Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-4 text-lg bg-transparent">
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-8 w-8 text-accent mr-2" />
                <span className="text-3xl font-bold text-foreground">10K+</span>
              </div>
              <p className="text-muted-foreground">Students Helped</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Brain className="h-8 w-8 text-accent mr-2" />
                <span className="text-3xl font-bold text-foreground">50K+</span>
              </div>
              <p className="text-muted-foreground">Questions Analyzed</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="h-8 w-8 text-accent mr-2" />
                <span className="text-3xl font-bold text-foreground">85%</span>
              </div>
              <p className="text-muted-foreground">Success Rate</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
