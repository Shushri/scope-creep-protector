import { useState, useRef, useEffect } from 'react'
import { Send, ShieldAlert, CheckCircle2, ChevronLeft } from 'lucide-react'

export default function Chat({ contract, onBack }) {
    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: 'client',
            text: "Hi there! I'm excited to get started on the project.",
            isScopeCreep: false,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    ])
    const [inputValue, setInputValue] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const [showAutoDraft, setShowAutoDraft] = useState(false)
    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages, isTyping])

    const checkScopeCreep = async (messageText) => {
        try {
            // For the hackathon, we simulate a delay to show typing indicator
            setIsTyping(true)

            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const response = await fetch(`${apiUrl}/api/check-message`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contract,
                    message: messageText
                })
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error checking scope:", error);
            // Fallback if backend is not running
            return { isOut_of_scope: false };
        } finally {
            setIsTyping(false)
        }
    }

    const handleSendMessage = async (e) => {
        e.preventDefault()
        if (!inputValue.trim()) return

        const newClientMessage = {
            id: Date.now(),
            sender: 'client',
            text: inputValue,
            isScopeCreep: false, // Initial optimistic render
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }

        setMessages(prev => [...prev, newClientMessage])
        setInputValue('')
        setShowAutoDraft(false)

        // Check with AI backend
        const scopeAnalysis = await checkScopeCreep(newClientMessage.text)

        if (scopeAnalysis.isOut_of_scope) {
            setMessages(prev => prev.map(msg =>
                msg.id === newClientMessage.id
                    ? { ...msg, isScopeCreep: true, warningReason: scopeAnalysis.reason }
                    : msg
            ))
            setShowAutoDraft(true)
        }
    }

    const handleAutoDraft = () => {
        const draftText = "Hi, I noticed this request might be outside our original agreed scope. Let's discuss optionally adding this to the contract with a revised estimate, or we can stick to the initial plan. Let me know how you'd like to proceed!"
        setMessages(prev => [...prev, {
            id: Date.now(),
            sender: 'freelancer',
            text: draftText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }])
        setShowAutoDraft(false)
    }

    return (
        <div className="flex flex-col h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="p-2 -ml-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm">
                            C
                        </div>
                        <div>
                            <h2 className="font-bold text-slate-900">Client Chat</h2>
                            <p className="text-xs text-green-500 font-medium flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
                                Online
                            </p>
                        </div>
                    </div>
                </div>

                <div className="hidden sm:flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full text-sm font-medium text-slate-600 border border-slate-200 group relative">
                    <ShieldAlert size={16} className="text-blue-500" />
                    <span>Protection Active</span>

                    {/* Tooltip showing contract on hover */}
                    <div className="absolute top-full right-0 mt-2 w-64 p-3 bg-slate-800 text-white text-xs rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none transform origin-top-right z-50">
                        <p className="font-semibold text-blue-300 mb-1">Active Contract:</p>
                        <p className="opacity-90 leading-relaxed">{contract}</p>
                    </div>
                </div>
            </header>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scroll-smooth">
                {messages.map((message) => {
                    const isClient = message.sender === 'client'

                    return (
                        <div key={message.id} className={`flex flex-col ${!isClient ? 'items-end' : 'items-start'} max-w-4xl mx-auto w-full`}>
                            <div
                                className={`
                  max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 shadow-sm relative group transition-all
                  ${!isClient
                                        ? 'bg-blue-600 text-white rounded-tr-sm'
                                        : message.isScopeCreep
                                            ? 'bg-red-50 border-2 border-red-500 text-slate-900 rounded-tl-sm ring-4 ring-red-50'
                                            : 'bg-white border border-slate-200 text-slate-900 rounded-tl-sm'
                                    }
                `}
                            >
                                {/* Scope Creep Warning Badge */}
                                {message.isScopeCreep && (
                                    <div className="absolute -top-3 -right-3 bg-red-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md animate-bounce">
                                        <ShieldAlert size={12} />
                                        SCOPE CREEP DETECTED
                                    </div>
                                )}

                                <p className="leading-relaxed text-[15px]">{message.text}</p>

                                <div className={`text-[11px] mt-2 flex items-center gap-1 justify-end ${!isClient ? 'text-blue-200' : 'text-slate-400'}`}>
                                    {message.timestamp}
                                    {!isClient && <CheckCircle2 size={12} className="text-blue-200" />}
                                </div>
                            </div>

                            {/* Warning Reason Box */}
                            {message.isScopeCreep && message.warningReason && (
                                <div className="mt-2 text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl border border-red-100 w-full max-w-[85%] sm:max-w-[75%] shadow-sm animate-fade-in flex items-start gap-3">
                                    <ShieldAlert size={18} className="shrink-0 mt-0.5" />
                                    <div>
                                        <span className="font-bold block mb-0.5">AI Analysis:</span>
                                        {message.warningReason}
                                    </div>
                                </div>
                            )}
                        </div>
                    )
                })}

                {isTyping && (
                    <div className="flex justify-start max-w-4xl mx-auto w-full">
                        <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm p-4 shadow-sm flex gap-1.5 items-center w-20 justify-center">
                            <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Auto-draft Action Bar */}
            {showAutoDraft && (
                <div className="bg-red-50 border-t border-red-100 p-4 max-w-4xl mx-auto w-full rounded-t-2xl shadow-[0_-10px_40px_-5px_rgba(239,68,68,0.15)] animate-slide-up">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3 text-red-800">
                            <div className="bg-red-100 p-2 rounded-full">
                                <ShieldAlert size={20} className="text-red-600" />
                            </div>
                            <div>
                                <p className="font-bold text-sm">How do you want to handle this?</p>
                                <p className="text-xs text-red-600/80">The system can draft a polite response to protect your boundaries.</p>
                            </div>
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                            <button
                                onClick={() => setShowAutoDraft(false)}
                                className="flex-1 sm:flex-none px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                            >
                                Ignore
                            </button>
                            <button
                                onClick={handleAutoDraft}
                                className="flex-1 sm:flex-none px-4 py-2 text-sm font-bold text-white bg-red-600 rounded-lg shadow-sm shadow-red-200 hover:bg-red-700 active:bg-red-800 transition-colors whitespace-nowrap"
                            >
                                Auto-Draft Pushback
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Input Area */}
            <div className="bg-white border-t border-slate-200 p-4 sm:p-6 pb-8 sm:pb-6">
                <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto relative flex items-end gap-2 group">
                    <div className="flex-1 bg-slate-100 rounded-2xl border border-transparent focus-within:border-blue-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-50 transition-all duration-200">
                        <textarea
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Type a message as the client to test the AI..."
                            className="w-full bg-transparent p-4 pl-5 max-h-32 min-h-[56px] resize-none outline-none text-slate-700 font-medium placeholder:text-slate-400"
                            rows={1}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault()
                                    handleSendMessage(e)
                                }
                            }}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={!inputValue.trim()}
                        className="p-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors flex-shrink-0 shadow-sm active:scale-95"
                    >
                        <Send size={24} className={inputValue.trim() ? "translate-x-0.5 -translate-y-0.5 transition-transform" : ""} />
                    </button>
                </form>
                <p className="text-center text-xs text-slate-400 mt-3 max-w-4xl mx-auto">
                    Professional Tip: Try requesting a completely new feature or a change in tech stack to see how the analysis identifies scope creep.
                </p>
            </div>
        </div>
    )
}
