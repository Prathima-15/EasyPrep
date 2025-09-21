"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Search, 
  Filter, 
  FileQuestion, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Flag,
  Eye,
  Edit,
  Trash2,
  Download,
  MoreHorizontal,
  ThumbsUp,
  MessageSquare,
  AlertTriangle
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Question {
  id: string
  question: string
  submitter: string
  submitterEmail: string
  company: string
  category: string
  difficulty: string
  aiDifficultyScore: number
  submissionDate: string
  status: "pending" | "approved" | "rejected" | "flagged"
  views: number
  helpfulVotes: number
  tags: string[]
  round: string
  feedback?: string
  rejectionReason?: string
  moderatorNotes?: string
}

export default function QuestionManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [companyFilter, setCompanyFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([])
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null)
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")
  const [moderatorNotes, setModeratorNotes] = useState("")
  const { toast } = useToast()

  // Mock question data - replace with real data later
  const mockQuestions: Question[] = [
    {
      id: "1",
      question: "Implement a thread-safe singleton pattern in Java with lazy initialization",
      submitter: "John Doe",
      submitterEmail: "john.doe@college.edu",
      company: "Google",
      category: "Technical / DSA",
      difficulty: "Medium",
      aiDifficultyScore: 2.7,
      submissionDate: "2024-01-15T10:30:00Z",
      status: "pending",
      views: 0,
      helpfulVotes: 0,
      tags: ["Java", "Design Patterns", "Concurrency"],
      round: "Technical Round 2"
    },
    {
      id: "2", 
      question: "Design a rate limiter for an API gateway that can handle millions of requests",
      submitter: "Jane Smith",
      submitterEmail: "jane.smith@university.edu",
      company: "Amazon",
      category: "System Design",
      difficulty: "Hard",
      aiDifficultyScore: 4.2,
      submissionDate: "2024-01-14T14:20:00Z",
      status: "approved",
      views: 234,
      helpfulVotes: 18,
      tags: ["System Design", "Scalability", "Algorithms"],
      round: "System Design Round",
      feedback: "Excellent system design question covering multiple important concepts."
    },
    {
      id: "3",
      question: "What is your greatest weakness?",
      submitter: "Mike Johnson", 
      submitterEmail: "mike.j@example.com",
      company: "Microsoft",
      category: "Behavioral",
      difficulty: "Easy",
      aiDifficultyScore: 1.2,
      submissionDate: "2024-01-13T09:15:00Z",
      status: "rejected",
      views: 0,
      helpfulVotes: 0,
      tags: ["Behavioral", "Communication"],
      round: "HR Round",
      rejectionReason: "Too generic - this question is already well covered in our database"
    },
    {
      id: "4",
      question: "Implement a distributed cache with consistent hashing",
      submitter: "Sarah Wilson",
      submitterEmail: "sarah.wilson@college.edu", 
      company: "Meta",
      category: "System Design",
      difficulty: "Hard",
      aiDifficultyScore: 4.5,
      submissionDate: "2024-01-12T16:45:00Z",
      status: "flagged",
      views: 0,
      helpfulVotes: 0,
      tags: ["System Design", "Distributed Systems", "Caching"],
      round: "System Design Round",
      moderatorNotes: "Flagged for potential similarity to existing questions"
    },
    {
      id: "5",
      question: "Optimize this SQL query for better performance on large datasets",
      submitter: "Alex Chen",
      submitterEmail: "alex.chen@university.edu",
      company: "Netflix",
      category: "Database",
      difficulty: "Medium", 
      aiDifficultyScore: 3.1,
      submissionDate: "2024-01-11T11:30:00Z",
      status: "pending",
      views: 0,
      helpfulVotes: 0,
      tags: ["SQL", "Performance", "Optimization"],
      round: "Technical Round 1"
    }
  ]

  const companies = ["Google", "Amazon", "Microsoft", "Meta", "Apple", "Netflix"]
  const categories = ["Technical / DSA", "System Design", "Behavioral", "Database", "Coding"]

  const filteredQuestions = mockQuestions.filter(question => {
    const matchesSearch = question.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         question.submitter.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         question.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesStatus = statusFilter === "all" || question.status === statusFilter
    const matchesCompany = companyFilter === "all" || question.company === companyFilter
    const matchesCategory = categoryFilter === "all" || question.category === categoryFilter
    
    return matchesSearch && matchesStatus && matchesCompany && matchesCategory
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />Pending</Badge>
      case "flagged":
        return <Badge className="bg-orange-100 text-orange-800"><Flag className="h-3 w-3 mr-1" />Flagged</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

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

  const handleApproveQuestion = async (questionId: string, feedback?: string) => {
    toast({
      title: "Question Approved",
      description: "Question has been approved and is now visible to users",
    })
    setIsReviewDialogOpen(false)
  }

  const handleRejectQuestion = async (questionId: string, reason: string) => {
    toast({
      title: "Question Rejected", 
      description: "Question has been rejected and submitter will be notified",
      variant: "destructive"
    })
    setIsReviewDialogOpen(false)
    setRejectionReason("")
  }

  const handleFlagQuestion = async (questionId: string, notes: string) => {
    toast({
      title: "Question Flagged",
      description: "Question has been flagged for further review",
    })
    setIsReviewDialogOpen(false)
    setModeratorNotes("")
  }

  const handleBulkApprove = async () => {
    toast({
      title: "Bulk Action Completed",
      description: `${selectedQuestions.length} questions approved`,
    })
    setSelectedQuestions([])
  }

  const handleBulkReject = async () => {
    toast({
      title: "Bulk Action Completed",
      description: `${selectedQuestions.length} questions rejected`,
      variant: "destructive"
    })
    setSelectedQuestions([])
  }

  const handleDeleteQuestion = async (questionId: string) => {
    toast({
      title: "Question Deleted",
      description: "Question has been permanently removed",
      variant: "destructive"
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const exportQuestions = () => {
    toast({
      title: "Export Started",
      description: "Question data export will be ready shortly",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <FileQuestion className="h-8 w-8" />
            Question Management
          </h1>
          <p className="text-muted-foreground">Review, approve, and moderate user-submitted questions</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportQuestions} variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
            <FileQuestion className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockQuestions.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockQuestions.filter(q => q.status === "pending").length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Flagged</CardTitle>
            <Flag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockQuestions.filter(q => q.status === "flagged").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Bulk Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="flagged">Flagged</SelectItem>
              </SelectContent>
            </Select>
            <Select value={companyFilter} onValueChange={setCompanyFilter}>
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
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
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
          
          {selectedQuestions.length > 0 && (
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <span className="text-sm font-medium">{selectedQuestions.length} selected</span>
              <Button size="sm" onClick={handleBulkApprove} className="bg-green-600 hover:bg-green-700">
                <CheckCircle className="h-4 w-4 mr-1" />
                Bulk Approve
              </Button>
              <Button size="sm" variant="destructive" onClick={handleBulkReject}>
                <XCircle className="h-4 w-4 mr-1" />
                Bulk Reject
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Questions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Questions ({filteredQuestions.length})</CardTitle>
          <CardDescription>Review and moderate user-submitted questions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox 
                    checked={selectedQuestions.length === filteredQuestions.length}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedQuestions(filteredQuestions.map(q => q.id))
                      } else {
                        setSelectedQuestions([])
                      }
                    }}
                  />
                </TableHead>
                <TableHead>Question</TableHead>
                <TableHead>Submitter</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredQuestions.map((question) => (
                <TableRow key={question.id}>
                  <TableCell>
                    <Checkbox 
                      checked={selectedQuestions.includes(question.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedQuestions([...selectedQuestions, question.id])
                        } else {
                          setSelectedQuestions(selectedQuestions.filter(id => id !== question.id))
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell className="max-w-md">
                    <div>
                      <p className="font-medium line-clamp-2">{question.question}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">{question.round}</Badge>
                        <div className="flex gap-1">
                          {question.tags.slice(0, 2).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">{tag}</Badge>
                          ))}
                          {question.tags.length > 2 && (
                            <Badge variant="outline" className="text-xs">+{question.tags.length - 2}</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{question.submitter}</div>
                      <div className="text-sm text-muted-foreground">{question.submitterEmail}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{question.company}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{question.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Badge className={getDifficultyColor(question.difficulty)}>{question.difficulty}</Badge>
                      <div className="text-xs text-muted-foreground">AI: {question.aiDifficultyScore}/5</div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(question.status)}</TableCell>
                  <TableCell className="text-sm">{formatDate(question.submissionDate)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setSelectedQuestion(question)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                          <DialogHeader>
                            <DialogTitle>Review Question</DialogTitle>
                            <DialogDescription>
                              Review and moderate this submitted question
                            </DialogDescription>
                          </DialogHeader>
                          {selectedQuestion && (
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-medium mb-2">Question</h4>
                                <p className="text-sm bg-muted p-3 rounded-lg">{selectedQuestion.question}</p>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-medium mb-2">Details</h4>
                                  <div className="space-y-2 text-sm">
                                    <div><strong>Company:</strong> {selectedQuestion.company}</div>
                                    <div><strong>Category:</strong> {selectedQuestion.category}</div>
                                    <div><strong>Round:</strong> {selectedQuestion.round}</div>
                                    <div><strong>Difficulty:</strong> {selectedQuestion.difficulty} (AI: {selectedQuestion.aiDifficultyScore}/5)</div>
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-medium mb-2">Submitter</h4>
                                  <div className="space-y-2 text-sm">
                                    <div><strong>Name:</strong> {selectedQuestion.submitter}</div>
                                    <div><strong>Email:</strong> {selectedQuestion.submitterEmail}</div>
                                    <div><strong>Submitted:</strong> {formatDate(selectedQuestion.submissionDate)}</div>
                                  </div>
                                </div>
                              </div>
                              
                              <div>
                                <h4 className="font-medium mb-2">Tags</h4>
                                <div className="flex gap-2">
                                  {selectedQuestion.tags.map((tag, index) => (
                                    <Badge key={index} variant="outline">{tag}</Badge>
                                  ))}
                                </div>
                              </div>

                              {selectedQuestion.status === "pending" && (
                                <div className="space-y-4 pt-4 border-t">
                                  <div>
                                    <label className="text-sm font-medium">Feedback (Optional)</label>
                                    <Textarea 
                                      placeholder="Add feedback for the submitter..."
                                      className="mt-1"
                                    />
                                  </div>
                                  <div className="flex gap-2">
                                    <Button 
                                      onClick={() => handleApproveQuestion(selectedQuestion.id)}
                                      className="bg-green-600 hover:bg-green-700"
                                    >
                                      <CheckCircle className="h-4 w-4 mr-2" />
                                      Approve
                                    </Button>
                                    <Dialog>
                                      <DialogTrigger asChild>
                                        <Button variant="destructive">
                                          <XCircle className="h-4 w-4 mr-2" />
                                          Reject
                                        </Button>
                                      </DialogTrigger>
                                      <DialogContent>
                                        <DialogHeader>
                                          <DialogTitle>Reject Question</DialogTitle>
                                          <DialogDescription>
                                            Please provide a reason for rejecting this question
                                          </DialogDescription>
                                        </DialogHeader>
                                        <Textarea 
                                          placeholder="Explain why this question is being rejected..."
                                          value={rejectionReason}
                                          onChange={(e) => setRejectionReason(e.target.value)}
                                        />
                                        <DialogFooter>
                                          <Button variant="outline" onClick={() => setRejectionReason("")}>Cancel</Button>
                                          <Button 
                                            variant="destructive"
                                            onClick={() => handleRejectQuestion(selectedQuestion.id, rejectionReason)}
                                            disabled={!rejectionReason.trim()}
                                          >
                                            Reject Question
                                          </Button>
                                        </DialogFooter>
                                      </DialogContent>
                                    </Dialog>
                                    <Button variant="outline">
                                      <Flag className="h-4 w-4 mr-2" />
                                      Flag for Review
                                    </Button>
                                  </div>
                                </div>
                              )}

                              {selectedQuestion.rejectionReason && (
                                <div className="bg-red-50 p-3 rounded-lg">
                                  <h4 className="font-medium text-red-800 mb-1">Rejection Reason</h4>
                                  <p className="text-sm text-red-700">{selectedQuestion.rejectionReason}</p>
                                </div>
                              )}

                              {selectedQuestion.moderatorNotes && (
                                <div className="bg-orange-50 p-3 rounded-lg">
                                  <h4 className="font-medium text-orange-800 mb-1">Moderator Notes</h4>
                                  <p className="text-sm text-orange-700">{selectedQuestion.moderatorNotes}</p>
                                </div>
                              )}
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Question</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to permanently delete this question? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDeleteQuestion(question.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}