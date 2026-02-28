import { useState } from 'react'

export default function Dashboard({ onStartChat }) {
    const [contractText, setContractText] = useState(
        "I will build a 3-page React website for $500. No backend work is included."
    )

    const handleSubmit = (e) => {
        e.preventDefault()
        if (contractText.trim()) {
            onStartChat(contractText)
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-8 border border-slate-100">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Scope Creep Protector</h1>
                    <p className="text-slate-500 mt-2">Define your boundaries before the chat begins.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="contract" className="block text-sm font-semibold text-slate-700 mb-2">
                            The Agreed Contract / Scope of Work
                        </label>
                        <textarea
                            id="contract"
                            rows={6}
                            className="w-full rounded-xl border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-slate-50 p-4 text-slate-700 font-medium resize-none transition-colors border"
                            placeholder="E.g., I will build a 3-page React website for $500. No backend work is included."
                            value={contractText}
                            onChange={(e) => setContractText(e.target.value)}
                            required
                        />
                        <p className="mt-2 text-sm text-slate-500">
                            Be specific. Our AI will use this text to protect you from scope creep during client conversations.
                        </p>
                    </div>

                    <button
                        type="submit"
                        className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-lg font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all hover:shadow-lg active:scale-[0.98]"
                    >
                        Lock in Scope & Start Chatting
                    </button>
                </form>
            </div>
        </div>
    )
}
