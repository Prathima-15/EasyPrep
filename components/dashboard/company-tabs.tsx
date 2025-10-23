"use client"

import { useState, useEffect } from "react"
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
  Code,
  Users,
  Database,
  Layers,
} from "lucide-react"
import { AddReviewQuestionDialog } from "./add-review-question-dialog"
import { reviewAPI, companyQuestionAPI } from "@/lib/api-client"

interface CompanyTabsProps {
  companyId: string
  companyName: string
}

const categoryIcons: Record<string, any> = {
  'Technical / DSA': Code,
  'System Design': Layers,
  'Behavioral': Users,
  'Database': Database,
  'Other': FileQuestion
}

export function CompanyTabs({ companyId, companyName }: CompanyTabsProps) {
  const [activeTab, setActiveTab] = useState("reviews")
  const [showAddDialog, setShowAddDialog] = useState(false)
  
  // Reviews state
  const [reviews, setReviews] = useState<any[]>([])
  const [reviewStats, setReviewStats] = useState<any>(null)
  const [isLoadingReviews, setIsLoadingReviews] = useState(true)
  
  // Questions state
  const [questions, setQuestions] = useState<any[]>([])
  const [questionsByCategory, setQuestionsByCategory] = useState<any>({})
  const [questionStats, setQuestionStats] = useState<any>(null)
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true)

  useEffect(() => {
    fetchReviews()
    fetchQuestions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId])

  const fetchReviews = async () => {
    setIsLoadingReviews(true)
    try {
      console.log('Fetching reviews for companyId:', companyId)
      const result = await reviewAPI.getByCompany(companyId)
      console.log('Reviews API result:', result)
      if (result.success && result.data) {
        const data = result.data as any
        console.log('Reviews data:', data.reviews)
        setReviews(data.reviews || [])
        setReviewStats(data.stats || {})
      } else {
        console.error('Failed to fetch reviews:', result.message)
      }
    } catch (error: any) {
      console.error('Error fetching reviews:', error)
    } finally {
      setIsLoadingReviews(false)
    }
  }

  const fetchQuestions = async () => {
    setIsLoadingQuestions(true)
    try {
      console.log('Fetching questions for companyId:', companyId)
      const result = await companyQuestionAPI.getByCompany(companyId)
      console.log('Questions API result:', result)
      if (result.success && result.data) {
        const data = result.data as any
        console.log('Questions data:', data.questions)
        console.log('Questions length:', data.questions?.length)
        setQuestions(data.questions || [])
        setQuestionsByCategory(data.categories || {})
        setQuestionStats(data.stats || {})
      } else {
        console.error('Failed to fetch questions:', result.message)
      }
    } catch (error: any) {
      console.error('Error fetching questions:', error)
    } finally {
      setIsLoadingQuestions(false)
    }
  }

  const handleSuccess = () => {
    // Refresh data after successful submission
    fetchReviews()
    fetchQuestions()
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="space-y-6">
      {/* Add Review/Question Button */}
      <div className="flex justify-end">
        <Button className="bg-primary hover:bg-primary/90" onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Review / Question
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="reviews" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Reviews ({reviewStats?.totalReviews || 0})
          </TabsTrigger>
          <TabsTrigger value="questions" className="flex items-center gap-2">
            <FileQuestion className="h-4 w-4" />
            Questions ({questionStats?.totalQuestions || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="reviews" className="space-y-6">
          {isLoadingReviews ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading reviews...</p>
            </div>
          ) : reviews.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No Reviews Yet</h3>
                <p className="text-muted-foreground mb-4">Be the first to share your interview experience!</p>
                <Button onClick={() => setShowAddDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Review
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Reviews Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                    <Star className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{reviewStats?.averageRating?.toFixed(1) || 0}/5</div>
                    <p className="text-xs text-muted-foreground">From {reviewStats?.totalReviews || 0} reviews</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg. Difficulty</CardTitle>
                    <FileQuestion className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{reviewStats?.averageDifficulty?.toFixed(1) || 0}/3</div>
                    <Progress value={(reviewStats?.averageDifficulty || 0) * 33.33} className="mt-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{reviewStats?.totalReviews || 0}</div>
                    <p className="text-xs text-muted-foreground">Student experiences</p>
                  </CardContent>
                </Card>
              </div>

              {/* Pros and Cons */}
              {(reviewStats?.commonPros?.length > 0 || reviewStats?.commonCons?.length > 0) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {reviewStats?.commonPros?.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg text-green-600">Pros</CardTitle>
                        <CardDescription>What students liked</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {reviewStats.commonPros.map((pro: string, index: number) => (
                            <li key={index} className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full" />
                              <span className="text-sm">{pro}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}

                  {reviewStats?.commonCons?.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg text-red-600">Cons</CardTitle>
                        <CardDescription>Areas for improvement</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {reviewStats.commonCons.map((con: string, index: number) => (
                            <li key={index} className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-red-500 rounded-full" />
                              <span className="text-sm">{con}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {/* Recent Reviews */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Reviews</CardTitle>
                  <CardDescription>Latest student experiences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {reviews.slice(0, 10).map((review: any) => (
                    <div key={review._id} className="border-b border-border pb-4 last:border-b-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{review.studentName || 'Anonymous'}</span>
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
                      {review.interviewTopics && review.interviewTopics.length > 0 && (
                        <div className="flex gap-2 flex-wrap mb-2">
                          {review.interviewTopics.map((topic: string, i: number) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground">{formatDate(review.createdAt)}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="questions" className="space-y-6">
          {isLoadingQuestions ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading questions...</p>
            </div>
          ) : questions.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <FileQuestion className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No Questions Yet</h3>
                <p className="text-muted-foreground mb-4">Be the first to share interview questions!</p>
                <Button onClick={() => setShowAddDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Questions
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Questions Overview */}
              <Card>
                <CardHeader>
                  <CardTitle>Question Categories</CardTitle>
                  <CardDescription>{questionStats?.totalQuestions || 0} total questions available</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {Object.keys(categoryIcons).map((categoryName) => {
                      const Icon = categoryIcons[categoryName]
                      const count = questionStats?.byCategory?.[categoryName] || 0
                      const categoryQuestions = questionsByCategory[categoryName] || []
                      const avgDifficulty = categoryQuestions.length > 0
                        ? categoryQuestions.filter((q: any) => q.difficulty === 'Hard').length > categoryQuestions.length / 2
                          ? 'Hard'
                          : categoryQuestions.filter((q: any) => q.difficulty === 'Easy').length > categoryQuestions.length / 2
                          ? 'Easy'
                          : 'Medium'
                        : 'Medium'

                      return (
                        <div key={categoryName} className="text-center p-4 border border-border rounded-lg">
                          <Icon className="h-8 w-8 text-primary mx-auto mb-2" />
                          <div className="font-medium text-sm">{categoryName}</div>
                          <div className="text-sm text-muted-foreground">{count} questions</div>
                          <Badge className={`${getDifficultyColor(avgDifficulty)} mt-2 text-xs`}>
                            {avgDifficulty}
                          </Badge>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Questions by Category */}
              {Object.entries(questionsByCategory).map(([categoryName, categoryQuestions]: [string, any]) => {
                if (!Array.isArray(categoryQuestions) || categoryQuestions.length === 0) return null
                const Icon = categoryIcons[categoryName] || FileQuestion

                return (
                  <Card key={categoryName}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Icon className="h-5 w-5" />
                        {categoryName}
                      </CardTitle>
                      <CardDescription>{categoryQuestions.length} questions in this category</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="divide-y divide-border">
                        <ul className="space-y-0">
                          {categoryQuestions.map((question: any) => (
                            <li key={question._id} className="p-4 hover:bg-muted/50 transition-colors">
                              <div className="flex items-start justify-between mb-2">
                                <h4 className="font-medium flex-1 pr-4">{question.questionText}</h4>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  <Badge className={getDifficultyColor(question.difficulty)}>
                                    {question.difficulty}
                                  </Badge>
                                  {question.frequency && (
                                    <div className="text-sm text-muted-foreground">{question.frequency}x</div>
                                  )}
                                </div>
                              </div>
                              {question.tags && question.tags.length > 0 && (
                                <div className="flex items-center gap-2 flex-wrap">
                                  {question.tags.map((tag: string, tagIndex: number) => (
                                    <Badge key={tagIndex} variant="outline" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                              {question.answer && (
                                <details className="mt-2">
                                  <summary className="text-sm text-primary cursor-pointer">View Answer</summary>
                                  <p className="text-sm text-muted-foreground mt-2 pl-4">{question.answer}</p>
                                </details>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </>
          )}
        </TabsContent>
      </Tabs>

      <AddReviewQuestionDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        companyId={companyId}
        companyName={companyName}
        onSuccess={handleSuccess}
      />
    </div>
  )
}
