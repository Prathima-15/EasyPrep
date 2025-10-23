const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Question = require('../models/Question');
const Company = require('../models/Company');
const { authMiddleware } = require('../middleware/auth');

// ============ REVIEWS ============

// Get all reviews for a company
router.get('/companies/:companyId/reviews', async (req, res) => {
  try {
    const { companyId } = req.params;
    const { status } = req.query;

    console.log('Fetching reviews for companyId:', companyId);
    console.log('Status filter:', status);

    // Don't filter by status unless explicitly requested
    const filter = { companyId };
    if (status) {
      filter.status = status;
    }

    const reviews = await Review.find(filter).sort({ createdAt: -1 });

    console.log(`Found ${reviews.length} reviews for company ${companyId}`);

    // Calculate statistics
    const stats = {
      totalReviews: reviews.length,
      averageRating: reviews.length > 0 
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
        : 0,
      averageDifficulty: 0,
      difficultyDistribution: {
        Easy: reviews.filter(r => r.difficulty === 'Easy').length,
        Medium: reviews.filter(r => r.difficulty === 'Medium').length,
        Hard: reviews.filter(r => r.difficulty === 'Hard').length
      },
      ratingDistribution: {
        5: reviews.filter(r => r.rating === 5).length,
        4: reviews.filter(r => r.rating === 4).length,
        3: reviews.filter(r => r.rating === 3).length,
        2: reviews.filter(r => r.rating === 2).length,
        1: reviews.filter(r => r.rating === 1).length
      }
    };

    // Calculate average difficulty (Easy=1, Medium=2, Hard=3)
    const difficultyMap = { Easy: 1, Medium: 2, Hard: 3 };
    if (reviews.length > 0) {
      stats.averageDifficulty = reviews.reduce((sum, r) => sum + difficultyMap[r.difficulty], 0) / reviews.length;
    }

    // Extract common topics and pros/cons
    const allPros = reviews.flatMap(r => r.pros || []);
    const allCons = reviews.flatMap(r => r.cons || []);
    const allTopics = reviews.flatMap(r => r.interviewTopics || []);

    stats.commonPros = [...new Set(allPros)].slice(0, 5);
    stats.commonCons = [...new Set(allCons)].slice(0, 5);
    stats.commonTopics = [...new Set(allTopics)];

    res.json({
      success: true,
      data: {
        reviews,
        stats
      }
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews'
    });
  }
});

// Create new review
router.post('/companies/:companyId/reviews', authMiddleware, async (req, res) => {
  try {
    const { companyId } = req.params;
    const { 
      role, 
      rating, 
      difficulty, 
      summary, 
      pros, 
      cons, 
      interviewTopics 
    } = req.body;

    console.log('Creating review for companyId:', companyId);
    console.log('Review data:', { role, rating, difficulty, summary });

    // Validate company exists
    const company = await Company.findById(companyId);
    if (!company) {
      console.log('Company not found:', companyId);
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    console.log('Company found:', company.name);

    // Check if user already reviewed this company
    const existingReview = await Review.findOne({
      companyId,
      studentId: req.user.userId
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a review for this company'
      });
    }

    const review = new Review({
      companyId,
      companyName: company.name,
      studentId: req.user.userId,
      studentName: req.user.name || 'Anonymous',
      studentEmail: req.user.email || '',
      role,
      rating,
      difficulty,
      summary,
      pros: Array.isArray(pros) ? pros : pros ? [pros] : [],
      cons: Array.isArray(cons) ? cons : cons ? [cons] : [],
      interviewTopics: Array.isArray(interviewTopics) ? interviewTopics : interviewTopics ? [interviewTopics] : []
    });

    await review.save();

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: review
    });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit review',
      error: error.message
    });
  }
});

// ============ QUESTIONS ============

// Get all questions for a company
router.get('/companies/:companyId/questions', async (req, res) => {
  try {
    const { companyId } = req.params;
    const { status, category } = req.query;

    console.log('Fetching questions for companyId:', companyId);
    console.log('Status filter:', status);
    console.log('Category filter:', category);

    // Don't filter by status unless explicitly requested
    const filter = { companyId };
    if (status) {
      filter.status = status;
    }
    if (category) {
      filter.category = category;
    }

    const questions = await Question.find(filter).sort({ createdAt: -1 });

    console.log(`Found ${questions.length} questions for company ${companyId}`);

    // Group by category
    const categories = {
      'Technical / DSA': [],
      'System Design': [],
      'Behavioral': [],
      'Database': [],
      'Other': []
    };

    questions.forEach(q => {
      if (categories[q.category]) {
        categories[q.category].push(q);
      }
    });

    const stats = {
      totalQuestions: questions.length,
      byCategory: {
        'Technical / DSA': questions.filter(q => q.category === 'Technical / DSA').length,
        'System Design': questions.filter(q => q.category === 'System Design').length,
        'Behavioral': questions.filter(q => q.category === 'Behavioral').length,
        'Database': questions.filter(q => q.category === 'Database').length,
        'Other': questions.filter(q => q.category === 'Other').length
      },
      byDifficulty: {
        Easy: questions.filter(q => q.difficulty === 'Easy').length,
        Medium: questions.filter(q => q.difficulty === 'Medium').length,
        Hard: questions.filter(q => q.difficulty === 'Hard').length
      }
    };

    const response = {
      success: true,
      data: {
        questions,
        categories,
        stats
      }
    };
    
    console.log('Sending questions response:', JSON.stringify(response, null, 2).substring(0, 500));
    
    res.json(response);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch questions'
    });
  }
});

// Create new question(s)
router.post('/companies/:companyId/questions', authMiddleware, async (req, res) => {
  try {
    const { companyId } = req.params;
    const { questions } = req.body;

    console.log('Creating questions for companyId:', companyId);
    console.log('Number of questions:', Array.isArray(questions) ? questions.length : 1);

    // Validate company exists
    const company = await Company.findById(companyId);
    if (!company) {
      console.log('Company not found:', companyId);
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    console.log('Company found:', company.name);

    // Ensure questions is an array
    const questionsArray = Array.isArray(questions) ? questions : [questions];

    const createdQuestions = [];

    for (const q of questionsArray) {
      const question = new Question({
        companyId,
        companyName: company.name,
        studentId: req.user.userId,
        studentName: req.user.name || 'Anonymous',
        studentEmail: req.user.email || '',
        studentDepartment: req.user.department || '',
        category: q.category,
        questionText: q.questionText,
        difficulty: q.difficulty,
        tags: q.tags || [],
        answer: q.answer || '',
        status: 'approved' // Auto-approve for now
      });

      await question.save();
      createdQuestions.push(question);
    }

    res.status(201).json({
      success: true,
      message: `${createdQuestions.length} question(s) submitted successfully`,
      data: createdQuestions
    });
  } catch (error) {
    console.error('Error creating questions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit questions',
      error: error.message
    });
  }
});

// Update question
router.put('/questions/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const question = await Question.findById(id);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    // Only allow owner to update
    if (question.studentId !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this question'
      });
    }

    Object.assign(question, updates);
    await question.save();

    res.json({
      success: true,
      message: 'Question updated successfully',
      data: question
    });
  } catch (error) {
    console.error('Error updating question:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update question'
    });
  }
});

// Delete question
router.delete('/questions/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const question = await Question.findById(id);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    // Only allow owner or admin to delete
    if (question.studentId !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this question'
      });
    }

    await Question.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Question deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting question:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete question'
    });
  }
});

module.exports = router;
