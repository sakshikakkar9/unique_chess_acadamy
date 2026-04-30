import React, { useEffect, useRef } from 'react';

interface SparkleCanvasProps {
  density?: "full" | "subtle";
}

const SparkleCanvas: React.FC<SparkleCanvasProps> = ({ density = "full" }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
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

        this.isStar = Math.random() > 0.7;
        if (this.isStar) {
          this.size = Math.random() * 2 + 3; // 3-5px
        } else {
          this.size = Math.random() * 1 + 0.5; // 0.5-1.5px
        }

        this.speedX = (Math.random() - 0.5) * 0.24; // ±0.12px/frame
        this.speedY = (Math.random() - 0.5) * 0.24;

        this.baseOpacity = density === "full" ? Math.random() * 0.5 + 0.3 : Math.random() * 0.2 + 0.1;
        this.opacity = this.baseOpacity;
        this.freq = Math.random() * 0.02 + 0.005;
        this.offset = Math.random() * Math.PI * 2;
        this.sparkle = Math.random() > 0.75; // 25% sparkle

        const r = Math.random();
        if (r < 0.55) {
          this.colorBase = '14, 165, 233'; // sky blue
        } else if (r < 0.85) {
          this.colorBase = '217, 119, 6'; // golden
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
          // Oscillate between 0.15 and 0.85 of baseOpacity or fixed range?
          // Spec: opacity oscillates between 0.15 and 0.85 via sin wave
          this.opacity = 0.15 + 0.7 * (0.5 + 0.5 * Math.sin(time * this.freq + this.offset));
          if (density === "subtle") this.opacity *= 0.4;
        }
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = `rgba(${this.colorBase}, ${this.opacity})`;
        ctx.strokeStyle = `rgba(${this.colorBase}, ${this.opacity})`;
        ctx.lineWidth = 1;

        if (this.isStar) {
          // 4-point cross
          ctx.save();
          ctx.translate(this.x, this.y);
          // ctx.rotate(time * 0.01); // optional rotation
          ctx.beginPath();
          ctx.moveTo(-this.size / 2, 0);
          ctx.lineTo(this.size / 2, 0);
          ctx.moveTo(0, -this.size / 2);
          ctx.lineTo(0, this.size / 2);
          ctx.stroke();
          ctx.restore();
        } else {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    const init = () => {
      particles = [];
      const count = density === "full" ? 150 : 40;
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
    };

    const drawLines = () => {
      if (!ctx) return;
      const maxDist = 80;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDist) {
            ctx.beginPath();
            const alpha = 0.04 * (1 - distance / maxDist);
            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
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

    const resizeObserver = new ResizeObserver(() => resize());
    resizeObserver.observe(canvas);

    resize();
    animate();

    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, [density]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-[1]"
    />
  );
};

export default React.memo(SparkleCanvas);
