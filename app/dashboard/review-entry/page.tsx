"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Plus, X } from "lucide-react"

export default function ReviewEntryPage() {
  const router = useRouter()
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

    // Validate required fields
    if (!review.trim()) {
      toast({
        title: "Error",
        description: "Please write a review",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    // Validate at least one question
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
      await new Promise((resolve) => setTimeout(resolve, 1500))

      console.log("[v0] Submitting review:", { review, questions: validQuestions })

      toast({
        title: "Success",
        description: "Your review and questions have been saved successfully!",
      })

      // Reset form
      setReview("")
      setQuestions([{ id: 1, text: "" }])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save your review. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Company Review Entry</h1>
          <p className="text-muted-foreground">Share your interview experience and questions</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Review & Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Review Text Area */}
            <div className="space-y-2">
              <Label htmlFor="review">Company Review *</Label>
              <Textarea
                id="review"
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Write your review about the company, interview process, experience, etc..."
                rows={6}
                className="resize-none"
                required
              />
            </div>

            {/* Interview Questions */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Interview Questions *</Label>
                <Button type="button" onClick={addQuestion} variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Question
                </Button>
              </div>

              <div className="space-y-3">
                {questions.map((question, index) => (
                  <div key={question.id} className="flex items-center gap-3">
                    <div className="flex-1">
                      <Input
                        value={question.text}
                        onChange={(e) => updateQuestion(question.id, e.target.value)}
                        placeholder={`Interview question ${index + 1}...`}
                        className="w-full"
                      />
                    </div>
                    {questions.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeQuestion(question.id)}
                        variant="ghost"
                        size="sm"
                        className="flex-shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90">
                {isSubmitting ? "Saving..." : "Save Review"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
