import React, { useEffect, useRef } from 'react';

interface NeuralNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  pulsePhase: number;
  color: string;
  connections: number[];
}

interface SynapseSignal {
  fromIndex: number;
  toIndex: number;
  progress: number;
  speed: number;
  color: string;
}

export const NeuralBrainCanvas: React.FC<{ className?: string }> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 600);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
      initBrainNodes();
    };

    window.addEventListener('resize', handleResize);

    const colors = [
      '#06b6d4', // Cyan
      '#14b8a6', // Teal
      '#38bdf8', // Sky
      '#818cf8', // Indigo
      '#10b981', // Emerald
    ];

    let nodes: NeuralNode[] = [];
    let signals: SynapseSignal[] = [];

    // Mouse interactive coordinates
    const mouse = { x: -1000, y: -1000, active: false };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.x = -1000;
      mouse.y = -1000;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    const initBrainNodes = () => {
      nodes = [];
      signals = [];

      // Create 65-80 nodes distributed in a dual-hemisphere brain-like oval cloud
      const nodeCount = Math.min(85, Math.max(45, Math.floor((width * height) / 10000)));
      const centerX = width * 0.5;
      const centerY = height * 0.48;
      const rx = Math.min(width * 0.38, 360);
      const ry = Math.min(height * 0.36, 220);

      for (let i = 0; i < nodeCount; i++) {
        // Distribute in two lobes (left and right hemisphere)
        const isLeftHemisphere = i % 2 === 0;
        const hemisphereOffset = isLeftHemisphere ? -rx * 0.28 : rx * 0.28;
        
        // Parametric elliptical distribution with random jitter
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.pow(Math.random(), 0.65); // denser towards core
        
        const baseX = centerX + hemisphereOffset + Math.cos(angle) * (rx * 0.65) * dist;
        const baseY = centerY + Math.sin(angle) * ry * dist;

        const baseRadius = 1.8 + Math.random() * 2.2;

        nodes.push({
          x: baseX,
          y: baseY,
          vx: (Math.random() - 0.5) * 0.45,
          vy: (Math.random() - 0.5) * 0.45,
          radius: baseRadius,
          baseRadius,
          pulsePhase: Math.random() * Math.PI * 2,
          color: colors[Math.floor(Math.random() * colors.length)],
          connections: [],
        });
      }

      // Pre-compute nearest synaptic connections
      for (let i = 0; i < nodes.length; i++) {
        const distances: { index: number; dist: number }[] = [];
        for (let j = 0; j < nodes.length; j++) {
          if (i === j) continue;
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            distances.push({ index: j, dist });
          }
        }
        distances.sort((a, b) => a.dist - b.dist);
        nodes[i].connections = distances.slice(0, 4).map(d => d.index);
      }
    };

    initBrainNodes();

    // Render loop
    let lastTime = performance.now();

    const render = (time: number) => {
      const dt = Math.min(50, time - lastTime);
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      // 1. Update and draw neural nodes
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        node.pulsePhase += 0.035;
        node.radius = node.baseRadius + Math.sin(node.pulsePhase) * 0.9;

        // Drift motion
        node.x += node.vx;
        node.y += node.vy;

        // Soft rebound
        const padding = 20;
        if (node.x < padding || node.x > width - padding) node.vx *= -1;
        if (node.y < padding || node.y > height - padding) node.vy *= -1;

        // Mouse attraction/repulsion
        if (mouse.active) {
          const mdx = node.x - mouse.x;
          const mdy = node.y - mouse.y;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mdist < 140 && mdist > 5) {
            const force = (140 - mdist) / 140;
            node.x += (mdx / mdist) * force * 1.5;
            node.y += (mdy / mdist) * force * 1.5;
          }
        }
      }

      // 2. Draw synaptic neural connection lines
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        for (const targetIdx of node.connections) {
          if (targetIdx > i) {
            const target = nodes[targetIdx];
            const dx = target.x - node.x;
            const dy = target.y - node.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 140) {
              const alpha = (1 - dist / 140) * 0.32;
              
              // Gradient between node colors
              const grad = ctx.createLinearGradient(node.x, node.y, target.x, target.y);
              grad.addColorStop(0, `${node.color}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`);
              grad.addColorStop(1, `${target.color}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`);

              ctx.beginPath();
              ctx.moveTo(node.x, node.y);
              ctx.lineTo(target.x, target.y);
              ctx.strokeStyle = grad;
              ctx.lineWidth = 1;
              ctx.stroke();

              // Randomly spawn a synaptic action potential packet
              if (Math.random() < 0.003 && signals.length < 25) {
                signals.push({
                  fromIndex: i,
                  toIndex: targetIdx,
                  progress: 0,
                  speed: 0.015 + Math.random() * 0.02,
                  color: node.color,
                });
              }
            }
          }
        }
      }

      // 3. Update & render traveling neural synaptic signals
      for (let s = signals.length - 1; s >= 0; s--) {
        const sig = signals[s];
        sig.progress += sig.speed;

        if (sig.progress >= 1) {
          signals.splice(s, 1);
          continue;
        }

        const from = nodes[sig.fromIndex];
        const to = nodes[sig.toIndex];
        if (!from || !to) {
          signals.splice(s, 1);
          continue;
        }

        const curX = from.x + (to.x - from.x) * sig.progress;
        const curY = from.y + (to.y - from.y) * sig.progress;

        // Firing electric neural spark
        ctx.beginPath();
        ctx.arc(curX, curY, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = sig.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      }

      // 4. Draw neural cell bodies (nodes) with soft glowing aura
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        // Outer glow
        const glowRad = node.radius * 3.5;
        const radialGrad = ctx.createRadialGradient(node.x, node.y, node.radius * 0.5, node.x, node.y, glowRad);
        radialGrad.addColorStop(0, `${node.color}55`);
        radialGrad.addColorStop(1, `${node.color}00`);

        ctx.beginPath();
        ctx.arc(node.x, node.y, glowRad, 0, Math.PI * 2);
        ctx.fillStyle = radialGrad;
        ctx.fill();

        // Core nucleus
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-auto ${className}`}
      style={{ width: '100%', height: '100%' }}
    />
  );
};
