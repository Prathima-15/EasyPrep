"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface Question {
  id: number
  text: string
  difficulty: string
  frequency: number
  tags: string[]
  topic: string
  company?: string
}

interface SavedQuestionsContextType {
  savedQuestions: Question[]
  saveQuestion: (question: Question) => void
  removeSavedQuestion: (questionId: number) => void
  isQuestionSaved: (questionId: number) => boolean
}

const SavedQuestionsContext = createContext<SavedQuestionsContextType | undefined>(undefined)

export function SavedQuestionsProvider({ children }: { children: ReactNode }) {
  const [savedQuestions, setSavedQuestions] = useState<Question[]>([])

  const saveQuestion = (question: Question) => {
    setSavedQuestions((prev) => {
      if (prev.some((q) => q.id === question.id)) return prev
      return [...prev, question]
    })
  }

  const removeSavedQuestion = (questionId: number) => {
    setSavedQuestions((prev) => prev.filter((q) => q.id !== questionId))
  }

  const isQuestionSaved = (questionId: number) => {
    return savedQuestions.some((q) => q.id === questionId)
  }

  return (
    <SavedQuestionsContext.Provider
      value={{
        savedQuestions,
        saveQuestion,
        removeSavedQuestion,
        isQuestionSaved,
      }}
    >
      {children}
    </SavedQuestionsContext.Provider>
  )
}

export function useSavedQuestions() {
  const context = useContext(SavedQuestionsContext)
  if (context === undefined) {
    throw new Error("useSavedQuestions must be used within a SavedQuestionsProvider")
  }
  return context
}
