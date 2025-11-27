import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Header.css';

export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    const handleHowItWorksClick = (e: React.MouseEvent) => {
        e.preventDefault();
        closeMobileMenu();

        if (location.pathname === '/') {
            const section = document.getElementById('how-it-works');
            if (section) {
                section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        } else {
            navigate('/#how-it-works');
        }
    };

    return (
        <>
            <header className="floating-header">
                <div className="header-pill">
                    <div className="logo">
                        <span>LOGO</span>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="nav-links desktop-nav">
                        <Link to="/" className="nav-link">Home</Link>
                        <Link to="/explore" className="nav-link">Explore</Link>
                        <Link to="/tasks" className="nav-link">Tasks</Link>
                        <a href="#how-it-works" className="nav-link" onClick={handleHowItWorksClick}>How It Works</a>
                        <a href="#contact" className="nav-link">Contact</a>
                    </nav>

                    {/* Hamburger Menu Button */}
                    <button
                        className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}
                        onClick={toggleMobileMenu}
                        aria-label="Toggle menu"
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>
            </header>

            {/* Mobile Sidebar */}
            <div className={`mobile-sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
                <nav className="mobile-nav">
                    <Link to="/" className="mobile-nav-link" onClick={closeMobileMenu}>
                        Home
                    </Link>
                    <Link to="/explore" className="mobile-nav-link" onClick={closeMobileMenu}>
                        Explore
                    </Link>
                    <Link to="/tasks" className="mobile-nav-link" onClick={closeMobileMenu}>
                        Tasks
                    </Link>
                    <a href="#how-it-works" className="mobile-nav-link" onClick={handleHowItWorksClick}>
                        How It Works
                    </a>
                    <a href="#contact" className="mobile-nav-link" onClick={closeMobileMenu}>
                        Contact
                    </a>
                </nav>
            </div>

            {/* Overlay */}
            {isMobileMenuOpen && (
                <div className="mobile-overlay" onClick={closeMobileMenu}></div>
            )}
        </>
    );
}
