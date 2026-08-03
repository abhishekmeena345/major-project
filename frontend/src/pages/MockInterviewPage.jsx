// import { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { interviewAPI } from '../services/apiService';
// import {
//   Mic,
//   Send,
//   ChevronRight,
//   ChevronLeft,
//   Trophy,
//   Target,
//   Brain,
//   Clock,
//   Loader2,
//   CheckCircle2,
//   AlertCircle,
//   Sparkles,
//   RotateCcw,
//   TrendingUp,
//   Award,
//   BookOpen,
//   MessageSquare
// } from 'lucide-react';

// const MockInterviewPage = () => {
//   const [step, setStep] = useState('setup'); // setup, interview, feedback, report
//   const [role, setRole] = useState('Software Engineer');
//   const [difficulty, setDifficulty] = useState('medium');
//   const [numQuestions, setNumQuestions] = useState(5);
  
//   const [interviewData, setInterviewData] = useState(null);
//   const [currentQIndex, setCurrentQIndex] = useState(0);
//   const [answer, setAnswer] = useState('');
//   const [responses, setResponses] = useState([]);
//   const [currentFeedback, setCurrentFeedback] = useState(null);
  
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [report, setReport] = useState(null);
//   const [history, setHistory] = useState([]);

//   const roles = ['Software Engineer', 'Frontend Developer', 'Backend Developer', 'Data Scientist', 'DevOps Engineer'];
//   const difficulties = [
//     { value: 'easy', label: 'Easy', color: 'bg-green-100 text-green-700' },
//     { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-700' },
//     { value: 'hard', label: 'Hard', color: 'bg-red-100 text-red-700' }
//   ];

//   useEffect(() => {
//     fetchHistory();
//   }, []);

//   const fetchHistory = async () => {
//     try {
//       const res = await interviewAPI.getHistory();
//       setHistory(res.data.data || []);
//     } catch (err) {
//       console.log('No history yet');
//     }
//   };

//   const startInterview = async () => {
//     setLoading(true);
//     setError('');
//     try {
//       const res = await interviewAPI.startInterview({ role, difficulty, numQuestions });
//       setInterviewData(res.data.data);
//       setStep('interview');
//       setCurrentQIndex(0);
//       setResponses([]);
//       setAnswer('');
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to start interview');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const submitAnswer = async () => {
//     if (!answer.trim()) {
//       setError('Please provide an answer');
//       return;
//     }

//     setLoading(true);
//     setError('');
//     try {
//       const currentQuestion = interviewData.questions[currentQIndex];
//       const res = await interviewAPI.submitAnswer({
//         question: currentQuestion.question,
//         answer,
//         role
//       });

//       const feedback = res.data.data;
//       setCurrentFeedback(feedback);
      
//       const newResponse = {
//         question: currentQuestion,
//         answer,
//         feedback
//       };
      
//       setResponses(prev => [...prev, newResponse]);
//       setStep('feedback');
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to submit answer');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const nextQuestion = () => {
//     if (currentQIndex < interviewData.questions.length - 1) {
//       setCurrentQIndex(prev => prev + 1);
//       setAnswer('');
//       setCurrentFeedback(null);
//       setStep('interview');
//     } else {
//       finishInterview();
//     }
//   };

//   const finishInterview = async () => {
//     setLoading(true);
//     try {
//       const res = await interviewAPI.completeInterview({
//         interviewData: {
//           role,
//           difficulty,
//           responses
//         }
//       });
//       setReport(res.data.data);
//       setStep('report');
//       fetchHistory();
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to generate report');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const restart = () => {
//     setStep('setup');
//     setInterviewData(null);
//     setCurrentQIndex(0);
//     setAnswer('');
//     setResponses([]);
//     setCurrentFeedback(null);
//     setReport(null);
//     setError('');
//   };

//   const getScoreColor = (score) => {
//     if (score >= 80) return 'text-green-600';
//     if (score >= 60) return 'text-yellow-600';
//     return 'text-red-600';
//   };

//   const getScoreBg = (score) => {
//     if (score >= 80) return 'bg-green-100';
//     if (score >= 60) return 'bg-yellow-100';
//     return 'bg-red-100';
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="mb-8">
//           <div className="flex items-center gap-3 mb-2">
//             <div className="h-10 w-10 bg-primary-100 rounded-xl flex items-center justify-center">
//               <Brain className="h-6 w-6 text-primary-600" />
//             </div>
//             <h1 className="text-3xl font-bold text-gray-900">AI Mock Interview</h1>
//           </div>
//           <p className="text-gray-600">Practice with AI-powered interviews and get instant feedback</p>
//         </div>

//         {/* Error */}
//         {error && (
//           <div className="mb-6 flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg p-4">
//             <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
//             <p className="text-sm text-red-700">{error}</p>
//           </div>
//         )}

//         {/* STEP 1: SETUP */}
//         {step === 'setup' && (
//           <div className="space-y-6">
//             <div className="card">
//               <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
//                 <Target className="h-5 w-5 text-primary-600" />
//                 Interview Setup
//               </h2>

//               <div className="space-y-6">
//                 {/* Role Selection */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-3">Select Role</label>
//                   <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
//                     {roles.map((r) => (
//                       <button
//                         key={r}
//                         onClick={() => setRole(r)}
//                         className={`p-4 rounded-xl border-2 text-left transition-all ${
//                           role === r
//                             ? 'border-primary-500 bg-primary-50'
//                             : 'border-gray-200 hover:border-gray-300'
//                         }`}
//                       >
//                         <div className="font-medium text-gray-900">{r}</div>
//                       </button>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Difficulty */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-3">Difficulty Level</label>
//                   <div className="flex gap-3">
//                     {difficulties.map((d) => (
//                       <button
//                         key={d.value}
//                         onClick={() => setDifficulty(d.value)}
//                         className={`px-6 py-3 rounded-xl border-2 font-medium transition-all ${
//                           difficulty === d.value
//                             ? 'border-primary-500 bg-primary-50 text-primary-700'
//                             : 'border-gray-200 hover:border-gray-300'
//                         }`}
//                       >
//                         {d.label}
//                       </button>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Number of Questions */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-3">
//                     Number of Questions: <span className="text-primary-600 font-bold">{numQuestions}</span>
//                   </label>
//                   <input
//                     type="range"
//                     min="3"
//                     max="10"
//                     value={numQuestions}
//                     onChange={(e) => setNumQuestions(parseInt(e.target.value))}
//                     className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
//                   />
//                   <div className="flex justify-between text-xs text-gray-500 mt-1">
//                     <span>3</span>
//                     <span>10</span>
//                   </div>
//                 </div>

//                 <button
//                   onClick={startInterview}
//                   disabled={loading}
//                   className="w-full btn-primary py-4 text-lg flex items-center justify-center gap-2"
//                 >
//                   {loading ? (
//                     <>
//                       <Loader2 className="h-5 w-5 animate-spin" />
//                       Preparing Interview...
//                     </>
//                   ) : (
//                     <>
//                       <Sparkles className="h-5 w-5" />
//                       Start AI Interview
//                     </>
//                   )}
//                 </button>
//               </div>
//             </div>

//             {/* History */}
//             {history.length > 0 && (
//               <div className="card">
//                 <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
//                   <Trophy className="h-5 w-5 text-yellow-500" />
//                   Past Interviews
//                 </h3>
//                 <div className="space-y-3">
//                   {history.map((item, idx) => (
//                     <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//                       <div>
//                         <p className="font-medium text-gray-900">{item.role}</p>
//                         <p className="text-sm text-gray-500 capitalize">{item.difficulty} • {item.totalQuestions} questions</p>
//                       </div>
//                       <div className={`h-10 w-10 rounded-full flex items-center justify-center ${getScoreBg(item.score)}`}>
//                         <span className={`font-bold ${getScoreColor(item.score)}`}>{item.score}</span>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         )}

//         {/* STEP 2: INTERVIEW */}
//         {step === 'interview' && interviewData && (
//           <div className="card">
//             <div className="flex items-center justify-between mb-6">
//               <div>
//                 <span className="inline-flex px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
//                   {interviewData.role}
//                 </span>
//                 <span className="inline-flex px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium ml-2 capitalize">
//                   {interviewData.difficulty}
//                 </span>
//               </div>
//               <div className="text-sm text-gray-500">
//                 Question {currentQIndex + 1} of {interviewData.questions.length}
//               </div>
//             </div>

//             {/* Progress Bar */}
//             <div className="h-2 bg-gray-200 rounded-full mb-8">
//               <div
//                 className="h-full bg-primary-500 rounded-full transition-all duration-500"
//                 style={{ width: `${((currentQIndex + 1) / interviewData.questions.length) * 100}%` }}
//               ></div>
//             </div>

//             {/* Question */}
//             <div className="mb-6">
//               <span className={`inline-flex px-2 py-1 rounded text-xs font-medium mb-3 ${
//                 interviewData.questions[currentQIndex].type === 'technical' ? 'bg-blue-100 text-blue-700' :
//                 interviewData.questions[currentQIndex].type === 'behavioral' ? 'bg-purple-100 text-purple-700' :
//                 'bg-orange-100 text-orange-700'
//               }`}>
//                 {interviewData.questions[currentQIndex].type}
//               </span>
//               <h3 className="text-xl font-semibold text-gray-900">
//                 {interviewData.questions[currentQIndex].question}
//               </h3>
//             </div>

//             {/* Answer Input */}
//             <textarea
//               value={answer}
//               onChange={(e) => setAnswer(e.target.value)}
//               placeholder="Type your answer here... Be detailed and include examples."
//               rows={8}
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
//             />

//             <div className="flex justify-between items-center mt-4">
//               <p className="text-sm text-gray-500">
//                 {answer.trim().split(/\s+/).filter(w => w.length > 0).length} words
//               </p>
//               <button
//                 onClick={submitAnswer}
//                 disabled={loading || !answer.trim()}
//                 className="btn-primary flex items-center gap-2 disabled:opacity-50"
//               >
//                 {loading ? (
//                   <>
//                     <Loader2 className="h-4 w-4 animate-spin" />
//                     Analyzing...
//                   </>
//                 ) : (
//                   <>
//                     <Send className="h-4 w-4" />
//                     Submit Answer
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         )}

//         {/* STEP 3: FEEDBACK */}
//         {step === 'feedback' && currentFeedback && (
//           <div className="space-y-6">
//             <div className="card">
//               <div className="flex items-center justify-between mb-6">
//                 <h2 className="text-xl font-semibold text-gray-900">AI Feedback</h2>
//                 <div className={`h-14 w-14 rounded-full flex items-center justify-center ${getScoreBg(currentFeedback.score)}`}>
//                   <span className={`text-xl font-bold ${getScoreColor(currentFeedback.score)}`}>{currentFeedback.score}</span>
//                 </div>
//               </div>

//               <p className="text-gray-700 mb-6">{currentFeedback.overallFeedback}</p>

//               {/* Strengths */}
//               {currentFeedback.strengths.length > 0 && (
//                 <div className="mb-6">
//                   <h3 className="font-medium text-green-700 mb-3 flex items-center gap-2">
//                     <CheckCircle2 className="h-5 w-5" />
//                     Strengths
//                   </h3>
//                   <ul className="space-y-2">
//                     {currentFeedback.strengths.map((s, idx) => (
//                       <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
//                         <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
//                         {s}
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               )}

//               {/* Improvements */}
//               {currentFeedback.improvements.length > 0 && (
//                 <div className="mb-6">
//                   <h3 className="font-medium text-orange-700 mb-3 flex items-center gap-2">
//                     <TrendingUp className="h-5 w-5" />
//                     Areas to Improve
//                   </h3>
//                   <ul className="space-y-2">
//                     {currentFeedback.improvements.map((i, idx) => (
//                       <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
//                         <Target className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
//                         {i}
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               )}

//               {/* Sample Answer */}
//               <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//                 <h3 className="font-medium text-blue-700 mb-2 flex items-center gap-2">
//                   <BookOpen className="h-5 w-5" />
//                   Sample Answer
//                 </h3>
//                 <p className="text-sm text-blue-800">{currentFeedback.sampleAnswer}</p>
//               </div>
//             </div>

