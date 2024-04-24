import React, { useRef, useEffect, useState, useCallback } from "react";
import Link from "next/link";

// 全局速度因子,可以调整这个值来控制小球的运动速度
const speedFactor = 0.3;

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
        dx: (Math.random() * 40 - 20) * speedFactor, // initial random velocity
        dy: (Math.random() * 40 - 20) * speedFactor, // initial random velocity
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

  const updateBubbles = useCallback(
    (currentBubbles) => {
      return currentBubbles.map((bubble) => {
        let { x, y, radius, dx, dy } = bubble;
        x += dx;
        y += dy;
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
    },
    [speedFactor]
  );

  const handlePointerDown = useCallback(
    (event) => {
      if (isClient && ctx && canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        const x = (event.clientX || event.touches[0].clientX) - rect.left;
        const y = (event.clientY || event.touches[0].clientY) - rect.top;

        // 计算从点击点到每个小球的方向向量
        setBubbles(
          bubbles.map((bubble) => {
            const dx = bubble.x - x;
            const dy = bubble.y - y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const velocityMultiplier = 10; // 调整这个值来控制爆炸力
            const explosionVelocityX = (dx / distance) * velocityMultiplier;
            const explosionVelocityY = (dy / distance) * velocityMultiplier;
            return {
              ...bubble,
              dx: bubble.dx + explosionVelocityX * speedFactor,
              dy: bubble.dy + explosionVelocityY * speedFactor,
            };
          })
        );

        setExplosion({ x, y, radius: 0, visible: true });
      }
    },
    [isClient, ctx, bubbles, speedFactor]
  );

  const animate = () => {
    if (!ctx || !canvasRef.current) return;
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    const updatedBubbles = updateBubbles(bubbles);
    setBubbles(updatedBubbles);
    updatedBubbles.forEach((bubble) => drawBubble(ctx, bubble));

    // 绘制爆炸效果
    if (explosion.visible) {
      ctx.beginPath();
      ctx.arc(explosion.x, explosion.y, explosion.radius, 0, 2 * Math.PI);
      ctx.fillStyle = `rgba(255, 165, 0, ${Math.max(0, 0.5 - explosion.radius / 1000)}`; // 修改这里,使半透明效果持续更长时间
      ctx.fill();
      explosion.radius += 2; // 修改这里,使半透明圆圈动画减慢5倍
      if (explosion.radius > 200) {
        setExplosion({ ...explosion, visible: false });
      }
    }

    const nextAnimationId = requestAnimationFrame(animate);
    setAnimationId(nextAnimationId);
  };

  useEffect(() => {
    animate();
    return () => cancelAnimationFrame(animationId);
  }, [ctx, explosion, updateBubbles]);

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
