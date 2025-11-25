import LiquidEther from '../components/LiquidEther';
import '../App.css';

export default function Home() {
    return (
        <>
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

            {/* Hero Content */}
            <main className="hero-section">
                <h1 className="hero-title">
                    GAIN SOME REAL EXPERIENCE BRO
                </h1>

                <div className="cta-buttons">
                    <button className="btn btn-primary">Get Started</button>
                    <button className="btn btn-secondary">Learn More</button>
                </div>
            </main>
        </>
    );
}
