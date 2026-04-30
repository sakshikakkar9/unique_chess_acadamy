import React, { useEffect, useRef } from 'react';

const SparkleCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    };

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      baseOpacity: number;
      opacity: number;
      freq: number;
      offset: number;
      isStar: boolean;
      sparkle: boolean;
      colorBase: string;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;

        this.isStar = Math.random() > 0.8;
        if (this.isStar) {
          this.size = Math.random() * 3 + 3; // 3-6px
        } else {
          this.size = Math.random() * 1.5 + 0.5; // 0.5-2px
        }

        this.speedX = (Math.random() - 0.5) * 0.3; // ±0.15px/frame
        this.speedY = (Math.random() - 0.5) * 0.3;

        this.baseOpacity = Math.random() * 0.6 + 0.2; // 0.2-0.8
        this.opacity = this.baseOpacity;
        this.freq = Math.random() * 0.05 + 0.02;
        this.offset = Math.random() * Math.PI * 2;
        this.sparkle = Math.random() > 0.7; // 30% sparkle

        const r = Math.random();
        if (r < 0.6) {
          this.colorBase = '56, 189, 248'; // sky-blue
        } else if (r < 0.85) {
          this.colorBase = '251, 191, 36'; // golden
        } else {
          this.colorBase = '255, 255, 255'; // white
        }
      }

      update(time: number) {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width) this.x = 0;
        else if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        else if (this.y < 0) this.y = canvas.height;

        if (this.sparkle) {
          this.opacity = this.baseOpacity * (0.5 + 0.5 * Math.sin(time * this.freq + this.offset));
        }
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = `rgba(${this.colorBase}, ${this.opacity})`;
        ctx.strokeStyle = `rgba(${this.colorBase}, ${this.opacity})`;
        ctx.lineWidth = 1;

        if (this.isStar) {
          ctx.beginPath();
          ctx.moveTo(this.x - this.size / 2, this.y);
          ctx.lineTo(this.x + this.size / 2, this.y);
          ctx.moveTo(this.x, this.y - this.size / 2);
          ctx.lineTo(this.x, this.y + this.size / 2);
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    const init = () => {
      particles = [];
      const count = Math.floor(Math.random() * 60) + 120; // 120-180
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
    };

    const drawLines = () => {
      if (!ctx) return;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(56, 189, 248, ${0.06 * (1 - distance / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };

    let time = 0;
    const animate = () => {
      time++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.update(time);
        p.draw();
      });
      drawLines();
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    resize();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
    />
  );
};

export default React.memo(SparkleCanvas);
