import { useState } from 'react';
import { aiAPI } from '../services/apiService';
import { 
  Brain, 
  ArrowRight, 
  ArrowLeft, 
  Loader2, 
  Clock, 
  Send,
  Trophy,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ROLES = [
  'Software Engineer',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Data Scientist',
  'DevOps Engineer',
  'Mobile Developer'
];

const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

const MockInterview = () => {
  const [step, setStep] = useState('setup'); // setup | loading | interview | result
  const [role, setRole] = useState('Software Engineer');
  const [difficulty, setDifficulty] = useState('Medium');
  const [questionCount, setQuestionCount] = useState(5);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState('');

  const startInterview = async () => {
    setStep('loading');
    try {
      const res = await aiAPI.generateInterviewQuestions(role, difficulty, questionCount);
      setQuestions(res.data.data.questions);
      setStep('interview');
    } catch (err) {
      alert('Failed to generate questions. Please try again.');
      setStep('setup');
    }
  };

  const submitAnswer = async () => {
    if (!currentAnswer.trim()) return;
    
    const currentQ = questions[currentIndex];
    setAnswers(prev => ({ ...prev, [currentQ.id]: currentAnswer }));
    
    setLoading(true);
    try {
      const res = await aiAPI.evaluateAnswer(
        currentQ.question,
        currentAnswer,
        role,
        difficulty
      );
      
      setEvaluations(prev => [...prev, {
        question: currentQ,
        answer: currentAnswer,
        ...res.data.data
      }]);
      
      setCurrentAnswer('');
      
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        setStep('result');
      }
    } catch (err) {
      alert('Failed to evaluate. Moving to next question.');
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        setStep('result');
      }
    } finally {
      setLoading(false);
    }
  };

  const getTotalScore = () => {
    if (evaluations.length === 0) return 0;
    return (evaluations.reduce((sum, e) => sum + e.score, 0) / evaluations.length).toFixed(1);
  };

  const getScoreColor = (score) => {
    if (score >= 8) return 'text-green-600 bg-green-100';
    if (score >= 5) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  // ==================== SETUP SCREEN ====================
  if (step === 'setup') {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="mb-8">
            <Link to="/dashboard" className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1 mb-4">
              <ArrowLeft className="h-4 w-4" /> Back to Dashboard
            </Link>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-12 w-12 bg-primary-100 rounded-xl flex items-center justify-center">
                <Brain className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AI Mock Interview</h1>
                <p className="text-gray-600">Practice with AI-powered interviews and get instant feedback</p>
              </div>
            </div>
          </div>

          <div className="card space-y-8">
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Select Role</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {ROLES.map((r) => (
                  <button
                    key={r}
                    onClick={() => setRole(r)}
                    className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                      role === r
                        ? 'border-primary-600 bg-primary-50 text-primary-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Difficulty Level</label>
              <div className="flex gap-3">
                {DIFFICULTIES.map((d) => (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className={`flex-1 p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                      difficulty === d
                        ? 'border-primary-600 bg-primary-50 text-primary-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Question Count */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Number of Questions: <span className="text-primary-600">{questionCount}</span>
              </label>
              <input
                type="range"
                min="3"
                max="10"
                value={questionCount}
                onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>3</span>
                <span>10</span>
              </div>
            </div>

            <button
              onClick={startInterview}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <Sparkles className="h-5 w-5" />
              Start AI Interview
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==================== LOADING SCREEN ====================
  if (step === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">Generating Questions...</h2>
          <p className="text-gray-500 mt-2">AI is preparing personalized {difficulty} questions for {role}</p>
        </div>
      </div>
    );
  }

  // ==================== INTERVIEW SCREEN ====================
  if (step === 'interview') {
    const currentQ = questions[currentIndex];
    const progress = ((currentIndex) / questions.length) * 100;

    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4">
          {/* Progress */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Question {currentIndex + 1} of {questions.length}
              </span>
              <span className="text-sm text-gray-500">{Math.round(progress)}% Complete</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full">
              <div 
                className="h-2 bg-primary-600 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="card">
            {/* Question */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                  currentQ.type === 'coding' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {currentQ.type === 'coding' ? 'Coding' : 'Theory'}
                </span>
                <span className="px-2 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-600">
                  {currentQ.topic}
                </span>
              </div>
              <h2 className="text-lg font-semibold text-gray-900">{currentQ.question}</h2>
              {currentQ.expectedPoints && (
                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs font-medium text-blue-700 mb-1">Hint:</p>
                  <ul className="text-sm text-blue-600 space-y-1">
                    {currentQ.expectedPoints.map((point, i) => (
                      <li key={i}>• {point}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Answer Input */}
            <div className="space-y-4">
              <textarea
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                placeholder="Type your answer here..."
                rows={6}
                className="w-full border border-gray-300 rounded-xl p-4 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none resize-none"
              />
              <div className="flex gap-3">
                <button
                  onClick={submitAnswer}
                  disabled={!currentAnswer.trim() || loading}
                  className="flex-1 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : currentIndex === questions.length - 1 ? (
                    <>
                      <Send className="h-5 w-5" />
                      Finish Interview
                    </>
                  ) : (
                    <>
                      Next Question
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==================== RESULT SCREEN ====================
  if (step === 'result') {
    const totalScore = getTotalScore();

    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-8">
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Interview Complete!</h1>
            <p className="text-gray-600 mt-2">Here's your AI-generated performance report</p>
          </div>

          {/* Overall Score */}
          <div className="card mb-6 text-center">
            <p className="text-sm text-gray-500 mb-2">Overall Score</p>
            <div className={`inline-flex items-center justify-center h-20 w-20 rounded-full text-2xl font-bold ${getScoreColor(totalScore)}`}>
              {totalScore}
            </div>
            <p className="text-sm text-gray-500 mt-2">out of 10</p>
          </div>

          {/* Detailed Feedback */}
          <div className="space-y-4">
            {evaluations.map((evalItem, idx) => (
              <div key={idx} className="card">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm text-gray-500">Question {idx + 1}</p>
                    <p className="font-medium text-gray-900">{evalItem.question.question}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${getScoreColor(evalItem.score)}`}>
                    {evalItem.score}/10
                  </span>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium text-gray-700 mb-1">Your Answer:</p>
                    <p className="text-gray-600">{evalItem.answer}</p>
                  </div>

                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="font-medium text-green-700 mb-1 flex items-center gap-1">
                      <CheckCircle2 className="h-4 w-4" /> Strengths:
                    </p>
                    <ul className="text-green-600 space-y-1">
                      {evalItem.strengths?.map((s, i) => (
                        <li key={i}>• {s}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <p className="font-medium text-yellow-700 mb-1 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" /> Improvements:
                    </p>
                    <ul className="text-yellow-600 space-y-1">
                      {evalItem.improvements?.map((imp, i) => (
                        <li key={i}>• {imp}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="font-medium text-blue-700 mb-1">Model Answer:</p>
                    <p className="text-blue-600">{evalItem.modelAnswer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => {
                setStep('setup');
                setCurrentIndex(0);
                setAnswers({});
                setEvaluations([]);
                setCurrentAnswer('');
              }}
              className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <RotateCcw className="h-5 w-5" />
              Try Again
            </button>
            <Link
              to="/dashboard"
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }
};

export default MockInterview;