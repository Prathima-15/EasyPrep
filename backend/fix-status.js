// Quick script to approve all existing reviews and questions
require('dotenv').config();
const { connectMongoDB } = require('./src/config/mongodb');
const Review = require('./src/models/Review');
const Question = require('./src/models/Question');

async function fixStatuses() {
  try {
    await connectMongoDB();
    
    // Update all reviews to approved
    const reviewResult = await Review.updateMany(
      { status: 'pending' },
      { $set: { status: 'approved' } }
    );
    console.log(`✅ Updated ${reviewResult.modifiedCount} reviews to approved`);
    
    // Update all questions to approved
    const questionResult = await Question.updateMany(
      { status: 'pending' },
      { $set: { status: 'approved' } }
    );
    console.log(`✅ Updated ${questionResult.modifiedCount} questions to approved`);
    
    // Show current counts
    const totalReviews = await Review.countDocuments();
    const totalQuestions = await Question.countDocuments();
    console.log(`\n📊 Total reviews in database: ${totalReviews}`);
    console.log(`📊 Total questions in database: ${totalQuestions}`);
    
    // Show sample data
    const sampleReviews = await Review.find().limit(3);
    const sampleQuestions = await Question.find().limit(3);
    
    console.log('\n📝 Sample Reviews:');
    sampleReviews.forEach(r => {
      console.log(`  - ${r.companyName} | ${r.role} | Rating: ${r.rating} | Status: ${r.status}`);
    });
    
    console.log('\n📝 Sample Questions:');
    sampleQuestions.forEach(q => {
      console.log(`  - ${q.companyName} | ${q.category} | Status: ${q.status}`);
      console.log(`    Question: ${q.questionText.substring(0, 50)}...`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fixStatuses();
