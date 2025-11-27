import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import LiquidEther from './components/LiquidEther';
import Header from './components/Header';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Tasks from './pages/Tasks';
import TaskDetail from './pages/TaskDetail';
import CodeEditor from './pages/CodeEditor';
import './App.css';

function AppContent() {
  const location = useLocation();
  const isCodeEditorPage = location.pathname.includes('/solve');

  return (
    <div className="app-container">
      {/* LiquidEther Background */}
      <div className="liquid-background">
        <LiquidEther />
      </div>

      {/* Floating Header - Hidden on Code Editor */}
      {!isCodeEditorPage && <Header />}

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/tasks/:id" element={<TaskDetail />} />
        <Route path="/tasks/:id/solve" element={<CodeEditor />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;