//             <div className="flex gap-4">
//               <button
//                 onClick={restart}
//                 className="flex-1 btn-secondary flex items-center justify-center gap-2"
//               >
//                 <RotateCcw className="h-4 w-4" />
//                 Restart
//               </button>
//               <button
//                 onClick={nextQuestion}
//                 className="flex-1 btn-primary flex items-center justify-center gap-2"
//               >
//                 {currentQIndex < interviewData.questions.length - 1 ? (
//                   <>
//                     Next Question
//                     <ChevronRight className="h-4 w-4" />
//                   </>
//                 ) : (
//                   <>
//                     See Final Report
//                     <Trophy className="h-4 w-4" />
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         )}

//         {/* STEP 4: REPORT */}
//         {step === 'report' && report && (
//           <div className="space-y-6">
//             <div className="card bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200">
//               <div className="text-center py-8">
//                 <Award className="h-16 w-16 mx-auto mb-4 text-primary-600" />
//                 <h2 className="text-2xl font-bold text-gray-900 mb-2">Interview Complete!</h2>
//                 <div className="inline-flex items-center justify-center h-24 w-24 bg-white rounded-full shadow-lg mb-4">
//                   <span className="text-3xl font-bold text-primary-600">{report.overallScore}</span>
//                 </div>
//                 <p className="text-lg font-medium text-primary-700">{report.performanceLevel}</p>
//               </div>
//             </div>

//             <div className="grid md:grid-cols-2 gap-6">
//               {/* Strengths */}
//               <div className="card">
//                 <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
//                   <CheckCircle2 className="h-5 w-5 text-green-500" />
//                   Your Strengths
//                 </h3>
//                 <ul className="space-y-2">
//                   {report.strengths.map((s, idx) => (
//                     <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
//                       <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
//                       {s}
//                     </li>
//                   ))}
//                 </ul>
//               </div>

//               {/* Weaknesses */}
//               <div className="card">
//                 <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
//                   <Target className="h-5 w-5 text-orange-500" />
//                   Areas to Improve
//                 </h3>
//                 <ul className="space-y-2">
//                   {report.weaknesses.map((w, idx) => (
//                     <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
//                       <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
//                       {w}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             </div>

//             {/* Next Steps */}
//             <div className="card">
//               <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
//                 <TrendingUp className="h-5 w-5 text-primary-600" />
//                 Recommended Next Steps
//               </h3>
//               <div className="space-y-3">
//                 {report.nextSteps.map((step, idx) => (
//                   <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
//                     <div className="h-6 w-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
//                       <span className="text-xs font-bold text-primary-600">{idx + 1}</span>
//                     </div>
//                     <p className="text-sm text-gray-700">{step}</p>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Topic Coverage */}
//             <div className="card">
//               <h3 className="font-semibold text-gray-900 mb-4">Topic Coverage</h3>
//               <div className="space-y-3">
//                 {Object.entries(report.topicCoverage).map(([topic, count]) => (
//                   <div key={topic} className="flex items-center justify-between">
//                     <span className="text-sm text-gray-600 capitalize">{topic}</span>
//                     <div className="flex items-center gap-2">
//                       <div className="h-2 w-32 bg-gray-200 rounded-full overflow-hidden">
//                         <div
//                           className="h-full bg-primary-500 rounded-full"
//                           style={{ width: `${(count / report.totalQuestions) * 100}%` }}
//                         ></div>
//                       </div>
//                       <span className="text-sm font-medium text-gray-900">{count}</span>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <button
//               onClick={restart}
//               className="w-full btn-primary py-4 text-lg flex items-center justify-center gap-2"
//             >
//               <RotateCcw className="h-5 w-5" />
//               Start New Interview
//             </button>
//           </div>
//         )}

//         {/* Back Link */}
//         <div className="mt-8">
//           <Link to="/student/dashboard" className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
//             ← Back to Dashboard
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };
// export default MockInterviewPage;
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