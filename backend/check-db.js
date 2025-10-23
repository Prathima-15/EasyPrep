// Quick script to check database contents
require('dotenv').config();
const { connectMongoDB } = require('./src/config/mongodb');
const Review = require('./src/models/Review');
const Question = require('./src/models/Question');
const Company = require('./src/models/Company');

async function checkDatabase() {
  try {
    await connectMongoDB();
    
    console.log('=== DATABASE CHECK ===\n');
    
    // Check companies
    const companies = await Company.find();
    console.log(`📦 Total Companies: ${companies.length}`);
    companies.forEach(c => {
      console.log(`   - ${c.name} (ID: ${c._id})`);
    });
    
    // Check reviews
    console.log(`\n📝 Total Reviews: ${await Review.countDocuments()}`);
    const reviews = await Review.find();
    reviews.forEach(r => {
      console.log(`   - ${r.companyName} | ${r.role} | Rating: ${r.rating} | Status: ${r.status}`);
      console.log(`     CompanyID: ${r.companyId}`);
    });
    
    // Check questions
    console.log(`\n❓ Total Questions: ${await Question.countDocuments()}`);
    const questions = await Question.find();
    questions.forEach(q => {
      console.log(`   - ${q.companyName} | ${q.category} | Status: ${q.status}`);
      console.log(`     CompanyID: ${q.companyId}`);
      console.log(`     Question: ${q.questionText.substring(0, 60)}...`);
    });
    
    // Check if companyIds match
    console.log('\n=== COMPANY ID MATCHING ===');
    if (companies.length > 0 && questions.length > 0) {
      const companyId = companies[0]._id.toString();
      const questionCompanyId = questions[0].companyId.toString();
      console.log(`Company _id: ${companyId}`);
      console.log(`Question companyId: ${questionCompanyId}`);
      console.log(`Match: ${companyId === questionCompanyId ? '✅ YES' : '❌ NO'}`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkDatabase();
