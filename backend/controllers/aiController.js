const asyncHandler = require('express-async-handler');
const Student = require('../models/Student');
const { ErrorResponse } = require('../middleware/errorMiddleware');

// ============================================
// Google Gemini Direct API — Bulletproof Setup
// ============================================
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Models to try in order (newest stable first)
const GEMINI_MODELS = [
  'gemini-1.5-flash-002',
  'gemini-1.5-flash',
  'gemini-flash-latest',
  'gemini-1.5-pro-002',
  'gemini-1.5-pro',
];

// ============================================
// Helper: Call Gemini API with auto model fallback
// ============================================
const callGemini = async (contents, generationConfig = {}) => {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY not set in .env');
  }

  let lastError = null;

  for (const modelName of GEMINI_MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${GEMINI_API_KEY}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: generationConfig.temperature ?? 0.7,
            maxOutputTokens: generationConfig.maxOutputTokens ?? 2000,
            ...generationConfig
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const msg = errorData.error?.message || '';

        if (response.status === 404 || msg.includes('not found')) {
          console.log(`⚠️ Model ${modelName} not found, trying next...`);
          lastError = msg;
          continue;
        }

        if (response.status === 403) {
          throw new Error(`Gemini API 403: API key invalid or Generative Language API not enabled. Go to https://aistudio.google.com/app/apikey and create a new key.`);
        }
        if (response.status === 429) {
          throw new Error(`Gemini API 429: Quota exceeded. Wait a few minutes or create a new API key.`);
        }

        throw new Error(`Gemini API ${response.status}: ${msg}`);
      }

      const data = await response.json();

      if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
        throw new Error('Empty response from Gemini');
      }

      console.log(`✅ Gemini model ${modelName} worked!`);
      return data.candidates[0].content.parts[0].text;
    } catch (err) {
      if (err.message.includes('not found')) {
        lastError = err.message;
        continue;
      }
      throw err;
    }
  }

  throw new Error(
    `All Gemini models failed. Last error: ${lastError}.\n\n` +
    `FIX KARNE KE STEPS:\n` +
    `1. https://aistudio.google.com/app/apikey pe jao\n` +
    `2. "Create API key in new project" karo\n` +
    `3. Nayi key ko .env mein GEMINI_API_KEY=... daalo\n` +
    `4. Backend restart karo (npm run dev)\n\n` +
    `Agar phir bhi na chale toh OpenAI use karo — npm install openai`
  );
};

// ============================================
// @desc    General AI Chat
// @route   POST /api/ai/chat
// @access  Private (Student)
// ============================================
const chatWithAI = asyncHandler(async (req, res) => {
  const { message, history = [] } = req.body;

  if (!message) {
    throw new ErrorResponse('Please provide a message', 400);
  }

  try {
    let geminiHistory = history.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    const firstUserIndex = geminiHistory.findIndex(m => m.role === 'user');
    if (firstUserIndex !== -1) {
      geminiHistory = geminiHistory.slice(firstUserIndex);
    } else {
      geminiHistory = [];
    }

    const contents = [
      ...geminiHistory,
      {
        role: 'user',
        parts: [{ text: `You are an expert AI tutor and career counselor for a Smart Placement Portal. Help with coding, DSA, technical concepts, career guidance, and interview prep. Be friendly and concise.\n\nStudent asks: ${message}` }]
      }
    ];

    const reply = await callGemini(contents, { temperature: 0.7, maxOutputTokens: 2000 });

    res.status(200).json({
      success: true,
      data: {
        reply,
        timestamp: new Date().toISOString()
      }
    });
  } catch (err) {
    console.error('Gemini Chat Error:', err.message);
    throw new ErrorResponse(err.message, 500);
  }
});

