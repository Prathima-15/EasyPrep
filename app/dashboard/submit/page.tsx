"use client"

import type React from "react"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Plus, X, MessageSquare, FileQuestion } from "lucide-react"

export default function SubmitReviewPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const [review, setReview] = useState("")
  const [questions, setQuestions] = useState([{ id: 1, text: "" }])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const addQuestion = () => {
    const newId = Math.max(...questions.map((q) => q.id)) + 1
    setQuestions([...questions, { id: newId, text: "" }])
  }

  const removeQuestion = (id: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((q) => q.id !== id))
    }
  }

  const updateQuestion = (id: number, value: string) => {
    setQuestions(questions.map((q) => (q.id === id ? { ...q, text: value } : q)))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    if (!review.trim()) {
      toast({
        title: "Error",
        description: "Please write a company review",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    const validQuestions = questions.filter((q) => q.text.trim() !== "")
    if (validQuestions.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one interview question",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    try {
      // Mock submission - replace with real API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      console.log("[v0] Submitted review:", review)
      console.log("[v0] Submitted questions:", validQuestions)

      toast({
        title: "Success",
        description: "Your review and questions have been submitted successfully!",
      })

      // Reset form
      setReview("")
      setQuestions([{ id: 1, text: "" }])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit your review. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Submit Company Review</h1>
          <p className="text-muted-foreground">Share your interview experience and questions</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Company Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="review">Write your review *</Label>
              <Textarea
                id="review"
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Share your overall interview experience, company culture, process, and any insights that would help other students..."
                rows={6}
                required
                className="min-h-[150px]"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileQuestion className="h-5 w-5" />
                Interview Questions
              </CardTitle>
              <Button type="button" onClick={addQuestion} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Question
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {questions.map((question, index) => (
              <div key={question.id} className="border border-border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Question {index + 1}</h4>
                  {questions.length > 1 && (
                    <Button type="button" onClick={() => removeQuestion(question.id)} variant="ghost" size="sm">
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Question Text *</Label>
                  <Textarea
                    value={question.text}
                    onChange={(e) => updateQuestion(question.id, e.target.value)}
                    placeholder="Enter the interview question that was asked..."
                    rows={3}
                    required
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90">
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </div>
      </form>
    </div>
  )
}
