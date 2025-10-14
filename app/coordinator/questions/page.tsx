"use client"

import { useState } from "react"
import { FileQuestion, Search, Filter, Plus, Edit, Trash2, Eye } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface Question {
  id: string
  title: string
  company: string
  difficulty: "easy" | "medium" | "hard"
  category: string
  addedDate: string
  status: "active" | "inactive"
}

export default function CoordinatorQuestionsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: "1",
      title: "Two Sum Problem",
      company: "Google",
      difficulty: "easy",
      category: "Arrays",
      addedDate: "2024-03-10",
      status: "active"
    },
    {
      id: "2",
      title: "Binary Tree Traversal",
      company: "Microsoft",
      difficulty: "medium",
      category: "Trees",
      addedDate: "2024-03-12",
      status: "active"
    },
    {
      id: "3",
      title: "Dynamic Programming - LCS",
      company: "Amazon",
      difficulty: "hard",
      category: "Dynamic Programming",
      addedDate: "2024-03-15",
      status: "active"
    },
  ])

  const filteredQuestions = questions.filter(q =>
    q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileQuestion className="h-8 w-8 text-indigo-600" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Question Management</h1>
            <p className="text-muted-foreground">Manage interview questions and problems</p>
          </div>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Question
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
            <FileQuestion className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{questions.length}</div>
            <p className="text-xs text-muted-foreground">All questions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Easy</CardTitle>
            <Badge variant="secondary" className="bg-green-100 text-green-800">Easy</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {questions.filter(q => q.difficulty === "easy").length}
            </div>
            <p className="text-xs text-muted-foreground">Easy difficulty</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Medium</CardTitle>
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Medium</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {questions.filter(q => q.difficulty === "medium").length}
            </div>
            <p className="text-xs text-muted-foreground">Medium difficulty</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hard</CardTitle>
            <Badge variant="secondary" className="bg-red-100 text-red-800">Hard</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {questions.filter(q => q.difficulty === "hard").length}
            </div>
            <p className="text-xs text-muted-foreground">Hard difficulty</p>
          </CardContent>
        </Card>
      </div>

      {/* Questions Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Questions</CardTitle>
              <CardDescription>Manage and view all interview questions</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Question Title</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>Added Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredQuestions.map((question) => (
                <TableRow key={question.id}>
                  <TableCell className="font-medium">{question.title}</TableCell>
                  <TableCell>{question.company}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{question.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="secondary"
                      className={
                        question.difficulty === "easy" 
                          ? "bg-green-100 text-green-800" 
                          : question.difficulty === "medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }
                    >
                      {question.difficulty}
                    </Badge>
                  </TableCell>
                  <TableCell>{question.addedDate}</TableCell>
                  <TableCell>
                    <Badge variant={question.status === "active" ? "default" : "secondary"}>
                      {question.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredQuestions.length === 0 && (
            <div className="text-center py-12">
              <FileQuestion className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No questions found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
