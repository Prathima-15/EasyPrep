"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Star, Plus, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { reviewAPI, companyQuestionAPI } from "@/lib/api-client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface AddReviewQuestionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  companyId: string
  companyName: string
  onSuccess: () => void
}

export function AddReviewQuestionDialog({
  open,
  onOpenChange,
  companyId,
  companyName,
  onSuccess,
}: AddReviewQuestionDialogProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("review")

  // Review form state
  const [reviewForm, setReviewForm] = useState({
    role: "",
    rating: 0,
    difficulty: "",
    summary: "",
    pros: [""],
    cons: [""],
    interviewTopics: [""],
  })

  // Questions form state - simplified (AI will classify category/difficulty later)
  const [questions, setQuestions] = useState([
    {
      questionText: "",
      answer: "",
    },
  ])

  const resetForms = () => {
    setReviewForm({
      role: "",
      rating: 0,
      difficulty: "",
      summary: "",
      pros: [""],
      cons: [""],
      interviewTopics: [""],
    })
    setQuestions([
      {
        questionText: "",
        answer: "",
      },
    ])
  }

  const handleSubmitReview = async () => {
    // Validation
    if (!reviewForm.role || !reviewForm.rating || !reviewForm.difficulty || !reviewForm.summary) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const result = await reviewAPI.create(companyId, {
        ...reviewForm,
        pros: reviewForm.pros.filter((p) => p.trim()),
        cons: reviewForm.cons.filter((c) => c.trim()),
        interviewTopics: reviewForm.interviewTopics.filter((t) => t.trim()),
      })

      if (result.success) {
        toast({
          title: "Success",
          description: "Review submitted successfully",
        })
        onSuccess()
        resetForms()
        onOpenChange(false)
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to submit review",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit review",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmitQuestions = async () => {
    // Validation
    const validQuestions = questions.filter(
      (q) => q.questionText.trim()
    )

    if (validQuestions.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please add at least one question",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // AI will classify these later, for now use fixed values
      const questionsToSubmit = validQuestions.map((q) => ({
        category: "Technical / DSA", // Fixed for now, AI will classify later
        questionText: q.questionText,
        difficulty: "Medium", // Fixed for now, AI will classify later
        tags: [], // No tags needed
        answer: q.answer || "",
      }))

      const result = await companyQuestionAPI.create(companyId, questionsToSubmit)

      if (result.success) {
        toast({
          title: "Success",
          description: `${validQuestions.length} question(s) submitted successfully`,
        })
        onSuccess()
        resetForms()
        onOpenChange(false)
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to submit questions",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit questions",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const addArrayField = (type: "pros" | "cons" | "interviewTopics") => {
    setReviewForm({
      ...reviewForm,
      [type]: [...reviewForm[type], ""],
    })
  }

  const removeArrayField = (type: "pros" | "cons" | "interviewTopics", index: number) => {
    const newArray = reviewForm[type].filter((_, i) => i !== index)
    setReviewForm({
      ...reviewForm,
      [type]: newArray.length > 0 ? newArray : [""],
    })
  }

  const updateArrayField = (type: "pros" | "cons" | "interviewTopics", index: number, value: string) => {
    const newArray = [...reviewForm[type]]
    newArray[index] = value
    setReviewForm({
      ...reviewForm,
      [type]: newArray,
    })
  }

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: "",
        answer: "",
      },
    ])
  }

  const removeQuestion = (index: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index))
    }
  }

  const updateQuestion = (index: number, field: string, value: any) => {
    const newQuestions = [...questions]
    newQuestions[index] = { ...newQuestions[index], [field]: value }
    setQuestions(newQuestions)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Review / Questions</DialogTitle>
          <DialogDescription>Share your interview experience for {companyName}</DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="review">Review</TabsTrigger>
            <TabsTrigger value="questions">Questions</TabsTrigger>
          </TabsList>

          <TabsContent value="review" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="role">Role Applied For *</Label>
                <Input
                  id="role"
                  placeholder="e.g., Software Engineer, Data Analyst"
                  value={reviewForm.role}
                  onChange={(e) => setReviewForm({ ...reviewForm, role: e.target.value })}
                />
              </div>

              <div>
                <Label>Rating *</Label>
                <div className="flex gap-2 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                    >
                      <Star
                        className={`h-8 w-8 cursor-pointer transition-colors ${
                          star <= reviewForm.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="difficulty">Difficulty *</Label>
                <Select value={reviewForm.difficulty} onValueChange={(value) => setReviewForm({ ...reviewForm, difficulty: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="summary">Interview Summary *</Label>
                <Textarea
                  id="summary"
                  placeholder="Describe your interview experience..."
                  value={reviewForm.summary}
                  onChange={(e) => setReviewForm({ ...reviewForm, summary: e.target.value })}
                  rows={4}
                />
              </div>

              <div>
                <Label>Pros (What you liked)</Label>
                {reviewForm.pros.map((pro, index) => (
                  <div key={index} className="flex gap-2 mt-2">
                    <Input
                      placeholder="e.g., Great work culture"
                      value={pro}
                      onChange={(e) => updateArrayField("pros", index, e.target.value)}
                    />
                    {reviewForm.pros.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeArrayField("pros", index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => addArrayField("pros")} className="mt-2">
                  <Plus className="h-4 w-4 mr-2" /> Add Pro
                </Button>
              </div>

              <div>
                <Label>Cons (What could be improved)</Label>
                {reviewForm.cons.map((con, index) => (
                  <div key={index} className="flex gap-2 mt-2">
                    <Input
                      placeholder="e.g., Long interview process"
                      value={con}
                      onChange={(e) => updateArrayField("cons", index, e.target.value)}
                    />
                    {reviewForm.cons.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeArrayField("cons", index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => addArrayField("cons")} className="mt-2">
                  <Plus className="h-4 w-4 mr-2" /> Add Con
                </Button>
              </div>

              <div>
                <Label>Interview Topics Covered</Label>
                {reviewForm.interviewTopics.map((topic, index) => (
                  <div key={index} className="flex gap-2 mt-2">
                    <Input
                      placeholder="e.g., System Design, Coding, Behavioral"
                      value={topic}
                      onChange={(e) => updateArrayField("interviewTopics", index, e.target.value)}
                    />
                    {reviewForm.interviewTopics.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeArrayField("interviewTopics", index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addArrayField("interviewTopics")}
                  className="mt-2"
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Topic
                </Button>
              </div>

              <Button onClick={handleSubmitReview} disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="questions" className="space-y-4">
            {questions.map((question, qIndex) => (
              <div key={qIndex} className="border border-border rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Question {qIndex + 1}</h4>
                  {questions.length > 1 && (
                    <Button type="button" variant="destructive" size="sm" onClick={() => removeQuestion(qIndex)}>
                      <X className="h-4 w-4 mr-2" /> Remove
                    </Button>
                  )}
                </div>

                <div>
                  <Label>Question Text *</Label>
                  <Textarea
                    placeholder="Enter the interview question..."
                    value={question.questionText}
                    onChange={(e) => updateQuestion(qIndex, "questionText", e.target.value)}
                    rows={3}
                  />
                </div>

                <div>
                  <Label>Answer/Approach (Optional)</Label>
                  <Textarea
                    placeholder="Your answer or approach to solve this question..."
                    value={question.answer}
                    onChange={(e) => updateQuestion(qIndex, "answer", e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
            ))}

            <Button type="button" variant="outline" onClick={addQuestion} className="w-full">
              <Plus className="h-4 w-4 mr-2" /> Add Another Question
            </Button>

            <Button onClick={handleSubmitQuestions} disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Submitting..." : `Submit ${questions.length} Question(s)`}
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
