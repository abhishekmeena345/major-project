const asyncHandler = require('express-async-handler');
const Student = require('../models/Student');
const { ErrorResponse } = require('../middleware/errorMiddleware');

// ============================================
// @desc    Start AI mock interview
// @route   POST /api/interviews/start
// @access  Private (Student only)
// ============================================
const startInterview = asyncHandler(async (req, res) => {
  const { role, difficulty, numQuestions } = req.body;

  if (!role) {
    throw new ErrorResponse('Please select a job role', 400);
  }

  const questions = generateInterviewQuestions(role, difficulty || 'medium', numQuestions || 5);

  res.status(200).json({
    success: true,
    data: {
      interviewId: Date.now().toString(),
      role,
      difficulty: difficulty || 'medium',
      totalQuestions: questions.length,
      questions
    }
  });
});

// ============================================
// @desc    Submit answer and get AI feedback
// @route   POST /api/interviews/submit-answer
// @access  Private (Student only)
// ============================================
const submitAnswer = asyncHandler(async (req, res) => {
  const { question, answer, role } = req.body;

  if (!question || !answer) {
    throw new ErrorResponse('Question and answer are required', 400);
  }

  const feedback = generateFeedback(question, answer, role);

  res.status(200).json({
    success: true,
    data: feedback
  });
});

// ============================================
// @desc    Complete interview and get report
// @route   POST /api/interviews/complete
// @access  Private (Student only)
// ============================================
const completeInterview = asyncHandler(async (req, res) => {
  const { interviewData } = req.body;

  if (!interviewData || !interviewData.responses) {
    throw new ErrorResponse('Interview data is required', 400);
  }

  const report = generateReport(interviewData);

  // Save to student history
  const student = await Student.findOne({ userId: req.user._id });
  if (student) {
    if (!student.interviewHistory) student.interviewHistory = [];
    student.interviewHistory.unshift({
      role: interviewData.role,
      difficulty: interviewData.difficulty,
      score: report.overallScore,
      totalQuestions: interviewData.responses.length,
      completedAt: new Date()
    });
    // Keep only last 10
    student.interviewHistory = student.interviewHistory.slice(0, 10);
    await student.save();
  }

  res.status(200).json({
    success: true,
    data: report
  });
});

// ============================================
// @desc    Get interview history
// @route   GET /api/interviews/history
// @access  Private (Student only)
// ============================================
const getInterviewHistory = asyncHandler(async (req, res) => {
  const student = await Student.findOne({ userId: req.user._id })
    .select('interviewHistory');

  res.status(200).json({
    success: true,
    data: student?.interviewHistory || []
  });
});

