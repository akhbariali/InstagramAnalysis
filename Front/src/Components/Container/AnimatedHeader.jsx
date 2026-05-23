import React, { useEffect, useRef } from 'react';
import './AnimatedHeader.css';

const AnimatedHeader = ({ children }) => {
    const canvasRef = useRef(null);
    const headerRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const headerSection = headerRef.current;
        const ctx = canvas.getContext('2d');
        let dots = [];
        let animationFrameId;
        const maxLineDistance = 150, minLineDistance = 50;
        let mouseDot = null, isMouseOverCanvas = false;

        class Dot {
            constructor(x, y, vx, vy, radius) { this.x = x; this.y = y; this.vx = vx; this.vy = vy; this.radius = radius; }
            update() { this.x += this.vx; this.y += this.vy; if (this.x + this.radius > canvas.width || this.x - this.radius < 0) this.vx *= -1; if (this.y + this.radius > canvas.height || this.y - this.radius < 0) this.vy *= -1; }
            draw() { ctx.beginPath(); ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2); ctx.fillStyle = 'white'; ctx.fill(); }
        }
        const setCanvasSize = () => { canvas.width = headerSection.offsetWidth; canvas.height = headerSection.offsetHeight; };
        const initDots = () => { dots = []; const minDots = 10, maxDots = 100, minWidth = 320, maxWidth = 1920; let numDots = minDots + (maxDots - minDots) * ((window.innerWidth - minWidth) / (maxWidth - minWidth)); numDots = Math.max(minDots, Math.min(maxDots, Math.round(numDots))); for (let i = 0; i < numDots; i++) { dots.push(new Dot(Math.random() * canvas.width, Math.random() * canvas.height, (Math.random() - 0.5) * 1, (Math.random() - 0.5) * 1, Math.random() * 1.5 + 1)); } };
        const getTransparency = (d) => { if (d <= minLineDistance) return 1; if (d >= maxLineDistance) return 0; return 1 - ((d - minLineDistance) / (maxLineDistance - minLineDistance)); };
        const animate = () => { ctx.clearRect(0, 0, canvas.width, canvas.height); dots.forEach(dot => { dot.update(); dot.draw(); }); if (isMouseOverCanvas && mouseDot) mouseDot.draw(); const allDots = isMouseOverCanvas && mouseDot ? [...dots, mouseDot] : dots; for (let i = 0; i < allDots.length; i++) { for (let j = i + 1; j < allDots.length; j++) { const d1 = allDots[i], d2 = allDots[j]; const dist = Math.sqrt(Math.pow(d1.x - d2.x, 2) + Math.pow(d1.y - d2.y, 2)); const alpha = getTransparency(dist); if (alpha > 0) { ctx.beginPath(); ctx.moveTo(d1.x, d1.y); ctx.lineTo(d2.x, d2.y); ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`; ctx.lineWidth = 0.5; ctx.stroke(); } } } animationFrameId = requestAnimationFrame(animate); };
        const handleMouseMove = (e) => { const rect = canvas.getBoundingClientRect(); if (!mouseDot) mouseDot = new Dot(e.clientX - rect.left, e.clientY - rect.top, 0, 0, 3); mouseDot.x = e.clientX - rect.left; mouseDot.y = e.clientY - rect.top; };
        const handleMouseEnter = () => isMouseOverCanvas = true;
        const handleMouseLeave = () => { isMouseOverCanvas = false; mouseDot = null; };
        const handleClick = (e) => { const rect = headerSection.getBoundingClientRect(); const clickX = e.clientX - rect.left, clickY = e.clientY - rect.top; for (let i = 0; i < 4; i++) { dots.push(new Dot(clickX + (Math.random() - 0.5) * 20, clickY + (Math.random() - 0.5) * 20, (Math.random() - 0.5) * 1.5, (Math.random() - 0.5) * 1.5, Math.random() * 1.5 + 1)); } };
        const handleResize = () => { setCanvasSize(); initDots(); };

        setCanvasSize(); initDots(); animate();
        window.addEventListener('resize', handleResize);
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseenter', handleMouseEnter);
        canvas.addEventListener('mouseleave', handleMouseLeave);
        headerSection.addEventListener('click', handleClick);

        return () => {
            window.removeEventListener('resize', handleResize);
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('mouseenter', handleMouseEnter);
            canvas.removeEventListener('mouseleave', handleMouseLeave);
            headerSection.removeEventListener('click', handleClick);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className="header-section" ref={headerRef}>
            <canvas id="dotsCanvas" ref={canvasRef}></canvas>
            <div className="content-container">
                {children}
            </div>
        </div>
    );
};

export default AnimatedHeader;