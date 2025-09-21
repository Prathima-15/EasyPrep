"use client"
import { useState } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Bookmark, BookmarkCheck, Code, Layers, Users, Database, Filter } from "lucide-react"
import Link from "next/link"
import { useSavedQuestions } from "@/contexts/saved-questions-context"
import { toast } from "sonner"

export default function TopicPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const topicName = decodeURIComponent(params.topicName as string)
  const companyName = searchParams.get("company") || "Unknown Company"

  const [filterRound, setFilterRound] = useState("all")
  const [filterDifficulty, setFilterDifficulty] = useState("all")
  const [filterFrequency, setFilterFrequency] = useState("all")

  const { saveQuestion, isQuestionSaved } = useSavedQuestions()

  const getTopicData = (topic: string) => {
    const allTopicsData: Record<string, any> = {
      "Technical / DSA": {
        icon: Code,
        questions: [
          {
            id: 1,
            text: "Implement a LRU Cache with O(1) operations",
            difficulty: "Hard",
            round: "Technical Round 2",
            frequency: 85,
            tags: ["Data Structures", "Design"],
          },
          {
            id: 2,
            text: "Find the longest palindromic substring",
            difficulty: "Medium",
            round: "Technical Round 1",
            frequency: 72,
            tags: ["Strings", "Dynamic Programming"],
          },
          {
            id: 3,
            text: "Two Sum problem variations",
            difficulty: "Easy",
            round: "Technical Round 1",
            frequency: 95,
            tags: ["Arrays", "Hash Table"],
          },
          {
            id: 4,
            text: "Binary Tree Level Order Traversal",
            difficulty: "Medium",
            round: "Technical Round 1",
            frequency: 68,
            tags: ["Trees", "BFS"],
          },
          {
            id: 5,
            text: "Merge K Sorted Lists",
            difficulty: "Hard",
            round: "Technical Round 2",
            frequency: 78,
            tags: ["Linked Lists", "Heap"],
          },
          {
            id: 6,
            text: "Valid Parentheses",
            difficulty: "Easy",
            round: "Technical Round 1",
            frequency: 89,
            tags: ["Stack", "Strings"],
          },
          {
            id: 21,
            text: "Maximum Subarray Sum (Kadane's Algorithm)",
            difficulty: "Medium",
            round: "Technical Round 2",
            frequency: 83,
            tags: ["Arrays", "Dynamic Programming"],
          },
          {
            id: 22,
            text: "Reverse a Linked List",
            difficulty: "Easy",
            round: "Technical Round 1",
            frequency: 92,
            tags: ["Linked Lists", "Pointers"],
          },
        ],
      },
      "System Design": {
        icon: Layers,
        questions: [
          {
            id: 7,
            text: "Design a URL shortening service like bit.ly",
            difficulty: "Hard",
            round: "Technical Round 3",
            frequency: 91,
            tags: ["Scalability", "Databases"],
          },
          {
            id: 8,
            text: "Design a chat application like WhatsApp",
            difficulty: "Hard",
            round: "Technical Round 3",
            frequency: 85,
            tags: ["Real-time", "Messaging"],
          },
          {
            id: 9,
            text: "Design a social media feed",
            difficulty: "Hard",
            round: "Technical Round 3",
            frequency: 76,
            tags: ["Scalability", "Caching"],
          },
          {
            id: 10,
            text: "Design a video streaming service",
            difficulty: "Hard",
            round: "Technical Round 3",
            frequency: 82,
            tags: ["CDN", "Video Processing"],
          },
          {
            id: 11,
            text: "Design a ride-sharing service",
            difficulty: "Hard",
            round: "Technical Round 3",
            frequency: 79,
            tags: ["Location Services", "Matching"],
          },
        ],
      },
      Behavioral: {
        icon: Users,
        questions: [
          {
            id: 12,
            text: "Tell me about a time you had to work with a difficult team member",
            difficulty: "Medium",
            round: "HR Round",
            frequency: 68,
            tags: ["Leadership", "Communication"],
          },
          {
            id: 13,
            text: "Describe a challenging project you worked on",
            difficulty: "Medium",
            round: "HR Round",
            frequency: 74,
            tags: ["Problem Solving", "Project Management"],
          },
          {
            id: 14,
            text: "How do you handle tight deadlines?",
            difficulty: "Easy",
            round: "HR Round",
            frequency: 82,
            tags: ["Time Management", "Stress"],
          },
          {
            id: 15,
            text: "Tell me about a time you failed",
            difficulty: "Medium",
            round: "Managerial Round",
            frequency: 71,
            tags: ["Learning", "Resilience"],
          },
          {
            id: 16,
            text: "Why do you want to work here?",
            difficulty: "Easy",
            round: "HR Round",
            frequency: 95,
            tags: ["Motivation", "Company Research"],
          },
        ],
      },
      Database: {
        icon: Database,
        questions: [
          {
            id: 17,
            text: "Optimize this SQL query for better performance",
            difficulty: "Medium",
            round: "Technical Round 2",
            frequency: 54,
            tags: ["SQL", "Performance"],
          },
          {
            id: 18,
            text: "Explain ACID properties",
            difficulty: "Medium",
            round: "Technical Round 1",
            frequency: 67,
            tags: ["Database Theory", "Transactions"],
          },
          {
            id: 19,
            text: "Design a database schema for an e-commerce site",
            difficulty: "Hard",
            round: "Technical Round 2",
            frequency: 58,
            tags: ["Schema Design", "Normalization"],
          },
          {
            id: 20,
            text: "What are database indexes and when to use them?",
            difficulty: "Medium",
            round: "Technical Round 1",
            frequency: 72,
            tags: ["Indexing", "Performance"],
          },
        ],
      },
    }
    return allTopicsData[topic] || { icon: Code, questions: [] }
  }

  const topicData = getTopicData(topicName)
  const IconComponent = topicData.icon

  const rounds = Array.from(new Set(topicData.questions.map((q: any) => q.round)))
  const difficulties = ["Easy", "Medium", "Hard"]
  const frequencyRanges = [
    { label: "Very High (80%+)", min: 80, max: 100 },
    { label: "High (60-79%)", min: 60, max: 79 },
    { label: "Medium (40-59%)", min: 40, max: 59 },
    { label: "Low (20-39%)", min: 20, max: 39 },
    { label: "Very Low (<20%)", min: 0, max: 19 },
  ]

  const filteredQuestions = topicData.questions.filter((question: any) => {
    const matchesRound = filterRound === "all" || question.round === filterRound
    const matchesDifficulty = filterDifficulty === "all" || question.difficulty === filterDifficulty

    let matchesFrequency = true
    if (filterFrequency !== "all") {
      const range = frequencyRanges.find((r) => r.label === filterFrequency)
      if (range) {
        matchesFrequency = question.frequency >= range.min && question.frequency <= range.max
      }
    }

    return matchesRound && matchesDifficulty && matchesFrequency
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

  const handleSaveQuestion = (question: any) => {
    const questionToSave = {
      ...question,
      topic: topicName,
      company: companyName,
    }
    saveQuestion(questionToSave)
    toast.success("Question saved successfully!")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/companies/${companyName.toLowerCase().replace(/\s+/g, "-")}`}>
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to {companyName}
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <IconComponent className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">{topicName}</h1>
        </div>
      </div>

      {/* Topic Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconComponent className="h-5 w-5" />
            {topicName} Questions
          </CardTitle>
          <CardDescription>
            Showing {filteredQuestions.length} of {topicData.questions.length} questions for {topicName} at{" "}
            {companyName}
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select value={filterRound} onValueChange={setFilterRound}>
              <SelectTrigger>
                <SelectValue placeholder="All Rounds" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Rounds</SelectItem>
                {rounds.map((round) => (
                  <SelectItem key={round} value={round}>
                    {round}
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
            <Select value={filterFrequency} onValueChange={setFilterFrequency}>
              <SelectTrigger>
                <SelectValue placeholder="All Frequencies" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Frequencies</SelectItem>
                {frequencyRanges.map((range) => (
                  <SelectItem key={range.label} value={range.label}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Questions List */}
      <Card>
        <CardContent className="p-0">
          <ul className="divide-y divide-border">
            {filteredQuestions.map((question: any) => (
              <li key={question.id} className="p-6 hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-medium text-lg flex-1 pr-4">{question.text}</h3>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge variant="outline">{question.round}</Badge>
                    <Badge className={getDifficultyColor(question.difficulty)}>{question.difficulty}</Badge>
                    <div className="text-sm text-muted-foreground">{question.frequency}% frequency</div>
                    <Button
                      variant={isQuestionSaved(question.id) ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleSaveQuestion(question)}
                      disabled={isQuestionSaved(question.id)}
                    >
                      {isQuestionSaved(question.id) ? (
                        <>
                          <BookmarkCheck className="h-4 w-4 mr-1" />
                          Saved
                        </>
                      ) : (
                        <>
                          <Bookmark className="h-4 w-4 mr-1" />
                          Save
                        </>
                      )}
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {question.tags.map((tag: string, tagIndex: number) => (
                    <Badge key={tagIndex} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {filteredQuestions.length === 0 && (
        <div className="text-center py-12">
          <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No questions found</h3>
          <p className="text-muted-foreground mb-4">Try adjusting your filters to see more questions</p>
          <Button
            variant="outline"
            onClick={() => {
              setFilterRound("all")
              setFilterDifficulty("all")
              setFilterFrequency("all")
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  )
}
