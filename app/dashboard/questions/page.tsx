"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Search, FileQuestion, TrendingUp, Award, Filter, Plus, Eye, Edit, Trash2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export default function MyQuestionsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCompany, setFilterCompany] = useState("all")
  const [filterDifficulty, setFilterDifficulty] = useState("all")
  const [filterCategory, setFilterCategory] = useState("all")
  const { user } = useAuth()
  const router = useRouter()

  const handleAddQuestion = () => {
    router.push("/dashboard/submit")
  }

  // Mock data - replace with real data later
  const userStats = {
    totalQuestions: 23,
    averageDifficulty: 2.8,
    totalViews: 1247,
    helpfulVotes: 89,
    contributionRank: 12,
  }

  const myQuestions = [
    {
      id: 1,
      question: "Implement a thread-safe singleton pattern in Java",
      company: "Google",
      category: "Technical / DSA",
      difficulty: "Medium",
      aiDifficultyScore: 2.7,
      confidence: 85,
      submittedDate: "2024-01-15",
      views: 156,
      helpfulVotes: 12,
      similarCount: 8,
      tags: ["Java", "Design Patterns", "Concurrency"],
      round: "Technical Round 2",
      feedback: "Well-structured question with clear requirements. Good for testing OOP concepts.",
    },
    {
      id: 2,
      question: "Design a rate limiter for an API gateway",
      company: "Amazon",
      category: "System Design",
      difficulty: "Hard",
      aiDifficultyScore: 4.2,
      confidence: 92,
      submittedDate: "2024-01-10",
      views: 234,
      helpfulVotes: 18,
      similarCount: 15,
      tags: ["System Design", "Scalability", "Algorithms"],
      round: "System Design Round",
      feedback: "Excellent system design question covering multiple concepts like algorithms and scalability.",
    },
    {
      id: 3,
      question: "Tell me about a time you had to learn a new technology quickly",
      company: "Microsoft",
      category: "Behavioral",
      difficulty: "Easy",
      aiDifficultyScore: 1.5,
      confidence: 78,
      submittedDate: "2024-01-08",
      views: 89,
      helpfulVotes: 7,
      similarCount: 23,
      tags: ["Learning", "Adaptability", "Communication"],
      round: "HR Round",
      feedback: "Common behavioral question that tests adaptability and learning mindset.",
    },
    {
      id: 4,
      question: "Optimize this SQL query for better performance",
      company: "Meta",
      category: "Database",
      difficulty: "Medium",
      aiDifficultyScore: 3.1,
      confidence: 88,
      submittedDate: "2024-01-05",
      views: 178,
      helpfulVotes: 14,
      similarCount: 11,
      tags: ["SQL", "Performance", "Optimization"],
      round: "Technical Round 1",
      feedback: "Practical database question focusing on query optimization techniques.",
    },
  ]

  const companies = ["Google", "Amazon", "Microsoft", "Meta", "Apple", "Netflix"]
  const categories = ["Technical / DSA", "System Design", "Behavioral", "Database", "Coding"]
  const difficulties = ["Easy", "Medium", "Hard"]

  const filteredQuestions = myQuestions.filter((question) => {
    const matchesSearch =
      question.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      question.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCompany = filterCompany === "all" || question.company === filterCompany
    const matchesDifficulty = filterDifficulty === "all" || question.difficulty === filterDifficulty
    const matchesCategory = filterCategory === "all" || question.category === filterCategory

    return matchesSearch && matchesCompany && matchesDifficulty && matchesCategory
  })

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Interview Questions</h1>
          <p className="text-muted-foreground">Questions you've contributed to the community</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90" onClick={handleAddQuestion}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Question
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
            <FileQuestion className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.totalQuestions}</div>
            <p className="text-xs text-muted-foreground">Contributed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Difficulty</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.averageDifficulty}/5</div>
            <Progress value={userStats.averageDifficulty * 20} className="mt-1" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.totalViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Community views</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Helpful Votes</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.helpfulVotes}</div>
            <p className="text-xs text-muted-foreground">From community</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rank</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">#{userStats.contributionRank}</div>
            <p className="text-xs text-muted-foreground">Top contributor</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterCompany} onValueChange={setFilterCompany}>
              <SelectTrigger>
                <SelectValue placeholder="All Companies" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Companies</SelectItem>
                {companies.map((company) => (
                  <SelectItem key={company} value={company}>
                    {company}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
              <SelectTrigger>
                <SelectValue placeholder="All Difficulties" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Difficulties</SelectItem>
                {difficulties.map((difficulty) => (
                  <SelectItem key={difficulty} value={difficulty}>
                    {difficulty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Questions List */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>My Questions ({filteredQuestions.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {filteredQuestions.map((question) => (
                <div key={question.id} className="p-6 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-medium text-foreground flex-1 pr-4">{question.question}</h3>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="outline">{question.company}</Badge>
                    <Badge variant="outline">{question.category}</Badge>
                    <Badge className={getDifficultyColor(question.difficulty)}>{question.difficulty}</Badge>
                    <Badge variant="outline">{question.round}</Badge>
                  </div>

                  {/* AI Analysis */}
                  <div className="bg-muted/50 p-4 rounded-lg mb-3">
                    <h4 className="font-medium mb-2">AI Analysis</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Difficulty Score:</span>
                        <div className="flex items-center gap-2 mt-1">
                          <Progress value={question.aiDifficultyScore * 20} className="flex-1" />
                          <span className="font-medium">{question.aiDifficultyScore}/5</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">AI Confidence:</span>
                        <div className="flex items-center gap-2 mt-1">
                          <Progress value={question.confidence} className="flex-1" />
                          <span className="font-medium">{question.confidence}%</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Similar Questions:</span>
                        <div className="font-medium mt-1">{question.similarCount} found</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                    <div className="text-center">
                      <div className="font-medium text-lg">{question.views}</div>
                      <div className="text-muted-foreground">Views</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-lg">{question.helpfulVotes}</div>
                      <div className="text-muted-foreground">Helpful</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-lg">{question.submittedDate}</div>
                      <div className="text-muted-foreground">Submitted</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {question.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="bg-accent/10 p-3 rounded-lg">
                    <p className="text-sm text-muted-foreground italic">"{question.feedback}"</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {filteredQuestions.length === 0 && (
        <div className="text-center py-12">
          <FileQuestion className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No questions found</h3>
          <p className="text-muted-foreground mb-4">Try adjusting your filters or add your first question</p>
          <Button className="bg-primary hover:bg-primary/90" onClick={handleAddQuestion}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Question
          </Button>
        </div>
      )}
    </div>
  )
}