// ============================================
// AI Interview Question Generator
// ============================================
const generateInterviewQuestions = (role, difficulty, count) => {
  const questionBank = {
    'Software Engineer': {
      easy: [
        { id: 1, type: 'technical', question: 'What is the difference between let, const, and var in JavaScript?' },
        { id: 2, type: 'technical', question: 'Explain what REST API is and its key principles.' },
        { id: 3, type: 'technical', question: 'What is the difference between SQL and NoSQL databases?' },
        { id: 4, type: 'behavioral', question: 'Tell me about a time you had to learn a new technology quickly.' },
        { id: 5, type: 'technical', question: 'What is Git and why do we use version control?' },
        { id: 6, type: 'technical', question: 'Explain the difference between frontend and backend development.' },
        { id: 7, type: 'behavioral', question: 'How do you handle tight deadlines and pressure?' }
      ],
      medium: [
        { id: 1, type: 'technical', question: 'Explain closures in JavaScript with an example.' },
        { id: 2, type: 'technical', question: 'What is event loop in Node.js? How does it work?' },
        { id: 3, type: 'technical', question: 'Explain React Virtual DOM and how it improves performance.' },
        { id: 4, type: 'system-design', question: 'Design a URL shortening service like Bitly.' },
        { id: 5, type: 'technical', question: 'What are promises and async/await? How do they differ from callbacks?' },
        { id: 6, type: 'technical', question: 'Explain database indexing and when to use it.' },
        { id: 7, type: 'behavioral', question: 'Describe a challenging bug you fixed and your debugging approach.' },
        { id: 8, type: 'technical', question: 'What is CORS and how do you handle it in web applications?' }
      ],
      hard: [
        { id: 1, type: 'technical', question: 'Implement a debounce function in JavaScript. Explain use cases.' },
        { id: 2, type: 'system-design', question: 'Design a real-time chat application. What technologies and architecture would you use?' },
        { id: 3, type: 'technical', question: 'Explain how React Fiber works and its advantages over the old reconciler.' },
        { id: 4, type: 'technical', question: 'What are memory leaks in JavaScript? How do you detect and prevent them?' },
        { id: 5, type: 'system-design', question: 'Design a distributed cache system. How would you handle cache invalidation?' },
        { id: 6, type: 'technical', question: 'Explain the CAP theorem and its implications on distributed systems.' },
        { id: 7, type: 'behavioral', question: 'Tell me about a time you had to make a critical technical decision with incomplete information.' }
      ]
    },
    'Frontend Developer': {
      easy: [
        { id: 1, type: 'technical', question: 'What is the box model in CSS?' },
        { id: 2, type: 'technical', question: 'Explain the difference between class and id selectors in CSS.' },
        { id: 3, type: 'technical', question: 'What is semantic HTML and why is it important?' },
        { id: 4, type: 'technical', question: 'How do you center a div horizontally and vertically?' },
        { id: 5, type: 'behavioral', question: 'How do you keep up with the rapidly changing frontend ecosystem?' }
      ],
      medium: [
        { id: 1, type: 'technical', question: 'Explain CSS specificity and how conflicts are resolved.' },
        { id: 2, type: 'technical', question: 'What is the difference between useEffect and useLayoutEffect in React?' },
        { id: 3, type: 'technical', question: 'How does browser rendering work? Explain critical rendering path.' },
        { id: 4, type: 'technical', question: 'What are CSS Grid and Flexbox? When would you use each?' },
        { id: 5, type: 'technical', question: 'Explain React hooks rules and why they exist.' },
        { id: 6, type: 'behavioral', question: 'How do you ensure your web applications are accessible (a11y)?' }
      ],
      hard: [
        { id: 1, type: 'technical', question: 'Build a custom React hook for infinite scrolling. Explain your approach.' },
        { id: 2, type: 'technical', question: 'How would you optimize a React app that renders 10,000 list items?' },
        { id: 3, type: 'technical', question: 'Explain how server-side rendering (SSR) works and its trade-offs.' },
        { id: 4, type: 'system-design', question: 'Design a component library. How would you handle theming and customization?' },
        { id: 5, type: 'technical', question: 'What are web workers and when would you use them?' }
      ]
    },
    'Backend Developer': {
      easy: [
        { id: 1, type: 'technical', question: 'What is an API and what are common HTTP methods?' },
        { id: 2, type: 'technical', question: 'Explain the difference between authentication and authorization.' },
        { id: 3, type: 'technical', question: 'What is middleware in Express.js?' },
        { id: 4, type: 'technical', question: 'Explain the request-response lifecycle in a web server.' }
      ],
      medium: [
        { id: 1, type: 'technical', question: 'Explain JWT authentication flow. What are its pros and cons?' },
        { id: 2, type: 'technical', question: 'What is database normalization? Explain 1NF, 2NF, 3NF.' },
        { id: 3, type: 'technical', question: 'How do you handle rate limiting in an API?' },
        { id: 4, type: 'system-design', question: 'Design a rate limiter for an API gateway.' },
        { id: 5, type: 'technical', question: 'Explain the difference between horizontal and vertical scaling.' }
      ],
      hard: [
        { id: 1, type: 'technical', question: 'Design a consistent hashing mechanism for distributed caching.' },
        { id: 2, type: 'technical', question: 'Explain database sharding strategies and their trade-offs.' },
        { id: 3, type: 'system-design', question: 'Design a message queue system. How would you ensure message delivery?' },
        { id: 4, type: 'technical', question: 'What is eventual consistency and when is it acceptable?' },
        { id: 5, type: 'technical', question: 'Explain saga pattern for distributed transactions.' }
      ]
    },
    'Data Scientist': {
      easy: [
        { id: 1, type: 'technical', question: 'What is the difference between supervised and unsupervised learning?' },
        { id: 2, type: 'technical', question: 'Explain overfitting and underfitting with examples.' },
        { id: 3, type: 'technical', question: 'What is the difference between classification and regression?' }
      ],
      medium: [
        { id: 1, type: 'technical', question: 'Explain how Random Forest algorithm works.' },
        { id: 2, type: 'technical', question: 'What is cross-validation and why is it important?' },
        { id: 3, type: 'technical', question: 'Explain gradient descent and its variants.' },
        { id: 4, type: 'technical', question: 'How do you handle imbalanced datasets?' }
      ],
      hard: [
        { id: 1, type: 'technical', question: 'Explain transformers architecture and attention mechanism.' },
        { id: 2, type: 'technical', question: 'How would you build a recommendation system for an e-commerce platform?' },
        { id: 3, type: 'technical', question: 'Explain backpropagation in neural networks mathematically.' }
      ]
    },
    'DevOps Engineer': {
      easy: [
        { id: 1, type: 'technical', question: 'What is CI/CD and why is it important?' },
        { id: 2, type: 'technical', question: 'Explain the difference between Docker and virtual machines.' },
        { id: 3, type: 'technical', question: 'What is Infrastructure as Code (IaC)?' }
      ],
      medium: [
        { id: 1, type: 'technical', question: 'Explain Kubernetes architecture: pods, services, deployments.' },
        { id: 2, type: 'technical', question: 'How do you monitor and log microservices?' },
        { id: 3, type: 'technical', question: 'What are blue-green deployments and canary releases?' }
      ],
      hard: [
        { id: 1, type: 'technical', question: 'Design a self-healing infrastructure system.' },
        { id: 2, type: 'technical', question: 'How would you secure a Kubernetes cluster?' },
        { id: 3, type: 'system-design', question: 'Design a multi-region disaster recovery strategy.' }
      ]
    }
  };

  const roleQuestions = questionBank[role] || questionBank['Software Engineer'];
  const difficultyQuestions = roleQuestions[difficulty] || roleQuestions['medium'];

  // Shuffle and pick requested count
  const shuffled = [...difficultyQuestions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, shuffled.length));
};

