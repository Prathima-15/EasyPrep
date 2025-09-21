import { Card, CardContent } from "@/components/ui/card"
import { Search, BarChart, BookOpen, Trophy } from "lucide-react"

export function HowItWorksSection() {
  const steps = [
    {
      icon: Search,
      title: "Explore Companies",
      description: "Browse through hundreds of companies and their interview experiences shared by students.",
    },
    {
      icon: BookOpen,
      title: "Study Questions",
      description: "Access categorized questions with AI-generated difficulty ratings and learning resources.",
    },
    {
      icon: BarChart,
      title: "Track Progress",
      description: "Monitor your preparation with personalized analytics and performance insights.",
    },
    {
      icon: Trophy,
      title: "Ace Interviews",
      description: "Apply your knowledge confidently and land your dream job with data-driven preparation.",
    },
  ]

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">How EasyPrep Works</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Four simple steps to transform your interview preparation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <Card className="bg-card hover:shadow-lg transition-shadow duration-300 h-full">
                <CardContent className="p-6 text-center">
                  <div className="mx-auto mb-4 p-4 bg-accent/10 rounded-full w-fit">
                    <step.icon className="h-8 w-8 text-accent" />
                  </div>
                  <div className="absolute -top-3 -left-3 bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
