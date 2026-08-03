// import { useState, useRef, useEffect } from 'react';
// import { aiAPI } from '../services/apiService';
// import { 
//   Send, 
//   Bot, 
//   User, 
//   Loader2, 
//   Sparkles, 
//   Trash2, 
//   ArrowLeft,
//   Copy,
//   Check
// } from 'lucide-react';
// import { Link } from 'react-router-dom';

// const AIChat = () => {
//   const [messages, setMessages] = useState([
//     {
//       role: 'assistant',
//       content: 'Hello! I am your AI Placement Assistant. Ask me anything about coding, DSA, system design, resume tips, or interview preparation!'
//     }
//   ]);
//   const [input, setInput] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [copiedId, setCopiedId] = useState(null);
//   const messagesEndRef = useRef(null);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const handleSend = async () => {
//     if (!input.trim() || loading) return;

//     const userMessage = { role: 'user', content: input.trim() };
//     setMessages(prev => [...prev, userMessage]);
//     setInput('');
//     setLoading(true);

//     try {
//       // Convert messages to API format (last 10 messages for context)
//       const history = messages.slice(-10).map(m => ({
//         role: m.role,
//         content: m.content
//       }));

//       const res = await aiAPI.chat(userMessage.content, history);
//       const reply = res.data.data.reply;

//       setMessages(prev => [...prev, {
//         role: 'assistant',
//         content: reply
//       }]);
//     } catch (err) {
//       setMessages(prev => [...prev, {
//         role: 'assistant',
//         content: 'Sorry, I encountered an error. Please try again in a moment.'
//       }]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSend();
//     }
//   };

//   const clearChat = () => {
//     setMessages([{
//       role: 'assistant',
//       content: 'Hello! I am your AI Placement Assistant. Ask me anything about coding, DSA, system design, resume tips, or interview preparation!'
//     }]);
//   };

//   const copyToClipboard = (text, id) => {
//     navigator.clipboard.writeText(text);
//     setCopiedId(id);
//     setTimeout(() => setCopiedId(null), 2000);
//   };

//   const formatMessage = (content) => {
//     // Simple markdown-like formatting
//     return content
//       .split('```')
//       .map((part, index) => {
//         if (index % 2 === 1) {
//           // Code block
//           return (
//             <pre key={index} className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-2 text-sm">
//               <code>{part.replace(/^\w+\n/, '')}</code>
//             </pre>
//           );
//         }
//         // Regular text with bold and lists
//         return part.split('\n').map((line, i) => {
//           if (line.startsWith('**') && line.endsWith('**')) {
//             return <h3 key={i} className="font-bold text-gray-900 mt-3 mb-1">{line.replace(/\*\*/g, '')}</h3>;
//           }
//           if (line.startsWith('- ')) {
//             return <li key={i} className="ml-4 text-gray-700">{line.replace('- ', '')}</li>;
//           }
//           if (line.match(/^\d+\./)) {
//             return <li key={i} className="ml-4 text-gray-700">{line}</li>;
//           }
//           return <p key={i} className="text-gray-700 mb-1">{line}</p>;
//         });
//       });
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col">
//       {/* Header */}
//       <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
//         <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <Link to="/dashboard" className="text-gray-500 hover:text-gray-700">
//               <ArrowLeft className="h-5 w-5" />
//             </Link>
//             <div className="h-10 w-10 bg-primary-100 rounded-xl flex items-center justify-center">
//               <Sparkles className="h-5 w-5 text-primary-600" />
//             </div>
//             <div>
//               <h1 className="font-semibold text-gray-900">AI Assistant</h1>
//               <p className="text-xs text-gray-500">Powered by GPT</p>
//             </div>
//           </div>
//           <button
//             onClick={clearChat}
//             className="flex items-center gap-1.5 text-sm text-red-600 hover:text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
//           >
//             <Trash2 className="h-4 w-4" />
//             Clear
//           </button>
//         </div>
//       </div>

//       {/* Messages */}
//       <div className="flex-1 overflow-y-auto">
//         <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
//           {messages.map((msg, index) => (
//             <div
//               key={index}
//               className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
//             >
//               <div className={`h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
//                 msg.role === 'user' ? 'bg-primary-600' : 'bg-gray-200'
//               }`}>
//                 {msg.role === 'user' ? (
//                   <User className="h-4 w-4 text-white" />
//                 ) : (
//                   <Bot className="h-4 w-4 text-gray-600" />
//                 )}
//               </div>
              
//               <div className={`max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
//                 <div className={`relative group rounded-2xl px-4 py-3 ${
//                   msg.role === 'user' 
//                     ? 'bg-primary-600 text-white' 
//                     : 'bg-white border border-gray-200 text-gray-900'
//                 }`}>
//                   {msg.role === 'assistant' && (
//                     <button
//                       onClick={() => copyToClipboard(msg.content, index)}
//                       className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-gray-100"
//                     >
//                       {copiedId === index ? (
//                         <Check className="h-3 w-3 text-green-600" />
//                       ) : (
//                         <Copy className="h-3 w-3 text-gray-400" />
//                       )}
//                     </button>
//                   )}
//                   <div className={`text-sm leading-relaxed ${msg.role === 'assistant' ? 'pr-6' : ''}`}>
//                     {formatMessage(msg.content)}
//                   </div>
//                 </div>
//                 <span className="text-xs text-gray-400 mt-1 px-1">
//                   {msg.role === 'user' ? 'You' : 'AI'} • {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                 </span>
//               </div>
//             </div>
//           ))}
          
