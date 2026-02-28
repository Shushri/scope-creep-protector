import { useState } from 'react'
import Dashboard from './components/Dashboard'
import Chat from './components/Chat'

function App() {
  const [currentScreen, setCurrentScreen] = useState('dashboard') // 'dashboard' | 'chat'
  const [contractText, setContractText] = useState('')

  const handleStartChat = (contract) => {
    setContractText(contract)
    setCurrentScreen('chat')
  }

  const handleBackToDashboard = () => {
    setCurrentScreen('dashboard')
  }

  return (
    <div className="font-sans antialiased text-slate-800">
      {currentScreen === 'dashboard' ? (
        <Dashboard onStartChat={handleStartChat} />
      ) : (
        <Chat contract={contractText} onBack={handleBackToDashboard} />
      )}
    </div>
  )
}

export default App
