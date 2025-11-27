// @ts-nocheck
import { useEffect, useRef } from 'react';
import './LiquidEther.css';

export default function LiquidEther() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = window.innerWidth;
        let height = window.innerHeight;

        const resizeCanvas = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Configuration
        const gridSize = 40;
        const mouseRadius = 150;

        // Code particles
        const particles: Array<{
            x: number;
            y: number;
            vx: number;
            vy: number;
            text: string;
            size: number;
            opacity: number;
        }> = [];

        const codeSnippets = [
            'const', 'let', 'var', 'function', 'return',
            'if', 'else', 'for', 'while', 'switch',
            'import', 'export', 'from', 'class', 'interface',
            '{ }', '[ ]', '( )', '=>', '===', '!=',
            '&&', '||', '!', '?', ':',
            '</>', 'npm', 'git', 'docker'
        ];

        // Initialize particles - responsive count
        const particleCount = Math.min(30, Math.floor((width * height) / 25000));

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                text: codeSnippets[Math.floor(Math.random() * codeSnippets.length)],
                size: Math.random() * 10 + 10, // 10px to 20px
                opacity: Math.random() * 0.5 + 0.1
            });
        }

        let mouseX = -1000;
        let mouseY = -1000;

        const handleMouseMove = (e: MouseEvent) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        };
        window.addEventListener('mousemove', handleMouseMove);

        let time = 0;

        const animate = () => {
            time += 0.02;
            ctx.clearRect(0, 0, width, height);

            // 1. Draw Grid
            ctx.fillStyle = '#64C8FF'; // Cyan

            for (let x = 0; x <= width; x += gridSize) {
                for (let y = 0; y <= height; y += gridSize) {
                    // Calculate distance to mouse
                    const dx = mouseX - x;
                    const dy = mouseY - y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    // Base opacity varies with time for "breathing" effect
                    let alpha = (Math.sin(time + x * 0.01 + y * 0.01) + 1) * 0.05;

                    // Mouse spotlight
                    if (dist < mouseRadius) {
                        alpha += (1 - dist / mouseRadius) * 0.4;
                    }

                    if (alpha > 0) {
                        ctx.globalAlpha = alpha;
                        ctx.fillRect(x - 1, y - 1, 2, 2); // Draw small square dot
                    }
                }
            }

            // 2. Draw Particles
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            particles.forEach(p => {
                // Move
                p.x += p.vx;
                p.y += p.vy;

                // Wrap
                if (p.x < -50) p.x = width + 50;
                if (p.x > width + 50) p.x = -50;
                if (p.y < -50) p.y = height + 50;
                if (p.y > height + 50) p.y = -50;

                // Draw
                ctx.font = `${p.size}px "Fira Code", "Courier New", monospace`;
                ctx.fillStyle = '#ffffff';
                ctx.globalAlpha = p.opacity * 0.3; // Subtle
                ctx.fillText(p.text, p.x, p.y);
            });

            // 3. Draw Mouse Connections (Tech Lines)
            if (mouseX > 0 && mouseY > 0) {
                ctx.strokeStyle = '#64C8FF';
                ctx.lineWidth = 0.5;

                // Connect mouse to nearby grid points
                const snapX = Math.round(mouseX / gridSize) * gridSize;
                const snapY = Math.round(mouseY / gridSize) * gridSize;

                // Draw crosshair at nearest grid point
                ctx.globalAlpha = 0.3;
                ctx.beginPath();
                ctx.moveTo(snapX - 10, snapY);
                ctx.lineTo(snapX + 10, snapY);
                ctx.moveTo(snapX, snapY - 10);
                ctx.lineTo(snapX, snapY + 10);
                ctx.stroke();

                // Connect mouse to particles
                particles.forEach(p => {
                    const dx = mouseX - p.x;
                    const dy = mouseY - p.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 150) {
                        ctx.globalAlpha = (1 - dist / 150) * 0.2;
                        ctx.beginPath();
                        ctx.moveTo(mouseX, mouseY);
                        ctx.lineTo(p.x, p.y);
                        ctx.stroke();
                    }
                });
            }

            requestAnimationFrame(animate);
        };

        const animationId = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationId);
        };
    }, []);

    return <canvas ref={canvasRef} className="liquid-ether-canvas" />;
}
