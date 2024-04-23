import React, { useRef, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import debounce from "lodash.debounce";

function DynamicArtCanvas() {
  const canvasRef = useRef(null);
  const [bubbles, setBubbles] = useState([]);
  const [ctx, setCtx] = useState(null);
  const [animationId, setAnimationId] = useState(null);
  const [explosion, setExplosion] = useState({ x: 0, y: 0, radius: 0, visible: false });
  const isClient = typeof window !== "undefined";

  const initBubbles = (canvas) => {
    let newBubbles = [];
    for (let i = 0; i < 20; i++) {
      const newBubble = {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        color: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.8)`,
        radius: Math.random() * 20 + 10,
        dx: (Math.random() * 40 - 20) * 0.1,
        dy: (Math.random() * 40 - 20) * 0.1,
      };
      newBubbles.push(newBubble);
    }
    return newBubbles;
  };

  const drawBubble = (ctx, bubble) => {
    if (!ctx) return;
    const { x, y, radius, color } = bubble;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
  };

  const updateBubbles = (currentBubbles) => {
    return currentBubbles.map((bubble) => {
      let { x, y, radius, dx, dy } = bubble;
      x += dx * 2;
      y += dy * 2;
      if (x + radius > canvasRef.current.width || x - radius < 0) {
        x = Math.max(radius, Math.min(x, canvasRef.current.width - radius));
        dx = -dx;
      }
      if (y + radius > canvasRef.current.height || y - radius < 0) {
        y = Math.max(radius, Math.min(y, canvasRef.current.height - radius));
        dy = -dy;
      }
      return { ...bubble, x, y, dx, dy };
    });
  };

  const handlePointerDown = useCallback(
    debounce((event) => {
      if (isClient && ctx && canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        const x = (event.clientX || event.touches[0].clientX) - rect.left;
        const y = (event.clientY || event.touches[0].clientY) - rect.top;
        setExplosion({ x, y, radius: 1, visible: true });

        // Update bubble velocities only for bubbles within a certain radius
        const explosionRadius = 100; // adjust this value to control the explosion radius
        setBubbles(
          bubbles.map((bubble) => {
            const dx = bubble.x - x;
            const dy = bubble.y - y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < explosionRadius) {
              const acceleration = 0.1; // adjust this value to control the explosion force
              const velocityMultiplier = 1 + acceleration * (1 - distance / explosionRadius);
              const explosionVelocityX = (dx / distance) * velocityMultiplier;
              const explosionVelocityY = (dy / distance) * velocityMultiplier;
              return {
                ...bubble,
                dx: bubble.dx + explosionVelocityX,
                dy: bubble.dy + explosionVelocityY,
              };
            } else {
              return bubble; // don't update velocity if bubble is outside explosion radius
            }
          })
        );
      }
    }, 100),
    [isClient, ctx]
  );

  useEffect(() => {
    const animate = () => {
      if (!ctx || !canvasRef.current) return;
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      const updatedBubbles = updateBubbles(bubbles);
      setBubbles(updatedBubbles);
      updatedBubbles.forEach((bubble) => drawBubble(ctx, bubble));
      if (explosion.visible) {
        ctx.beginPath();
        ctx.arc(explosion.x, explosion.y, explosion.radius, 0, 2 * Math.PI);
        ctx.fillStyle = `rgba(255, 165, 0, ${Math.max(0, 0.5 - explosion.radius / 200)})`;
        ctx.fill();
        explosion.radius += 10;
        if (explosion.radius > 200) {
          setExplosion({ ...explosion, visible: false });
        }
      }
      const nextAnimationId = requestAnimationFrame(animate);
      setAnimationId(nextAnimationId);
    };
    const animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [ctx, explosion]);

  useEffect(() => {
    if (!isClient || !canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.addEventListener("mousedown", handlePointerDown);
    canvas.addEventListener("touchstart", handlePointerDown);
    return () => {
      canvas.removeEventListener("mousedown", handlePointerDown);
      canvas.removeEventListener("touchstart", handlePointerDown);
    };
  }, [isClient, handlePointerDown]);

  useEffect(() => {
    if (!isClient || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (!context) return;
    setCtx(context);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    setBubbles(initBubbles(canvas));
  }, [isClient]);

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
          background: "linear-gradient(180deg, rgba(255, 255, 255, 1) 0%, rgba(0, 0, 0, 1) 100%)",
        }}
      />
      <Link href="/" style={{ position: "fixed", top: 20, left: 20, color: "black", fontSize: "20px" }}>
        Home
      </Link>
    </>
  );
}

export default DynamicArtCanvas;
