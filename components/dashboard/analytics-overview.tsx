"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Users, Brain, Target, Clock, Award } from "lucide-react"

export function AnalyticsOverview() {
  // Mock data - replace with real data later
  const stats = {
    totalQuestions: 1247,
    companiesExplored: 23,
    averageDifficulty: 2.4,
    studyStreak: 7,
    questionsAnswered: 89,
    successRate: 78,
  }

  const trendingTopics = [
    { name: "System Design", count: 156, difficulty: "Hard", trend: "+12%" },
    { name: "Dynamic Programming", count: 134, difficulty: "Medium", trend: "+8%" },
    { name: "Behavioral Questions", count: 98, difficulty: "Easy", trend: "+15%" },
    { name: "Database Design", count: 87, difficulty: "Medium", trend: "+5%" },
  ]

  const recentActivity = [
    { company: "Google", questions: 12, difficulty: "Hard", date: "2 hours ago" },
    { company: "Microsoft", questions: 8, difficulty: "Medium", date: "1 day ago" },
    { company: "Amazon", questions: 15, difficulty: "Hard", date: "2 days ago" },
  ]

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
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back!</h1>
        <p className="text-muted-foreground">Here's your interview preparation progress overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalQuestions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Available in database</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Companies Explored</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.companiesExplored}</div>
            <p className="text-xs text-muted-foreground">Out of 150+ available</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Study Streak</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.studyStreak} days</div>
            <p className="text-xs text-muted-foreground">Keep it up!</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Questions Answered</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.questionsAnswered}</div>
            <Progress value={65} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">65% of weekly goal</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.successRate}%</div>
            <p className="text-xs text-muted-foreground">+5% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Difficulty</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageDifficulty}/5</div>
            <Progress value={stats.averageDifficulty * 20} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">Medium level</p>
          </CardContent>
        </Card>
      </div>

      {/* Trending Topics and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trending Topics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Trending Topics
            </CardTitle>
            <CardDescription>Most asked questions this week</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {trendingTopics.map((topic, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{topic.name}</span>
                    <Badge className={getDifficultyColor(topic.difficulty)}>{topic.difficulty}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{topic.count} questions</p>
                </div>
                <div className="text-sm font-medium text-green-600">{topic.trend}</div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>Your latest study sessions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{activity.company}</span>
                    <Badge className={getDifficultyColor(activity.difficulty)}>{activity.difficulty}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{activity.questions} questions studied</p>
                </div>
                <div className="text-sm text-muted-foreground">{activity.date}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
