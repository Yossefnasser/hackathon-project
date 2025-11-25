import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LiquidEther from './components/LiquidEther';
import Header from './components/Header';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Tasks from './pages/Tasks';
import TaskDetail from './pages/TaskDetail';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        {/* LiquidEther Background */}
        <div className="liquid-background">
          <LiquidEther
            colors={['#FFFFFF', '#000000', '#6B7280']}
            mouseForce={20}
            cursorSize={100}
            isViscous={false}
            viscous={30}
            iterationsViscous={32}
            iterationsPoisson={32}
            resolution={0.5}
            isBounce={false}
            autoDemo={true}
            autoSpeed={0.5}
            autoIntensity={2.2}
            takeoverDuration={0.25}
            autoResumeDelay={3000}
            autoRampDuration={0.6}
          />
        </div>

        {/* Floating Header */}
        <Header />

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/tasks/:id" element={<TaskDetail />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

