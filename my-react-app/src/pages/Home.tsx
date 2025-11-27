import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import './Home.css';

const CheckIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ width: '20px', height: '20px' }}>
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

const XIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ width: '20px', height: '20px' }}>
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

export default function Home() {
    const sectionRef = useRef<HTMLElement>(null);
    const stepsRef = useRef<HTMLDivElement>(null);
    const comparisonRef = useRef<HTMLDivElement>(null);
    const location = useLocation();

    useEffect(() => {
        // Handle hash navigation
        if (location.hash === '#how-it-works') {
            setTimeout(() => {
                const section = document.getElementById('how-it-works');
                if (section) {
                    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100);
        }

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        if (sectionRef.current) observer.observe(sectionRef.current);
        if (stepsRef.current) observer.observe(stepsRef.current);
        if (comparisonRef.current) observer.observe(comparisonRef.current);

        return () => observer.disconnect();
    }, []);

    const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        const section = document.getElementById('how-it-works');
        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <>
            {/* Hero Content */}
            <main className="hero-section">
                <h1 className="hero-title">
                    GAIN REAL EXPERIENCE BRO
                </h1>
                <p className="hero-subtitle">
                    Learn by solving real GitHub issues with AI mentorship
                </p>

                <div className="cta-buttons">
                    <button className="btn btn-primary">Get Started</button>
                    <a href="#how-it-works" className="btn btn-secondary" onClick={scrollToSection}>Learn More</a>
                </div>
            </main>

            {/* How It Works Section */}
            <section id="how-it-works" className="how-it-works-section" ref={sectionRef}>
                <div className="how-container">
                    <div className="section-header">
                        <span className="section-badge">💡 How It Works</span>
                        <h2 className="section-title">Learn from Real Projects</h2>
                        <p className="section-description">
                            Our platform connects you with real GitHub issues and provides AI-powered mentorship to guide you through solving them.
                        </p>
                    </div>

                    {/* Steps */}
                    <div className="steps-grid" ref={stepsRef}>
                        <div className="step-card" style={{ animationDelay: '0.1s' }}>
                            <div className="step-number">1</div>
                            <h3 className="step-title">Browse Real Issues</h3>
                            <p className="step-description">
                                Explore curated GitHub issues from real open-source projects, filtered by difficulty and technology.
                            </p>
                        </div>
                        <div className="step-card" style={{ animationDelay: '0.2s' }}>
                            <div className="step-number">2</div>
                            <h3 className="step-title">Get AI Guidance</h3>
                            <p className="step-description">
                                Our AI mentor provides step-by-step guidance, code suggestions, and best practices as you work.
                            </p>
                        </div>
                        <div className="step-card" style={{ animationDelay: '0.3s' }}>
                            <div className="step-number">3</div>
                            <h3 className="step-title">Submit & Learn</h3>
                            <p className="step-description">
                                Test your solution, get instant feedback, and contribute to real projects with confidence.
                            </p>
                        </div>
                    </div>

                    {/* Comparison Table */}
                    <div className="comparison-section" ref={comparisonRef}>
                        <h3 className="comparison-title">What Makes Us Different</h3>
                        <div className="comparison-table-wrapper">
                            <table className="comparison-table">
                                <thead>
                                    <tr>
                                        <th className="feature-col">Feature</th>
                                        <th className="platform-col our-platform">Our Platform</th>
                                        <th className="platform-col">LeetCode</th>
                                        <th className="platform-col">GitHub</th>
                                        <th className="platform-col">Codecademy</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="feature-name">Real-world repos</td>
                                        <td className="check-cell our-platform"><CheckIcon /></td>
                                        <td className="x-cell"><XIcon /></td>
                                        <td className="check-cell"><CheckIcon /></td>
                                        <td className="x-cell"><XIcon /></td>
                                    </tr>
                                    <tr>
                                        <td className="feature-name">Zero setup</td>
                                        <td className="check-cell our-platform"><CheckIcon /></td>
                                        <td className="check-cell"><CheckIcon /></td>
                                        <td className="x-cell"><XIcon /></td>
                                        <td className="check-cell"><CheckIcon /></td>
                                    </tr>
                                    <tr>
                                        <td className="feature-name">Instant feedback</td>
                                        <td className="check-cell our-platform"><CheckIcon /></td>
                                        <td className="check-cell"><CheckIcon /></td>
                                        <td className="x-cell"><XIcon /></td>
                                        <td className="check-cell"><CheckIcon /></td>
                                    </tr>
                                    <tr>
                                        <td className="feature-name">AI mentorship</td>
                                        <td className="check-cell our-platform"><CheckIcon /></td>
                                        <td className="x-cell"><XIcon /></td>
                                        <td className="x-cell"><XIcon /></td>
                                        <td className="x-cell"><XIcon /></td>
                                    </tr>
                                    <tr>
                                        <td className="feature-name">Beginner-focused</td>
                                        <td className="check-cell our-platform"><CheckIcon /></td>
                                        <td className="x-cell"><XIcon /></td>
                                        <td className="x-cell"><XIcon /></td>
                                        <td className="check-cell"><CheckIcon /></td>
                                    </tr>
                                    <tr>
                                        <td className="feature-name">Open source tasks</td>
                                        <td className="check-cell our-platform"><CheckIcon /></td>
                                        <td className="x-cell"><XIcon /></td>
                                        <td className="check-cell"><CheckIcon /></td>
                                        <td className="x-cell"><XIcon /></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="unique-value">
                            <p>
                                <strong>Unique Value:</strong> "The only platform that combines real open-source contributions with beginner-friendly AI guidance and zero setup friction."
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
