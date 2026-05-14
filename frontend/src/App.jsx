import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import FeedbackList from './pages/FeedbackList'
import FeedbackDetail from './pages/FeedbackDetail'
import SubmitFeedback from './pages/SubmitFeedback'
import Search from './pages/Search'
import './index.css'

export default function App() {
  return (
    <BrowserRouter>
      <div className="layout">
        <Navbar />
        <main className="main">
          <Routes>
            <Route path="/"               element={<Dashboard />} />
            <Route path="/feedback"       element={<FeedbackList />} />
            <Route path="/feedback/:id"   element={<FeedbackDetail />} />
            <Route path="/submit"         element={<SubmitFeedback />} />
            <Route path="/search"         element={<Search />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
