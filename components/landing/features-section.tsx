import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, MessageSquare, Target, Zap } from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      icon: MessageSquare,
      title: "AI-Powered Feedback Aggregation",
      description:
        "Get comprehensive insights from thousands of real interview experiences, automatically summarized and categorized by our AI.",
    },
    {
      icon: BarChart3,
      title: "Smart Difficulty Analytics",
      description:
        "Understand question difficulty patterns across companies and roles with AI-driven analytics and personalized recommendations.",
    },
    {
      icon: Target,
      title: "Personalized Study Paths",
      description:
        "Receive customized preparation plans based on your target companies, role preferences, and current skill level.",
    },
    {
      icon: Zap,
      title: "Real-Time Question Trends",
      description:
        "Stay updated with the latest interview questions and trending topics across top companies in your field.",
    },
  ]

  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">AI Features That Make a Difference</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Leverage cutting-edge AI technology to transform how you prepare for interviews
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-card hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-lg font-semibold">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center leading-relaxed">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