// ============================================
// @desc    Generate Interview Questions
// @route   POST /api/ai/generate-interview
// @access  Private (Student)
// ============================================
const generateInterviewQuestions = asyncHandler(async (req, res) => {
  const { role, difficulty, count } = req.body;

  if (!role || !difficulty || !count) {
    throw new ErrorResponse('Please provide role, difficulty and count', 400);
  }

  try {
    const prompt = `Generate ${count} ${difficulty} level technical interview questions for a ${role} position.

Requirements:
- Mix of theoretical and practical/coding questions
- Real interview style, challenging
- Include problem-solving, system design (if applicable), core concepts
- Return ONLY a valid JSON array in this exact format, no markdown, no code blocks:
[
  {
    "id": 1,
    "question": "What is...?",
    "type": "theory",
    "topic": "React",
    "expectedPoints": ["point 1", "point 2"]
  }
]`;

    const text = await callGemini(
      [{ role: 'user', parts: [{ text: prompt }] }],
      { temperature: 0.8, maxOutputTokens: 3000 }
    );

    let cleanJson = text.trim();
    if (cleanJson.startsWith('```json')) cleanJson = cleanJson.replace(/```json\n?/, '');
    if (cleanJson.endsWith('```')) cleanJson = cleanJson.replace(/\n?```$/, '');
    cleanJson = cleanJson.trim();

    const questions = JSON.parse(cleanJson);

    res.status(200).json({
      success: true,
      data: { role, difficulty, count, questions }
    });
  } catch (err) {
    console.error('Gemini Interview Error:', err.message);
    throw new ErrorResponse('Failed to generate questions. Please try again.', 500);
  }
});

// ============================================
// @desc    Evaluate Interview Answer
// @route   POST /api/ai/evaluate-answer
// @access  Private (Student)
// ============================================
const evaluateAnswer = asyncHandler(async (req, res) => {
  const { question, answer, role, difficulty } = req.body;

  if (!question || !answer) {
    throw new ErrorResponse('Question and answer are required', 400);
  }

  try {
    const prompt = `You are a senior technical interviewer evaluating a candidate for a ${role} position.

Question: "${question}"

Candidate's Answer: "${answer}"

Evaluate this answer and return ONLY a valid JSON object in this exact format, no markdown, no code blocks:
{
  "score": 8,
  "feedback": "Good answer but missing...",
  "strengths": ["Strength 1", "Strength 2"],
  "improvements": ["Improvement 1", "Improvement 2"],
  "modelAnswer": "A perfect answer would include..."
}

Score strictly out of 10. Be honest but encouraging. Return ONLY valid JSON.`;

    const text = await callGemini(
      [{ role: 'user', parts: [{ text: prompt }] }],
      { temperature: 0.5, maxOutputTokens: 1500 }
    );

    let cleanJson = text.trim();
    if (cleanJson.startsWith('```json')) cleanJson = cleanJson.replace(/```json\n?/, '');
    if (cleanJson.endsWith('```')) cleanJson = cleanJson.replace(/\n?```$/, '');
    cleanJson = cleanJson.trim();

    const evaluation = JSON.parse(cleanJson);

    res.status(200).json({
      success: true,
      data: evaluation
    });
  } catch (err) {
    console.error('Gemini Evaluation Error:', err.message);
    throw new ErrorResponse('Failed to evaluate answer. Please try again.', 500);
  }
});

// ============================================
// @desc    Parse resume and extract data
// @route   POST /api/ai/parse-resume
// @access  Private (Student only)
// ============================================
const parseResume = asyncHandler(async (req, res) => {
  const { resumeText } = req.body;

  if (!resumeText || resumeText.trim().length < 50) {
    throw new ErrorResponse('Please provide valid resume text (at least 50 characters)', 400);
  }

  const extractedData = extractResumeData(resumeText);

  const student = await Student.findOne({ userId: req.user._id });

  if (!student) {
    throw new ErrorResponse('Student profile not found', 404);
  }

  const existingSkills = student.skills || [];
  const newSkills = extractedData.skills.filter(
    skill => !existingSkills.some(es => es.toLowerCase() === skill.toLowerCase())
  );
  student.skills = [...existingSkills, ...newSkills];

  if (extractedData.cgpa) {
    const currentCgpa = student.academics?.cgpa || 0;
    if (extractedData.cgpa > currentCgpa) {
      if (!student.academics) student.academics = {};
      student.academics.cgpa = extractedData.cgpa;
    }
  }

  student.resumeText = resumeText;
  student.resumeParsedAt = new Date();

  if (!student.resumeData) student.resumeData = {};
  student.resumeData.projects = extractedData.projects;
  student.resumeData.experience = extractedData.experience;
  student.resumeData.education = extractedData.education;

  await student.save();

  res.status(200).json({
    success: true,
    message: 'Resume parsed successfully',
    data: {
      extracted: extractedData,
      updatedSkills: newSkills,
      totalSkills: student.skills,
      cgpa: student.academics?.cgpa || null,
      profileUpdated: true
    }
  });
});

// ============================================
// @desc    Get last parsed resume data
// @route   GET /api/ai/resume-data
// @access  Private (Student only)
// ============================================
const getResumeData = asyncHandler(async (req, res) => {
  const student = await Student.findOne({ userId: req.user._id })
    .select('skills academics resumeText resumeData resumeParsedAt');

  if (!student) {
    throw new ErrorResponse('Student profile not found', 404);
  }

  res.status(200).json({
    success: true,
    data: {
      skills: student.skills || [],
      cgpa: student.academics?.cgpa || null,
      resumeText: student.resumeText || '',
      resumeData: student.resumeData || {},
      parsedAt: student.resumeParsedAt || null
    }
  });
});

// ============================================
// AI Resume Extractor Engine
// ============================================
const extractResumeData = (text) => {
  const data = {
    skills: [],
    cgpa: null,
    education: [],
    projects: [],
    experience: []
  };

  const lowerText = text.toLowerCase();
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);

  const skillKeywords = [
    'javascript', 'python', 'java', 'c++', 'c#', 'ruby', 'php', 'go', 'rust', 'swift',
    'kotlin', 'typescript', 'scala', 'perl', 'r', 'matlab', 'dart', 'shell', 'bash',
    'react', 'react.js', 'reactjs', 'vue', 'vue.js', 'vuejs', 'angular', 'svelte', 
    'next.js', 'nextjs', 'nuxt.js', 'nuxtjs', 'html', 'html5', 'css', 'css3', 
    'sass', 'scss', 'less', 'tailwind', 'tailwind css', 'bootstrap', 'material-ui', 
    'mui', 'antd', 'chakra ui', 'redux', 'zustand', 'webpack', 'vite',
    'node.js', 'nodejs', 'express', 'express.js', 'nestjs', 'django', 'flask', 
    'fastapi', 'spring', 'spring boot', 'laravel', 'rails', 'asp.net', 'graphql',
    'rest api', 'restful api', 'soap', 'microservices',
    'mongodb', 'mongoose', 'mysql', 'postgresql', 'postgres', 'sqlite', 'redis', 
    'elasticsearch', 'dynamodb', 'cassandra', 'firebase', 'supabase', 'prisma',
    'aws', 'amazon web services', 'azure', 'gcp', 'google cloud', 'docker', 
    'kubernetes', 'k8s', 'jenkins', 'github actions', 'gitlab ci', 'terraform', 
    'ansible', 'nginx', 'apache', 'pm2',
    'react native', 'flutter', 'android', 'ios', 'xamarin', 'ionic', 'cordova',
    'tensorflow', 'pytorch', 'keras', 'scikit-learn', 'sklearn', 'pandas', 
    'numpy', 'matplotlib', 'seaborn', 'opencv', 'nltk', 'spacy', 'huggingface',
    'machine learning', 'deep learning', 'nlp', 'computer vision', 'data science',
    'git', 'github', 'gitlab', 'bitbucket', 'jira', 'confluence', 'figma', 
    'postman', 'insomnia', 'swagger', 'openapi', 'soapui', 'selenium', 'cypress',
    'jest', 'mocha', 'chai', 'junit', 'pytest', 'unittest', 'tdd', 'bdd',
    'agile', 'scrum', 'kanban', 'oauth', 'jwt', 'sso', 'ldap', 'webhooks',
    'socket.io', 'websockets', 'webrtc', 'grpc', 'rabbitmq', 'kafka', 'celery'
  ];

  skillKeywords.forEach(skill => {
    const patterns = [
      new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i'),
      new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '[\s.-]?')}\\b`, 'i')
    ];

    const found = patterns.some(pattern => pattern.test(text));
    if (found && !data.skills.some(s => s.toLowerCase() === skill.toLowerCase())) {
      const normalized = skill
        .replace(/js$/, '.js')
        .replace(/^node\.js$/, 'Node.js')
        .replace(/^react\.js$/, 'React.js')
        .replace(/^vue\.js$/, 'Vue.js')
        .replace(/^next\.js$/, 'Next.js')
        .replace(/^nuxt\.js$/, 'Nuxt.js');
      data.skills.push(normalized.charAt(0).toUpperCase() + normalized.slice(1));
    }
  });

  const cgpaPatterns = [
    /(?:cgpa|gpa|grade point average)[\s:]*(\d+\.?\d*)\s*(?:\/\s*10)?/i,
    /(?:cgpa|gpa)[\s:]*(\d+\.?\d*)/i,
    /(\d+\.?\d*)\s*(?:cgpa|gpa)/i,
    /(?:score|aggregate)[\s:]*(\d+\.?\d*)\s*(?:\/\s*10)?/i,
    /(?:percentage|percent)[\s:]*(\d+\.?\d*)\s*%/i,
    /(\d{1,2}\.\d{1,2})\s*\/\s*10/i,
    /(\d{1,2}\.\d{1,2})\s*\/\s*100/i
  ];

  for (const pattern of cgpaPatterns) {
    const match = text.match(pattern);
    if (match) {
      let value = parseFloat(match[1]);
      if (value > 10 && value <= 100) {
        value = parseFloat((value / 9.5).toFixed(2));
      }
      if (value >= 0 && value <= 10) {
        data.cgpa = value;
        break;
      }
    }
  }

  const eduKeywords = ['bachelor', 'b.tech', 'b.e.', 'm.tech', 'm.e.', 'm.s.', 'm.sc', 'ph.d', 'mba', 'bca', 'mca', 'diploma'];
  lines.forEach((line, idx) => {
    const lowerLine = line.toLowerCase();
    if (eduKeywords.some(kw => lowerLine.includes(kw))) {
      const nextLine = lines[idx + 1] || '';
      const yearMatch = (line + ' ' + nextLine).match(/\b(20\d{2})\b/g);
      data.education.push({
        degree: line,
        institution: nextLine.length < 100 ? nextLine : '',
        year: yearMatch ? yearMatch[yearMatch.length - 1] : null
      });
    }
  });

  const projectKeywords = ['project', 'projects', 'academic project', 'personal project'];
  let inProjectSection = false;
  let currentProject = null;

  lines.forEach((line, idx) => {
    const lowerLine = line.toLowerCase();

    if (projectKeywords.some(kw => lowerLine.includes(kw)) && line.length < 50) {
      inProjectSection = true;
      return;
    }

    if (inProjectSection) {
      if (/^(experience|skills|education|certifications|achievements|hobbies|interests|languages)[\s:]*$/i.test(line)) {
        inProjectSection = false;
        if (currentProject) {
          data.projects.push(currentProject);
          currentProject = null;
        }
        return;
      }

      if (line.length > 10) {
        if (!currentProject) {
          currentProject = { title: line, description: '' };
        } else {
          if (line.length > currentProject.title.length) {
            currentProject.description += line + ' ';
          } else {
            data.projects.push(currentProject);
            currentProject = { title: line, description: '' };
          }
        }
      }
    }
  });

  if (currentProject) data.projects.push(currentProject);

  const expKeywords = ['experience', 'work experience', 'internship', 'internships', 'employment', 'professional experience'];
  let inExpSection = false;
  let currentExp = null;

  lines.forEach((line, idx) => {
    const lowerLine = line.toLowerCase();

    if (expKeywords.some(kw => lowerLine.includes(kw)) && line.length < 50) {
      inExpSection = true;
      return;
    }

    if (inExpSection) {
      if (/^(projects|skills|education|certifications|achievements)[\s:]*$/i.test(line)) {
        inExpSection = false;
        if (currentExp) {
          data.experience.push(currentExp);
          currentExp = null;
        }
        return;
      }

      if (line.length > 10) {
        if (!currentExp) {
          currentExp = { role: line, description: '' };
        } else {
          currentExp.description += line + ' ';
        }
      }
    }
  });

  if (currentExp) data.experience.push(currentExp);

  data.skills = [...new Set(data.skills)].slice(0, 30);
  data.projects = data.projects.slice(0, 5).map(p => ({
    title: p.title.substring(0, 100),
    description: p.description.trim().substring(0, 300)
  }));
  data.experience = data.experience.slice(0, 5).map(e => ({
    role: e.role.substring(0, 100),
    description: e.description.trim().substring(0, 300)
  }));

  return data;
};

// ============================================
// @desc    Parse uploaded PDF resume
// @route   POST /api/ai/parse-resume-pdf
// @access  Private (Student only)
// ============================================
const parseResumePDF = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ErrorResponse('Please upload a PDF file', 400);
  }

  if (req.file.mimetype !== 'application/pdf') {
    throw new ErrorResponse('Only PDF files are allowed', 400);
  }

  if (req.file.size > 5 * 1024 * 1024) {
    throw new ErrorResponse('File size must be less than 5MB', 400);
  }

  try {
    let pdfParse;
    try {
      const mod = require('pdf-parse');
      pdfParse = mod;
      if (typeof pdfParse !== 'function') {
        pdfParse = mod.default || mod.parse;
      }
      if (typeof pdfParse !== 'function') {
        const keys = Object.keys(mod);
        for (const key of keys) {
          if (typeof mod[key] === 'function') {
            pdfParse = mod[key];
            break;
          }
        }
      }
    } catch (importErr) {
      console.error('pdf-parse import failed:', importErr);
      throw new ErrorResponse('PDF parser library failed to load. Please paste text manually.', 500);
    }

    if (typeof pdfParse !== 'function') {
      console.error('pdf-parse is not a function. Type:', typeof pdfParse);
      throw new ErrorResponse('PDF parser not available. Please paste text manually.', 500);
    }

    const buffer = req.file.buffer;
    const pdfData = await pdfParse(buffer);
    const resumeText = pdfData.text;

    if (!resumeText || resumeText.trim().length < 50) {
      throw new ErrorResponse('Could not extract enough text from PDF. Please paste text manually.', 400);
    }

    const extractedData = extractResumeData(resumeText);

    const student = await Student.findOne({ userId: req.user._id });

    if (!student) {
      throw new ErrorResponse('Student profile not found', 404);
    }

    const existingSkills = student.skills || [];
    const newSkills = extractedData.skills.filter(
      skill => !existingSkills.some(es => es.toLowerCase() === skill.toLowerCase())
    );
    student.skills = [...existingSkills, ...newSkills];

    if (extractedData.cgpa) {
      const currentCgpa = student.academics?.cgpa || 0;
      if (extractedData.cgpa > currentCgpa) {
        if (!student.academics) student.academics = {};
        student.academics.cgpa = extractedData.cgpa;
      }
    }

    student.resumeText = resumeText;
    student.resumeParsedAt = new Date();
    student.resumeFileName = req.file.originalname;

    if (!student.resumeData) student.resumeData = {};
    student.resumeData.projects = extractedData.projects;
    student.resumeData.experience = extractedData.experience;
    student.resumeData.education = extractedData.education;

    await student.save();

    res.status(200).json({
      success: true,
      message: 'Resume PDF parsed successfully',
      data: {
        extracted: extractedData,
        updatedSkills: newSkills,
        totalSkills: student.skills,
        cgpa: student.academics?.cgpa || null,
        profileUpdated: true,
        fileName: req.file.originalname,
        textPreview: resumeText.substring(0, 500) + (resumeText.length > 500 ? '...' : '')
      }
    });
  } catch (err) {
    if (err instanceof ErrorResponse) throw err;
    console.error('PDF Parse Error:', err);
    throw new ErrorResponse('Failed to parse PDF: ' + (err.message || 'Unknown error'), 500);
  }
});

module.exports = {
  chatWithAI,
  generateInterviewQuestions,
  evaluateAnswer,
  parseResume,
  getResumeData,
  parseResumePDF
};