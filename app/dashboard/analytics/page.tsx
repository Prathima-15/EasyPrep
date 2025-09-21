"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"
import { BarChart3, TrendingUp, Target, Brain, Award, Calendar, Download, RefreshCw } from "lucide-react"

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30d")
  const [selectedCompany, setSelectedCompany] = useState("all")

  // Mock data - replace with real data later
  const overallStats = {
    totalQuestions: 1247,
    averageDifficulty: 2.8,
    completionRate: 73,
    improvementRate: 12,
    studyStreak: 15,
    weakestArea: "System Design",
  }

  const difficultyDistribution = [
    { name: "Easy", value: 324, percentage: 26, color: "#10B981" },
    { name: "Medium", value: 567, percentage: 45, color: "#F59E0B" },
    { name: "Hard", value: 356, percentage: 29, color: "#EF4444" },
  ]

  const topicDifficulty = [
    { topic: "Arrays", easy: 45, medium: 67, hard: 23, avgDifficulty: 2.1 },
    { topic: "Dynamic Programming", easy: 12, medium: 34, hard: 78, avgDifficulty: 3.8 },
    { topic: "System Design", easy: 5, medium: 23, hard: 89, avgDifficulty: 4.2 },
    { topic: "Behavioral", easy: 67, medium: 45, hard: 12, avgDifficulty: 1.8 },
    { topic: "Database", easy: 34, medium: 56, hard: 34, avgDifficulty: 2.5 },
    { topic: "Graphs", easy: 23, medium: 45, hard: 67, avgDifficulty: 3.2 },
  ]

  const companyDifficulty = [
    { company: "Google", avgDifficulty: 4.1, questions: 234, trend: "+0.3" },
    { company: "Amazon", avgDifficulty: 3.8, questions: 267, trend: "+0.1" },
    { company: "Microsoft", avgDifficulty: 3.2, questions: 189, trend: "-0.2" },
    { company: "Meta", avgDifficulty: 3.9, questions: 156, trend: "+0.4" },
    { company: "Apple", avgDifficulty: 3.5, questions: 143, trend: "0.0" },
    { company: "Netflix", avgDifficulty: 4.3, questions: 98, trend: "+0.6" },
  ]

  const performanceTrend = [
    { month: "Jan", accuracy: 65, difficulty: 2.1, questions: 45 },
    { month: "Feb", accuracy: 68, difficulty: 2.3, questions: 52 },
    { month: "Mar", accuracy: 72, difficulty: 2.5, questions: 61 },
    { month: "Apr", accuracy: 75, difficulty: 2.7, questions: 58 },
    { month: "May", accuracy: 78, difficulty: 2.8, questions: 67 },
    { month: "Jun", accuracy: 73, difficulty: 3.0, questions: 72 },
  ]

  const skillRadar = [
    { skill: "Arrays", current: 85, target: 90 },
    { skill: "Trees", current: 72, target: 85 },
    { skill: "Graphs", current: 68, target: 80 },
    { skill: "DP", current: 45, target: 75 },
    { skill: "System Design", current: 38, target: 70 },
    { skill: "Behavioral", current: 82, target: 85 },
  ]

  const insights = [
    {
      type: "improvement",
      title: "Strong Progress in Medium Questions",
      description: "Your accuracy on medium difficulty questions improved by 15% this month.",
      action: "Continue practicing medium-level problems to maintain momentum.",
    },
    {
      type: "warning",
      title: "System Design Needs Attention",
      description: "Your performance in system design questions is below average.",
      action: "Focus on system design fundamentals and practice more architectural problems.",
    },
    {
      type: "success",
      title: "Behavioral Interview Ready",
      description: "You've mastered behavioral questions with 85% accuracy.",
      action: "Maintain your behavioral skills while focusing on technical areas.",
    },
  ]

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 2) return "text-green-600"
    if (difficulty <= 3.5) return "text-yellow-600"
    return "text-red-600"
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "improvement":
        return <TrendingUp className="h-5 w-5 text-blue-500" />
      case "warning":
        return <Target className="h-5 w-5 text-yellow-500" />
      case "success":
        return <Award className="h-5 w-5 text-green-500" />
      default:
        return <Brain className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Difficulty Analytics</h1>
          <p className="text-muted-foreground">Comprehensive insights into your interview preparation progress</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 3 months</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.totalQuestions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Analyzed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Difficulty</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getDifficultyColor(overallStats.averageDifficulty)}`}>
              {overallStats.averageDifficulty}/5
            </div>
            <Progress value={overallStats.averageDifficulty * 20} className="mt-1" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.completionRate}%</div>
            <Progress value={overallStats.completionRate} className="mt-1" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Improvement</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">+{overallStats.improvementRate}%</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Study Streak</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.studyStreak} days</div>
            <p className="text-xs text-muted-foreground">Current streak</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Focus Area</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold">{overallStats.weakestArea}</div>
            <p className="text-xs text-muted-foreground">Needs attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="topics">Topics</TabsTrigger>
          <TabsTrigger value="companies">Companies</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Difficulty Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Difficulty Distribution</CardTitle>
                <CardDescription>Breakdown of questions by difficulty level</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    easy: { label: "Easy", color: "#10B981" },
                    medium: { label: "Medium", color: "#F59E0B" },
                    hard: { label: "Hard", color: "#EF4444" },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={difficultyDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {difficultyDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <ChartLegend content={<ChartLegendContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Skills Radar */}
            <Card>
              <CardHeader>
                <CardTitle>Skills Assessment</CardTitle>
                <CardDescription>Current vs target skill levels</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    current: { label: "Current", color: "#3B82F6" },
                    target: { label: "Target", color: "#10B981" },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={skillRadar}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="skill" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} />
                      <Radar name="Current" dataKey="current" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                      <Radar name="Target" dataKey="target" stroke="#10B981" fill="#10B981" fillOpacity={0.1} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <ChartLegend content={<ChartLegendContent />} />
                    </RadarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* AI Insights */}
          <Card>
            <CardHeader>
              <CardTitle>AI-Powered Insights</CardTitle>
              <CardDescription>Personalized recommendations based on your performance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {insights.map((insight, index) => (
                <div key={index} className="flex items-start gap-4 p-4 border border-border rounded-lg">
                  {getInsightIcon(insight.type)}
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">{insight.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{insight.description}</p>
                    <p className="text-sm font-medium text-primary">{insight.action}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="topics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Topic-wise Difficulty Analysis</CardTitle>
              <CardDescription>Difficulty breakdown across different interview topics</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  easy: { label: "Easy", color: "#10B981" },
                  medium: { label: "Medium", color: "#F59E0B" },
                  hard: { label: "Hard", color: "#EF4444" },
                }}
                className="h-[400px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topicDifficulty} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="topic" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Bar dataKey="easy" stackId="a" fill="#10B981" />
                    <Bar dataKey="medium" stackId="a" fill="#F59E0B" />
                    <Bar dataKey="hard" stackId="a" fill="#EF4444" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topicDifficulty.map((topic, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{topic.topic}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Average Difficulty:</span>
                      <span className={`font-medium ${getDifficultyColor(topic.avgDifficulty)}`}>
                        {topic.avgDifficulty}/5
                      </span>
                    </div>
                    <Progress value={topic.avgDifficulty * 20} className="h-2" />
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="text-center">
                        <div className="font-medium text-green-600">{topic.easy}</div>
                        <div className="text-muted-foreground">Easy</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-yellow-600">{topic.medium}</div>
                        <div className="text-muted-foreground">Medium</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-red-600">{topic.hard}</div>
                        <div className="text-muted-foreground">Hard</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="companies" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Company Difficulty Trends</CardTitle>
              <CardDescription>Average difficulty levels across different companies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {companyDifficulty.map((company, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                        <span className="font-bold text-sm">{company.company.charAt(0)}</span>
                      </div>
                      <div>
                        <h4 className="font-medium">{company.company}</h4>
                        <p className="text-sm text-muted-foreground">{company.questions} questions</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className={`font-medium ${getDifficultyColor(company.avgDifficulty)}`}>
                          {company.avgDifficulty}/5
                        </div>
                        <div className="text-sm text-muted-foreground">Avg. Difficulty</div>
                      </div>
                      <Badge
                        variant={
                          company.trend.startsWith("+")
                            ? "default"
                            : company.trend.startsWith("-")
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {company.trend}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
              <CardDescription>Your accuracy and difficulty progression over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  accuracy: { label: "Accuracy (%)", color: "#3B82F6" },
                  difficulty: { label: "Avg. Difficulty", color: "#10B981" },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceTrend} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Line type="monotone" dataKey="accuracy" stroke="#3B82F6" strokeWidth={2} />
                    <Line type="monotone" dataKey="difficulty" stroke="#10B981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
