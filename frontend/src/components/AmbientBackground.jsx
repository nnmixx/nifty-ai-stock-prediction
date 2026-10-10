import React, { useEffect, useRef } from 'react';

export default function AmbientBackground({ isReducedMotion = false, isDark = true }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Mouse coordinates for gentle parallax
    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;

    const handleMouseMove = (e) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Particle setup (fewer on mobile)
    const isMobile = width < 768;
    const particleCount = isReducedMotion ? 0 : (isMobile ? 25 : 55);
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 1.5 + 0.8,
        alpha: Math.random() * 0.4 + 0.1,
        color: i % 3 === 0 ? '#00E5FF' : (i % 3 === 1 ? '#00E676' : '#F5C542')
      });
    }

    // Floating glowing orbs (glow mesh)
    const orbs = [
      { x: width * 0.25, y: height * 0.3, r: 240, color: '#00E5FF', vx: 0.15, vy: 0.1 },
      { x: width * 0.75, y: height * 0.4, r: 280, color: '#00E676', vx: -0.12, vy: 0.14 },
      { x: width * 0.5, y: height * 0.75, r: 220, color: '#F5C542', vx: 0.1, vy: -0.12 },
    ];

    // Faint live stock chart line points
    const chartLinePoints = [];
    const segments = isMobile ? 30 : 60;
    let curY = height * 0.65;
    for (let i = 0; i <= segments; i++) {
      curY += (Math.random() - 0.48) * 16;
      curY = Math.max(height * 0.4, Math.min(height * 0.85, curY));
      chartLinePoints.push({
        baseX: (i / segments) * width,
        baseY: curY,
        offset: Math.random() * Math.PI * 2
      });
    }

    let time = 0;

    const render = () => {
      time += 0.015;

      // Smooth mouse parallax
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;
      const offsetX = (mouseX - width / 2) * 0.02;
      const offsetY = (mouseY - height / 2) * 0.02;

      ctx.clearRect(0, 0, width, height);

      // Base background
      ctx.fillStyle = isDark ? '#0B0F17' : '#F8FAFC';
      ctx.fillRect(0, 0, width, height);

      // 1. Draw subtle background grid
      const gridSize = 48;
      ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.018)' : 'rgba(0, 0, 0, 0.03)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x < width; x += gridSize) {
        ctx.moveTo(x + (offsetX * 0.5) % gridSize, 0);
        ctx.lineTo(x + (offsetX * 0.5) % gridSize, height);
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.moveTo(0, y + (offsetY * 0.5) % gridSize);
        ctx.lineTo(width, y + (offsetY * 0.5) % gridSize);
      }
      ctx.stroke();

      // 2. Draw glowing mesh orbs
      orbs.forEach((orb) => {
        if (!isReducedMotion) {
          orb.x += orb.vx;
          orb.y += orb.vy;
          if (orb.x < 0 || orb.x > width) orb.vx *= -1;
          if (orb.y < 0 || orb.y > height) orb.vy *= -1;
        }

        const orbX = orb.x + offsetX;
        const orbY = orb.y + offsetY;
        const gradient = ctx.createRadialGradient(orbX, orbY, 10, orbX, orbY, orb.r);
        gradient.addColorStop(0, orb.color + (isDark ? '14' : '0D')); // 8% opacity
        gradient.addColorStop(0.7, orb.color + '05');
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(orbX, orbY, orb.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // 3. Faint live stock-chart line moving softly across screen
      ctx.save();
      ctx.beginPath();
      for (let i = 0; i < chartLinePoints.length; i++) {
        const pt = chartLinePoints[i];
        const dynamicY = pt.baseY + (isReducedMotion ? 0 : Math.sin(time + pt.offset) * 8) + offsetY * 0.3;
        const dynamicX = pt.baseX + offsetX * 0.3;
        if (i === 0) ctx.moveTo(dynamicX, dynamicY);
        else ctx.lineTo(dynamicX, dynamicY);
      }
      ctx.strokeStyle = isDark ? 'rgba(0, 229, 255, 0.06)' : 'rgba(0, 150, 220, 0.08)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Draw faint gradient under the chart line
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      const lineFill = ctx.createLinearGradient(0, height * 0.5, 0, height);
      lineFill.addColorStop(0, isDark ? 'rgba(0, 229, 255, 0.02)' : 'rgba(0, 150, 220, 0.03)');
      lineFill.addColorStop(1, 'transparent');
      ctx.fillStyle = lineFill;
      ctx.fill();
      ctx.restore();

      // 4. Subtle particles
      if (!isReducedMotion) {
        particles.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;

          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.globalAlpha = 1;
      }

      if (!isReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [isReducedMotion, isDark]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ willChange: 'transform' }}
    />
  );
}