//           {loading && (
//             <div className="flex gap-3">
//               <div className="h-8 w-8 rounded-lg bg-gray-200 flex items-center justify-center">
//                 <Bot className="h-4 w-4 text-gray-600" />
//               </div>
//               <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
//                 <div className="flex items-center gap-2 text-sm text-gray-500">
//                   <Loader2 className="h-4 w-4 animate-spin" />
//                   Thinking...
//                 </div>
//               </div>
//             </div>
//           )}
//           <div ref={messagesEndRef} />
//         </div>
//       </div>

//       {/* Input */}
//       <div className="bg-white border-t border-gray-200 sticky bottom-0">
//         <div className="max-w-4xl mx-auto px-4 py-4">
//           <div className="flex items-end gap-3 bg-gray-100 rounded-2xl p-2">
//             <textarea
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               onKeyDown={handleKeyDown}
//               placeholder="Ask anything about coding, DSA, interviews..."
//               rows={1}
//               className="flex-1 bg-transparent px-3 py-2 text-sm text-gray-900 placeholder-gray-500 resize-none outline-none max-h-32"
//               style={{ minHeight: '40px' }}
//             />
//             <button
//               onClick={handleSend}
//               disabled={!input.trim() || loading}
//               className="h-10 w-10 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl flex items-center justify-center transition-colors"
//             >
//               <Send className="h-4 w-4 text-white" />
//             </button>
//           </div>
//           <p className="text-xs text-gray-400 text-center mt-2">
//             AI can make mistakes. Verify important information.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AIChat;
import { useState, useRef, useEffect } from 'react';
import { aiAPI } from '../services/apiService';
import { 
  Send, 
  Bot, 
  User, 
  Loader2, 
  Sparkles, 
  Trash2, 
  ArrowLeft,
  Copy,
  Check
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AIChat = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I am your AI Placement Assistant. Ask me anything about coding, DSA, system design, resume tips, or interview preparation!'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const history = messages.slice(-10).map(m => ({
        role: m.role,
        content: m.content
      }));

      const res = await aiAPI.chat(userMessage.content, history);
      const reply = res.data.data.reply;

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: reply
      }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again in a moment.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([{
      role: 'assistant',
      content: 'Hello! I am your AI Placement Assistant. Ask me anything about coding, DSA, system design, resume tips, or interview preparation!'
    }]);
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatMessage = (content) => {
    return content
      .split('```')
      .map((part, index) => {
        if (index % 2 === 1) {
          return (
            <pre key={index} className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-2 text-sm">
              <code>{part.replace(/^\w+\n/, '')}</code>
            </pre>
          );
        }
        return part.split('\n').map((line, i) => {
          if (line.startsWith('**') && line.endsWith('**')) {
            return <h3 key={i} className="font-bold text-gray-900 mt-3 mb-1">{line.replace(/\*\*/g, '')}</h3>;
          }
          if (line.startsWith('- ')) {
            return <li key={i} className="ml-4 text-gray-700">{line.replace('- ', '')}</li>;
          }
          if (line.match(/^\d+\./)) {
            return <li key={i} className="ml-4 text-gray-700">{line}</li>;
          }
          return <p key={i} className="text-gray-700 mb-1">{line}</p>;
        });
      });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="text-gray-500 hover:text-gray-700">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="h-10 w-10 bg-primary-100 rounded-xl flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-primary-600" />
            </div>
            <div>
              <h1 className="font-semibold text-gray-900">AI Assistant</h1>
              <p className="text-xs text-gray-500">Powered by GPT</p>
            </div>
          </div>
          <button
            onClick={clearChat}
            className="flex items-center gap-1.5 text-sm text-red-600 hover:text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            Clear
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                msg.role === 'user' ? 'bg-primary-600' : 'bg-gray-200'
              }`}>
                {msg.role === 'user' ? (
                  <User className="h-4 w-4 text-white" />
                ) : (
                  <Bot className="h-4 w-4 text-gray-600" />
                )}
              </div>
              
              <div className={`max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`relative group rounded-2xl px-4 py-3 ${
                  msg.role === 'user' 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-white border border-gray-200 text-gray-900'
                }`}>
                  {msg.role === 'assistant' && (
                    <button
                      onClick={() => copyToClipboard(msg.content, index)}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-gray-100"
                    >
                      {copiedId === index ? (
                        <Check className="h-3 w-3 text-green-600" />
                      ) : (
                        <Copy className="h-3 w-3 text-gray-400" />
                      )}
                    </button>
                  )}
                  <div className={`text-sm leading-relaxed ${msg.role === 'assistant' ? 'pr-6' : ''}`}>
                    {formatMessage(msg.content)}
                  </div>
                </div>
                <span className="text-xs text-gray-400 mt-1 px-1">
                  {msg.role === 'user' ? 'You' : 'AI'} • {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex gap-3">
              <div className="h-8 w-8 rounded-lg bg-gray-200 flex items-center justify-center">
                <Bot className="h-4 w-4 text-gray-600" />
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Thinking...
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 sticky bottom-0">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-end gap-3 bg-gray-100 rounded-2xl p-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about coding, DSA, interviews..."
              rows={1}
              className="flex-1 bg-transparent px-3 py-2 text-sm text-gray-900 placeholder-gray-500 resize-none outline-none max-h-32"
              style={{ minHeight: '40px' }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="h-10 w-10 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl flex items-center justify-center transition-colors"
            >
              <Send className="h-4 w-4 text-white" />
            </button>
          </div>
          <p className="text-xs text-gray-400 text-center mt-2">
            AI can make mistakes. Verify important information.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIChat;