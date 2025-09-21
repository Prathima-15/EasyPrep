"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Bookmark, BookmarkX, Filter, Heart, Code, Layers, Users, Database } from "lucide-react"
import { useSavedQuestions } from "@/contexts/saved-questions-context"

export default function SavedQuestionsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCompany, setFilterCompany] = useState("all")
  const [filterDifficulty, setFilterDifficulty] = useState("all")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterRound, setFilterRound] = useState("all")
  const [filterFrequency, setFilterFrequency] = useState("all")

  const { savedQuestions, removeSavedQuestion } = useSavedQuestions()

  const companies = Array.from(new Set(savedQuestions.map((q) => q.company).filter(Boolean)))
  const categories = Array.from(new Set(savedQuestions.map((q) => q.topic)))
  const difficulties = ["Easy", "Medium", "Hard"]
  const rounds = Array.from(new Set(savedQuestions.map((q) => q.round).filter(Boolean)))
  const frequencyRanges = [
    { label: "Very High (80%+)", min: 80, max: 100 },
    { label: "High (60-79%)", min: 60, max: 79 },
    { label: "Medium (40-59%)", min: 40, max: 59 },
    { label: "Low (20-39%)", min: 20, max: 39 },
    { label: "Very Low (<20%)", min: 0, max: 19 },
  ]

  const filteredQuestions = savedQuestions.filter((question) => {
    const matchesSearch =
      question.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      question.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCompany = filterCompany === "all" || question.company === filterCompany
    const matchesDifficulty = filterDifficulty === "all" || question.difficulty === filterDifficulty
    const matchesCategory = filterCategory === "all" || question.topic === filterCategory
    const matchesRound = filterRound === "all" || question.round === filterRound

    let matchesFrequency = true
    if (filterFrequency !== "all") {
      const range = frequencyRanges.find((r) => r.label === filterFrequency)
      if (range) {
        matchesFrequency = question.frequency >= range.min && question.frequency <= range.max
      }
    }

    return matchesSearch && matchesCompany && matchesDifficulty && matchesCategory && matchesRound && matchesFrequency
  })

  const groupedQuestions = filteredQuestions.reduce(
    (groups, question) => {
      const topic = question.topic
      if (!groups[topic]) {
        groups[topic] = []
      }
      groups[topic].push(question)
      return groups
    },
    {} as Record<string, typeof filteredQuestions>,
  )

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

  const handleUnsave = (questionId: number) => {
    removeSavedQuestion(questionId)
  }

  const handleLike = (questionId: number) => {
    // Handle liking/unliking question
    console.log("Toggling like for question:", questionId)
  }

  const getTopicIcon = (topic: string) => {
    switch (topic) {
      case "Technical / DSA":
        return Code
      case "System Design":
        return Layers
      case "Behavioral":
        return Users
      case "Database":
        return Database
      default:
        return Code
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Saved Questions</h1>
        <p className="text-muted-foreground">Questions you've bookmarked for later review</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Saved</CardTitle>
            <Bookmark className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{savedQuestions.length}</div>
            <p className="text-xs text-muted-foreground">Questions bookmarked</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Topics</CardTitle>
            <Filter className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Object.keys(groupedQuestions).length}</div>
            <p className="text-xs text-muted-foreground">Different topics</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Companies</CardTitle>
            <Filter className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{companies.length}</div>
            <p className="text-xs text-muted-foreground">Different companies</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Frequency</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {savedQuestions.length > 0
                ? Math.round(savedQuestions.reduce((sum, q) => sum + q.frequency, 0) / savedQuestions.length)
                : 0}
              %
            </div>
            <p className="text-xs text-muted-foreground">Question frequency</p>
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
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search saved questions..."
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
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger>
                <SelectValue placeholder="All Topics" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Topics</SelectItem>
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

      <div className="space-y-6">
        {Object.entries(groupedQuestions).map(([topic, questions]) => {
          const IconComponent = getTopicIcon(topic)
          return (
            <Card key={topic}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconComponent className="h-5 w-5" />
                  {topic} ({questions.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {questions.map((question) => (
                    <div key={question.id} className="p-6 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-medium text-foreground flex-1 pr-4">{question.text}</h3>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Button variant="ghost" size="sm" onClick={() => handleUnsave(question.id)}>
                            <BookmarkX className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mb-3">
                        {question.company && <Badge variant="outline">{question.company}</Badge>}
                        {question.round && <Badge variant="outline">{question.round}</Badge>}
                        <Badge className={getDifficultyColor(question.difficulty)}>{question.difficulty}</Badge>
                        <Badge variant="outline">{question.frequency}% frequency</Badge>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {question.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredQuestions.length === 0 && (
        <div className="text-center py-12">
          <Bookmark className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No saved questions found</h3>
          <p className="text-muted-foreground mb-4">
            {savedQuestions.length === 0
              ? "Start saving questions from company pages or topic pages"
              : "Try adjusting your filters"}
          </p>
          <Button variant="outline">Browse Questions</Button>
        </div>
      )}
    </div>
  )
}