// ============================================
// AI Feedback Generator
// ============================================
const generateFeedback = (question, answer, role) => {
  const answerLower = answer.toLowerCase();
  const wordCount = answer.trim().split(/\s+/).length;

  // Calculate score based on multiple factors
  let score = 50; // Base score
  let feedbackPoints = [];
  let improvements = [];

  // Length check
  if (wordCount < 10) {
    score -= 15;
    improvements.push('Your answer is too brief. Try to elaborate more with examples.');
  } else if (wordCount < 30) {
    score += 5;
    feedbackPoints.push('Good length, but could be more detailed.');
  } else if (wordCount >= 50) {
    score += 15;
    feedbackPoints.push('Excellent detailed answer!');
  }

  // Keyword/technical term detection
  const technicalKeywords = {
    'javascript': ['closure', 'scope', 'hoisting', 'prototype', 'event loop', 'promise', 'async', 'await', 'callback'],
    'react': ['component', 'state', 'props', 'hook', 'virtual dom', 'jsx', 're-render', 'useeffect', 'usestate'],
    'node': ['event loop', 'middleware', 'express', 'npm', 'module', 'buffer', 'stream', 'cluster'],
    'database': ['index', 'query', 'schema', 'normalization', 'transaction', 'join', 'aggregation', 'sharding'],
    'system-design': ['scalability', 'load balancer', 'cache', 'database', 'microservice', 'api gateway', 'queue', 'cdn'],
    'general': ['example', 'because', 'therefore', 'however', 'specifically', 'best practice', 'performance', 'optimize']
  };

  let keywordMatches = 0;
  Object.values(technicalKeywords).flat().forEach(keyword => {
    if (answerLower.includes(keyword)) keywordMatches++;
  });

  if (keywordMatches >= 5) {
    score += 20;
    feedbackPoints.push('Great use of technical terminology!');
  } else if (keywordMatches >= 2) {
    score += 10;
    feedbackPoints.push('Good technical vocabulary.');
  } else {
    improvements.push('Try to include more relevant technical terms and concepts.');
  }

  // Structure check
  if (answer.includes('.') && answer.includes(',')) {
    score += 5;
    feedbackPoints.push('Well-structured answer with proper sentences.');
  }

  // Example check
  if (answerLower.includes('for example') || answerLower.includes('instance') || answerLower.includes('like when')) {
    score += 10;
    feedbackPoints.push('Great job including examples!');
  } else {
    improvements.push('Try to include real-world examples to support your answer.');
  }

  // Confidence indicators
  if (answerLower.includes('i think') || answerLower.includes('maybe') || answerLower.includes('not sure')) {
    score -= 5;
    improvements.push('Avoid uncertain language. Be confident in your answers.');
  }

  // Cap score
  score = Math.min(100, Math.max(0, score));

  // Generate overall feedback
  let overallFeedback = '';
  if (score >= 85) {
    overallFeedback = 'Outstanding answer! You demonstrated deep understanding and clear communication.';
  } else if (score >= 70) {
    overallFeedback = 'Good answer with solid understanding. A few improvements could make it excellent.';
  } else if (score >= 50) {
    overallFeedback = 'Decent attempt. Focus on adding more detail and technical depth.';
  } else {
    overallFeedback = 'Needs improvement. Try to structure your answer better and include more technical details.';
  }

  return {
    score,
    wordCount,
    overallFeedback,
    strengths: feedbackPoints,
    improvements: improvements.slice(0, 3),
    sampleAnswer: generateSampleAnswer(question, role)
  };
};

