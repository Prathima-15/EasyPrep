"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  FileQuestion, 
  Building2,
  Award,
  Download,
  Calendar,
  Target,
  Activity,
  Eye,
  ThumbsUp,
  Clock
} from "lucide-react"
import { useState } from "react"

export default function AdminAnalytics() {
  const [timeRange, setTimeRange] = useState("7d")

  // Mock analytics data
  const analyticsData = {
    overview: {
      totalUsers: 2847,
      activeUsers: 2156,
      newUsersThisWeek: 89,
      totalQuestions: 1247,
      questionsThisWeek: 67,
      totalViews: 45632,
      avgQualityScore: 4.2,
      platformHealth: 94
    },
    userContributions: [
      {
        id: "1",
        name: "Jane Smith",
        email: "jane.smith@university.edu",
        questionsSubmitted: 45,
        questionsApproved: 42,
        totalViews: 2340,
        helpfulVotes: 156,
        avgDifficulty: 3.8,
        contributionScore: 96
      },
      {
        id: "2", 
        name: "John Doe",
        email: "john.doe@college.edu",
        questionsSubmitted: 23,
        questionsApproved: 18,
        totalViews: 1890,
        helpfulVotes: 89,
        avgDifficulty: 2.7,
        contributionScore: 78
      },
      {
        id: "3",
        name: "Alex Chen", 
        email: "alex.chen@university.edu",
        questionsSubmitted: 34,
        questionsApproved: 31,
        totalViews: 2100,
        helpfulVotes: 134,
        avgDifficulty: 4.1,
        contributionScore: 91
      },
      {
        id: "4",
        name: "Sarah Wilson",
        email: "sarah.wilson@college.edu",
        questionsSubmitted: 12,
        questionsApproved: 8,
        totalViews: 567,
        helpfulVotes: 23,
        avgDifficulty: 2.3,
        contributionScore: 45
      },
      {
        id: "5",
        name: "Mike Johnson",
        email: "mike.j@example.com", 
        questionsSubmitted: 19,
        questionsApproved: 16,
        totalViews: 1234,
        helpfulVotes: 67,
        avgDifficulty: 3.2,
        contributionScore: 72
      }
    ],
    topicTrends: [
      { name: "System Design", questions: 234, growth: "+15%", difficulty: 4.2 },
      { name: "Data Structures", questions: 189, growth: "+8%", difficulty: 3.1 },
      { name: "Behavioral", questions: 156, growth: "+12%", difficulty: 2.1 },
      { name: "Machine Learning", questions: 143, growth: "+22%", difficulty: 4.0 },
      { name: "Database Design", questions: 98, growth: "+5%", difficulty: 3.5 }
    ],
    companyInsights: [
      { name: "Google", questions: 267, avgDifficulty: 4.1, popularity: 89 },
      { name: "Amazon", questions: 234, avgDifficulty: 3.8, popularity: 82 },
      { name: "Microsoft", questions: 189, avgDifficulty: 3.5, popularity: 76 },
      { name: "Meta", questions: 156, avgDifficulty: 4.2, popularity: 71 },
      { name: "Apple", questions: 143, avgDifficulty: 3.9, popularity: 68 }
    ],
    platformMetrics: {
      questionApprovalRate: 84,
      avgTimeToApproval: 4.2,
      userRetentionRate: 73,
      avgSessionDuration: 23.5,
      mobileUsage: 42,
      searchAccuracy: 87
    }
  }

  const getContributionBadge = (score: number) => {
    if (score >= 90) return <Badge className="bg-green-100 text-green-800">Excellent</Badge>
    if (score >= 75) return <Badge className="bg-blue-100 text-blue-800">Good</Badge>
    if (score >= 60) return <Badge className="bg-yellow-100 text-yellow-800">Average</Badge>
    return <Badge className="bg-red-100 text-red-800">Poor</Badge>
  }

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty >= 4) return "text-red-600"
    if (difficulty >= 3) return "text-yellow-600" 
    return "text-green-600"
  }

  const exportAnalytics = () => {
    // Mock export functionality
    console.log("Exporting analytics data...")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <BarChart3 className="h-8 w-8" />
            Analytics & Insights
          </h1>
          <p className="text-muted-foreground">Platform performance and user contribution analytics</p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 3 months</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={exportAnalytics} variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Platform Health</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.overview.platformHealth}%</div>
            <Progress value={analyticsData.overview.platformHealth} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">Excellent performance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.overview.activeUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +{analyticsData.overview.newUsersThisWeek} new this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
            <FileQuestion className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.overview.totalQuestions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +{analyticsData.overview.questionsThisWeek} this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Quality Score</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.overview.avgQualityScore}/5</div>
            <Progress value={analyticsData.overview.avgQualityScore * 20} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">High quality content</p>
          </CardContent>
        </Card>
      </div>

      {/* Platform Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.platformMetrics.questionApprovalRate}%</div>
            <Progress value={analyticsData.platformMetrics.questionApprovalRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Approval Time</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.platformMetrics.avgTimeToApproval}h</div>
            <p className="text-xs text-muted-foreground">Fast processing</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">User Retention</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.platformMetrics.userRetentionRate}%</div>
            <Progress value={analyticsData.platformMetrics.userRetentionRate} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Top Contributors */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Top Contributors
          </CardTitle>
          <CardDescription>Users with highest contribution scores and engagement</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analyticsData.userContributions.map((user, index) => (
              <div key={user.id} className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-medium">{user.name}</h4>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div className="text-center">
                    <div className="font-medium">{user.questionsSubmitted}</div>
                    <div className="text-muted-foreground">Questions</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">{user.totalViews.toLocaleString()}</div>
                    <div className="text-muted-foreground">Views</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">{user.helpfulVotes}</div>
                    <div className="text-muted-foreground">Votes</div>
                  </div>
                  <div className="text-center">
                    <div className={`font-medium ${getDifficultyColor(user.avgDifficulty)}`}>
                      {user.avgDifficulty.toFixed(1)}
                    </div>
                    <div className="text-muted-foreground">Difficulty</div>
                  </div>
                  <div>
                    {getContributionBadge(user.contributionScore)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Topic Trends and Company Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Topic Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Trending Topics
            </CardTitle>
            <CardDescription>Most popular question categories</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {analyticsData.topicTrends.map((topic, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{topic.name}</span>
                    <Badge variant="outline" className="text-green-600">{topic.growth}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{topic.questions} questions</span>
                    <span className={getDifficultyColor(topic.difficulty)}>
                      Difficulty: {topic.difficulty.toFixed(1)}
                    </span>
                  </div>
                </div>
                <Progress value={(topic.questions / 300) * 100} className="w-20" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Company Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Company Insights
            </CardTitle>
            <CardDescription>Question distribution by company</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {analyticsData.companyInsights.map((company, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{company.name}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{company.questions} questions</span>
                    <span className={getDifficultyColor(company.avgDifficulty)}>
                      Avg: {company.avgDifficulty.toFixed(1)}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{company.popularity}%</div>
                  <div className="text-xs text-muted-foreground">Popularity</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Usage Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Session</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.platformMetrics.avgSessionDuration}m</div>
            <p className="text-xs text-muted-foreground">Good engagement</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mobile Usage</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.platformMetrics.mobileUsage}%</div>
            <Progress value={analyticsData.platformMetrics.mobileUsage} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Search Accuracy</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.platformMetrics.searchAccuracy}%</div>
            <Progress value={analyticsData.platformMetrics.searchAccuracy} className="mt-2" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}