const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Student = require('../models/Student');
const Company = require('../models/Company');
const TPO = require('../models/TPO');
const Job = require('../models/Job');
const Application = require('../models/Application');
require('dotenv').config({ path: './.env' });

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Student.deleteMany({});
    await Company.deleteMany({});
    await TPO.deleteMany({});
    await Job.deleteMany({});
    await Application.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    // ====== CREATE TPO ======
    const tpoUser = await User.create({
      email: 'tpo@college.edu',
      password: hashedPassword,
      role: 'tpo',
      isVerified: true
    });

    await TPO.create({
      userId: tpoUser._id,
      personalInfo: {
        name: 'Dr. Rajesh Kumar',
        designation: 'Head of Training & Placement',
        department: 'T&P Cell',
        contactNumber: '9876543210'
      },
      collegeDetails: {
        collegeName: 'National Institute of Technology',
        collegeCode: 'NIT2024',
        address: 'Sector 1, Tech City, India',
        website: 'https://nit.edu'
      }
    });
    console.log('✅ TPO created: tpo@college.edu / password123');

    // ====== CREATE STUDENTS ======
    const studentsData = [
      {
        email: 'rahul@student.edu',
        name: 'Rahul Sharma',
        branch: 'CSE',
        year: 4,
        rollNumber: 'CSE2022001',
        cgpa: 8.7,
        tenthPercent: 85,
        twelfthPercent: 82,
        backlogs: 0,
        skills: ['JavaScript', 'React', 'Node.js', 'Python', 'MongoDB'],
        domains: ['Web Development', 'Full Stack'],
        expectedPackage: 10
      },
      {
        email: 'priya@student.edu',
        name: 'Priya Patel',
        branch: 'IT',
        year: 4,
        rollNumber: 'IT2022003',
        cgpa: 9.1,
        tenthPercent: 92,
        twelfthPercent: 88,
        backlogs: 0,
        skills: ['Java', 'Spring Boot', 'AWS', 'SQL', 'Docker'],
        domains: ['Backend Development', 'Cloud'],
        expectedPackage: 12
      },
      {
        email: 'amit@student.edu',
        name: 'Amit Kumar',
        branch: 'CSE',
        year: 3,
        rollNumber: 'CSE2023005',
        cgpa: 7.8,
        tenthPercent: 78,
        twelfthPercent: 75,
        backlogs: 1,
        skills: ['HTML', 'CSS', 'JavaScript', 'C++'],
        domains: ['Frontend Development'],
        expectedPackage: 6
      },
      {
        email: 'sneha@student.edu',
        name: 'Sneha Gupta',
        branch: 'ECE',
        year: 4,
        rollNumber: 'ECE2022010',
        cgpa: 8.5,
        tenthPercent: 88,
        twelfthPercent: 86,
        backlogs: 0,
        skills: ['Python', 'Machine Learning', 'TensorFlow', 'Data Analysis'],
        domains: ['AI/ML', 'Data Science'],
        expectedPackage: 10
      },
      {
        email: 'vikram@student.edu',
        name: 'Vikram Singh',
        branch: 'MECH',
        year: 4,
        rollNumber: 'MECH2022015',
        cgpa: 7.5,
        tenthPercent: 80,
        twelfthPercent: 78,
        backlogs: 2,
        skills: ['AutoCAD', 'SolidWorks', 'CATIA'],
        domains: ['Design', 'Manufacturing'],
        expectedPackage: 5
      }
    ];

    const createdStudents = [];
    for (const student of studentsData) {
      const user = await User.create({
        email: student.email,
        password: hashedPassword,
        role: 'student',
        isVerified: true
      });

      const studentProfile = await Student.create({
        userId: user._id,
        personalInfo: {
          name: student.name,
          branch: student.branch,
          year: student.year,
          rollNumber: student.rollNumber
        },
        academics: {
          cgpa: student.cgpa,
          tenthPercent: student.tenthPercent,
          twelfthPercent: student.twelfthPercent,
          backlogs: student.backlogs
        },
        skills: student.skills,
        preferences: {
          domains: student.domains,
          expectedPackage: student.expectedPackage
        }
      });
      createdStudents.push({ user, student: studentProfile });
    }
    console.log(`✅ ${studentsData.length} students created`);

    // ====== CREATE COMPANIES ======
    const companiesData = [
      {
        email: 'google@company.com',
        name: 'Google India',
        description: 'Google is a multinational technology company specializing in Internet-related services and products.',
        website: 'https://google.com',
        logo: 'https://logo.clearbit.com/google.com'
      },
      {
        email: 'microsoft@company.com',
        name: 'Microsoft India',
        description: 'Microsoft Corporation is an American multinational technology corporation producing computer software, consumer electronics, and personal computers.',
        website: 'https://microsoft.com',
        logo: 'https://logo.clearbit.com/microsoft.com'
      },
      {
        email: 'amazon@company.com',
        name: 'Amazon India',
        description: 'Amazon.com, Inc. is an American multinational technology company focusing on e-commerce, cloud computing, and artificial intelligence.',
        website: 'https://amazon.in',
        logo: 'https://logo.clearbit.com/amazon.com'
      }
    ];

    const createdCompanies = [];
    for (const company of companiesData) {
      const user = await User.create({
        email: company.email,
        password: hashedPassword,
        role: 'company',
        isVerified: true
      });

      const companyProfile = await Company.create({
        userId: user._id,
        name: company.name,
        description: company.description,
        website: company.website,
        logo: company.logo
      });
      createdCompanies.push({ user, company: companyProfile });
    }
    console.log(`✅ ${companiesData.length} companies created`);

    // ====== CREATE JOBS ======
    const jobsData = [
      {
        companyIndex: 0, // Google
        title: 'Software Engineer Intern',
        description: 'We are looking for passionate software engineer interns to join our team. You will work on real projects that impact millions of users.',
        package: 8,
        location: 'Bangalore',
        type: 'internship',
        minCgpa: 7.5,
        maxBacklogs: 0,
        requiredSkills: ['JavaScript', 'React', 'Node.js'],
        branches: ['CSE', 'IT'],
        deadline: '2026-08-15'
      },
      {
        companyIndex: 0, // Google
        title: 'Full Stack Developer',
        description: 'Join our core engineering team to build scalable web applications.',
        package: 15,
        location: 'Hyderabad',
        type: 'full-time',
        minCgpa: 8.0,
        maxBacklogs: 0,
        requiredSkills: ['JavaScript', 'React', 'Node.js', 'Python'],
        branches: ['CSE', 'IT', 'ECE'],
        deadline: '2026-08-20'
      },
      {
        companyIndex: 1, // Microsoft
        title: 'SDE - Backend',
        description: 'Build cloud-native applications using Azure services.',
        package: 12,
        location: 'Bangalore',
        type: 'full-time',
        minCgpa: 7.5,
        maxBacklogs: 0,
        requiredSkills: ['Java', 'Spring Boot', 'AWS', 'SQL'],
        branches: ['CSE', 'IT'],
        deadline: '2026-08-25'
      },
      {
        companyIndex: 2, // Amazon
        title: 'Data Analyst',
        description: 'Analyze large datasets to drive business decisions.',
        package: 10,
        location: 'Chennai',
        type: 'full-time',
        minCgpa: 7.0,
        maxBacklogs: 1,
        requiredSkills: ['Python', 'Machine Learning', 'SQL'],
        branches: ['CSE', 'IT', 'ECE'],
        deadline: '2026-08-30'
      }
    ];

    const createdJobs = [];
    for (const job of jobsData) {
      const jobDoc = await Job.create({
        companyId: createdCompanies[job.companyIndex].company._id,
        title: job.title,
        description: job.description,
        package: job.package,
        location: job.location,
        type: job.type,
        eligibility: {
          minCgpa: job.minCgpa,
          maxBacklogs: job.maxBacklogs,
          requiredSkills: job.requiredSkills,
          branches: job.branches
        },
        deadline: new Date(job.deadline)
      });
      createdJobs.push(jobDoc);
    }
    console.log(`✅ ${jobsData.length} jobs created`);

    // ====== CREATE APPLICATIONS ======
    const applicationsData = [
      { studentIndex: 0, jobIndex: 0, status: 'applied' },      // Rahul -> Google Intern
      { studentIndex: 0, jobIndex: 1, status: 'shortlisted' },  // Rahul -> Google Full Stack
      { studentIndex: 1, jobIndex: 2, status: 'interview' },    // Priya -> Microsoft SDE
      { studentIndex: 2, jobIndex: 0, status: 'rejected' },     // Amit -> Google Intern
      { studentIndex: 3, jobIndex: 3, status: 'placed' },       // Sneha -> Amazon Data Analyst
    ];

    for (const app of applicationsData) {
      await Application.create({
        jobId: createdJobs[app.jobIndex]._id,
        studentId: createdStudents[app.studentIndex].student._id,
        status: app.status,
        matchPercentage: Math.floor(Math.random() * 30) + 70, // 70-100%
        appliedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) // Last 7 days
      });
    }
    console.log(`✅ ${applicationsData.length} applications created`);

    console.log('\n🎉 Seed data created successfully!');
    console.log('\n📧 Login Credentials:');
    console.log('  TPO:     tpo@college.edu / password123');
    console.log('  Student: rahul@student.edu / password123');
    console.log('  Student: priya@student.edu / password123');
    console.log('  Company: google@company.com / password123');
    console.log('  Company: microsoft@company.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

seedData();