// ============================================
// Sample Answer Generator
// ============================================
const generateSampleAnswer = (question, role) => {
  const samples = {
    'closure': 'A closure is a function that has access to variables in its outer (enclosing) lexical scope even after the outer function has returned. For example: function outer() { let count = 0; return function inner() { return ++count; } }',
    'virtual dom': 'The Virtual DOM is a lightweight JavaScript representation of the actual DOM. React creates a virtual DOM tree, compares it with the previous one using diffing algorithm, and only updates the changed parts in the real DOM, improving performance.',
    'rest api': 'REST (Representational State Transfer) is an architectural style for designing networked applications. Key principles include: statelessness, client-server architecture, cacheability, uniform interface, and layered system.',
    'event loop': 'The event loop is the mechanism that allows Node.js to perform non-blocking I/O operations. It continuously checks the call stack and callback queue, moving callbacks to the stack when it is empty.',
    'jwt': 'JWT (JSON Web Token) is a compact, URL-safe means of representing claims between parties. It consists of three parts: header, payload, and signature. The flow: client logs in, server generates JWT, client sends JWT in Authorization header for subsequent requests.',
    'database indexing': 'Database indexing is a data structure technique to improve the speed of data retrieval operations. It works like a book index - instead of scanning the entire table, the database uses the index to find rows quickly. However, indexes slow down write operations and take extra storage.'
  };

  // Try to match question with sample
  for (const [key, value] of Object.entries(samples)) {
    if (question.toLowerCase().includes(key)) return value;
  }

  return 'A good answer should include: clear definition, key concepts explanation, practical examples, and real-world use cases. Structure your answer with an introduction, main points, and conclusion.';
};

// ============================================
// Final Report Generator
// ============================================
const generateReport = (interviewData) => {
  const responses = interviewData.responses;
  const totalScore = responses.reduce((sum, r) => sum + r.feedback.score, 0);
  const avgScore = Math.round(totalScore / responses.length);

  const strengths = [];
  const weaknesses = [];
  const topicCoverage = {};

  responses.forEach(r => {
    r.feedback.strengths.forEach(s => {
      if (!strengths.includes(s)) strengths.push(s);
    });
    r.feedback.improvements.forEach(i => {
      if (!weaknesses.includes(i)) weaknesses.push(i);
    });
    
    const topic = r.question.type;
    topicCoverage[topic] = (topicCoverage[topic] || 0) + 1;
  });

  let performanceLevel = '';
  let nextSteps = [];

  if (avgScore >= 85) {
    performanceLevel = 'Excellent';
    nextSteps = [
      'You are interview-ready! Focus on system design for senior roles.',
      'Practice whiteboard coding under time pressure.',
      'Prepare behavioral stories using STAR method.'
    ];
  } else if (avgScore >= 70) {
    performanceLevel = 'Good';
    nextSteps = [
      'Strengthen areas with lower scores by studying core concepts.',
      'Practice explaining complex topics in simple terms.',
      'Work on providing more concrete examples in answers.'
    ];
  } else if (avgScore >= 50) {
    performanceLevel = 'Average';
    nextSteps = [
      'Review fundamental concepts for your target role.',
      'Practice structured answering: definition → explanation → example.',
      'Study common interview questions and prepare template answers.'
    ];
  } else {
    performanceLevel = 'Needs Improvement';
    nextSteps = [
      'Start with basics: review core CS fundamentals.',
      'Watch mock interview videos to understand expected answer quality.',
      'Practice daily with flashcards and coding problems.',
      'Consider joining a study group or mock interview platform.'
    ];
  }

  return {
    overallScore: avgScore,
    totalQuestions: responses.length,
    performanceLevel,
    topicCoverage,
    strengths: strengths.slice(0, 5),
    weaknesses: weaknesses.slice(0, 5),
    nextSteps,
    completedAt: new Date()
  };
};

module.exports = {
  startInterview,
  submitAnswer,
  completeInterview,
  getInterviewHistory
};