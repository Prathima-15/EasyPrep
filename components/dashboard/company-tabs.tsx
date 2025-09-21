"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  MessageSquare,
  FileQuestion,
  Plus,
  Star,
  TrendingUp,
  Code,
  Users,
  Database,
  Layers,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"

interface CompanyTabsProps {
  companyId: number
  companyName: string
}

export function CompanyTabs({ companyId, companyName }: CompanyTabsProps) {
  const [activeTab, setActiveTab] = useState("reviews")
  const router = useRouter()

  // Mock data - replace with real data later
  const reviewsData = {
    averageRating: 4.2,
    totalReviews: 89,
    averageDifficulty: 3.4,
    pros: ["Great work-life balance", "Innovative projects", "Strong team collaboration", "Learning opportunities"],
    cons: ["High expectations", "Fast-paced environment", "Complex technical challenges"],
    commonTopics: [
      { name: "System Design", frequency: 78 },
      { name: "Coding", frequency: 92 },
      { name: "Behavioral", frequency: 65 },
      { name: "Technical Discussion", frequency: 71 },
    ],
    recentReviews: [
      {
        id: 1,
        author: "Anonymous",
        role: "Software Engineer",
        rating: 4,
        difficulty: "Hard",
        summary:
          "Great interview experience with focus on system design and coding. Interviewers were friendly and provided good feedback.",
        date: "2 days ago",
      },
      {
        id: 2,
        author: "Anonymous",
        role: "Product Manager",
        rating: 5,
        difficulty: "Medium",
        summary:
          "Well-structured interview process. Questions were relevant to the role and tested both technical and product thinking.",
        date: "1 week ago",
      },
    ],
  }

  const questionsData = {
    totalQuestions: 234,
    categories: [
      {
        name: "Technical / DSA",
        icon: Code,
        count: 89,
        difficulty: "Hard",
        questions: [
          {
            id: 1,
            text: "Implement a LRU Cache with O(1) operations",
            difficulty: "Hard",
            frequency: 85,
            tags: ["Data Structures", "Design"],
          },
          {
            id: 2,
            text: "Find the longest palindromic substring",
            difficulty: "Medium",
            frequency: 72,
            tags: ["Strings", "Dynamic Programming"],
          },
          {
            id: 3,
            text: "Two Sum problem variations",
            difficulty: "Easy",
            frequency: 95,
            tags: ["Arrays", "Hash Table"],
          },
          {
            id: 4,
            text: "Binary Tree Level Order Traversal",
            difficulty: "Medium",
            frequency: 68,
            tags: ["Trees", "BFS"],
          },
          {
            id: 5,
            text: "Merge K Sorted Lists",
            difficulty: "Hard",
            frequency: 78,
            tags: ["Linked Lists", "Heap"],
          },
          {
            id: 6,
            text: "Valid Parentheses",
            difficulty: "Easy",
            frequency: 89,
            tags: ["Stack", "Strings"],
          },
        ],
      },
      {
        name: "System Design",
        icon: Layers,
        count: 45,
        difficulty: "Hard",
        questions: [
          {
            id: 7,
            text: "Design a URL shortening service like bit.ly",
            difficulty: "Hard",
            frequency: 91,
            tags: ["Scalability", "Databases"],
          },
          {
            id: 8,
            text: "Design a chat application like WhatsApp",
            difficulty: "Hard",
            frequency: 85,
            tags: ["Real-time", "Messaging"],
          },
          {
            id: 9,
            text: "Design a social media feed",
            difficulty: "Hard",
            frequency: 76,
            tags: ["Scalability", "Caching"],
          },
          {
            id: 10,
            text: "Design a video streaming service",
            difficulty: "Hard",
            frequency: 82,
            tags: ["CDN", "Video Processing"],
          },
          {
            id: 11,
            text: "Design a ride-sharing service",
            difficulty: "Hard",
            frequency: 79,
            tags: ["Location Services", "Matching"],
          },
        ],
      },
      {
        name: "Behavioral",
        icon: Users,
        count: 67,
        difficulty: "Medium",
        questions: [
          {
            id: 12,
            text: "Tell me about a time you had to work with a difficult team member",
            difficulty: "Medium",
            frequency: 68,
            tags: ["Leadership", "Communication"],
          },
          {
            id: 13,
            text: "Describe a challenging project you worked on",
            difficulty: "Medium",
            frequency: 74,
            tags: ["Problem Solving", "Project Management"],
          },
          {
            id: 14,
            text: "How do you handle tight deadlines?",
            difficulty: "Easy",
            frequency: 82,
            tags: ["Time Management", "Stress"],
          },
          {
            id: 15,
            text: "Tell me about a time you failed",
            difficulty: "Medium",
            frequency: 71,
            tags: ["Learning", "Resilience"],
          },
          {
            id: 16,
            text: "Why do you want to work here?",
            difficulty: "Easy",
            frequency: 95,
            tags: ["Motivation", "Company Research"],
          },
        ],
      },
      {
        name: "Database",
        icon: Database,
        count: 33,
        difficulty: "Medium",
        questions: [
          {
            id: 17,
            text: "Optimize this SQL query for better performance",
            difficulty: "Medium",
            frequency: 54,
            tags: ["SQL", "Performance"],
          },
          {
            id: 18,
            text: "Explain ACID properties",
            difficulty: "Medium",
            frequency: 67,
            tags: ["Database Theory", "Transactions"],
          },
          {
            id: 19,
            text: "Design a database schema for an e-commerce site",
            difficulty: "Hard",
            frequency: 58,
            tags: ["Schema Design", "Normalization"],
          },
          {
            id: 20,
            text: "What are database indexes and when to use them?",
            difficulty: "Medium",
            frequency: 72,
            tags: ["Indexing", "Performance"],
          },
        ],
      },
    ],
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "hard":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleAddReview = () => {
    router.push(`/dashboard/submit?company=${encodeURIComponent(companyName)}`)
  }

  return (
    <div className="space-y-6">
      {/* Add Review/Question Button */}
      <div className="flex justify-end">
        <Button className="bg-primary hover:bg-primary/90" onClick={handleAddReview}>
          <Plus className="h-4 w-4 mr-2" />
          Add Review / Question
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="reviews" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Reviews
          </TabsTrigger>
          <TabsTrigger value="questions" className="flex items-center gap-2">
            <FileQuestion className="h-4 w-4" />
            Questions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="reviews" className="space-y-6">
          {/* Reviews Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{reviewsData.averageRating}/5</div>
                <p className="text-xs text-muted-foreground">From {reviewsData.totalReviews} reviews</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Difficulty</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{reviewsData.averageDifficulty}/5</div>
                <Progress value={reviewsData.averageDifficulty * 20} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{reviewsData.totalReviews}</div>
                <p className="text-xs text-muted-foreground">Student experiences</p>
              </CardContent>
            </Card>
          </div>

          {/* Pros and Cons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-green-600">Pros</CardTitle>
                <CardDescription>What students liked</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {reviewsData.pros.map((pro, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span className="text-sm">{pro}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-red-600">Cons</CardTitle>
                <CardDescription>Areas for improvement</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {reviewsData.cons.map((con, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full" />
                      <span className="text-sm">{con}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Common Topics */}
          <Card>
            <CardHeader>
              <CardTitle>Common Interview Topics</CardTitle>
              <CardDescription>Most frequently mentioned areas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {reviewsData.commonTopics.map((topic, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold text-primary">{topic.frequency}%</div>
                    <div className="text-sm text-muted-foreground">{topic.name}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Reviews */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Reviews</CardTitle>
              <CardDescription>Latest student experiences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {reviewsData.recentReviews.map((review) => (
                <div key={review.id} className="border-b border-border pb-4 last:border-b-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{review.author}</span>
                      <Badge variant="outline">{review.role}</Badge>
                      <Badge className={getDifficultyColor(review.difficulty)}>{review.difficulty}</Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{review.summary}</p>
                  <p className="text-xs text-muted-foreground">{review.date}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="questions" className="space-y-6">
          {/* Questions Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Question Categories</CardTitle>
              <CardDescription>{questionsData.totalQuestions} total questions available</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {questionsData.categories.map((category, index) => (
                  <div key={index} className="text-center p-4 border border-border rounded-lg">
                    <category.icon className="h-8 w-8 text-primary mx-auto mb-2" />
                    <div className="font-medium">{category.name}</div>
                    <div className="text-sm text-muted-foreground">{category.count} questions</div>
                    <Badge className={`${getDifficultyColor(category.difficulty)} mt-2`}>{category.difficulty}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Questions by Category */}
          {questionsData.categories.map((category, categoryIndex) => (
            <Card key={categoryIndex}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <category.icon className="h-5 w-5" />
                  {category.name}
                </CardTitle>
                <CardDescription>{category.count} questions in this category</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  <ul className="space-y-0">
                    {category.questions.slice(0, 5).map((question) => (
                      <li key={question.id} className="p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium flex-1 pr-4">{question.text}</h4>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <Badge className={getDifficultyColor(question.difficulty)}>{question.difficulty}</Badge>
                            <div className="text-sm text-muted-foreground">{question.frequency}% frequency</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {question.tags.map((tag, tagIndex) => (
                            <Badge key={tagIndex} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </li>
                    ))}
                  </ul>
                  {category.questions.length > 5 && (
                    <div className="p-4 border-t border-border">
                      <Link
                        href={`/dashboard/topic/${encodeURIComponent(category.name)}?company=${encodeURIComponent(companyName)}`}
                      >
                        <Button variant="outline" className="w-full bg-transparent">
                          Show More ({category.questions.length - 5} more questions)
                          <ChevronRight className="h-4 w-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
