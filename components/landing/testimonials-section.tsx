import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Software Engineer at Google",
      college: "Stanford University",
      content:
        "EasyPrep's AI insights helped me understand exactly what to expect. The difficulty ratings were spot-on and saved me weeks of preparation time.",
      rating: 5,
    },
    {
      name: "Michael Rodriguez",
      role: "Product Manager at Microsoft",
      college: "UC Berkeley",
      content:
        "The feedback aggregation feature is incredible. I could see patterns across different interview rounds and prepare accordingly.",
      rating: 5,
    },
    {
      name: "Priya Patel",
      role: "Data Scientist at Meta",
      college: "MIT",
      content:
        "Thanks to EasyPrep's analytics, I knew exactly which topics to focus on. Got my dream job on the first try!",
      rating: 5,
    },
  ]

  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Success Stories</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of students who've landed their dream jobs with EasyPrep
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-card hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 leading-relaxed italic">"{testimonial.content}"</p>
                <div className="border-t border-border pt-4">
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-primary">{testimonial.role}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.college}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
