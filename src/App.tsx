import { Routes, Route } from 'react-router-dom'
import ChatPage from './components/ChatPage'
import HomePage from './components/HomePage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/chats/:id" element={<ChatPage />} />
    </Routes>
  )
}

export default App
