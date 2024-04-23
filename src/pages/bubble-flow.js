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
    console.log("New bubbles:", newBubbles);
    return newBubbles;
  };

  const drawBubble = (ctx, bubble) => {
    if (!ctx) return;
    const { x, y, radius, color } = bubble;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = `rgba(255, 0, 0, ${Math.min(1, 0.5 / (bubble.dx * bubble.dx + bubble.dy * bubble.dy + 0.01))})`;
    ctx.stroke();
  };

  const updateBubbles = (currentBubbles) => {
    const updatedBubbles = currentBubbles.map((bubble) => {
      let { x, y, radius, dx, dy } = bubble;

      // Apply boundary conditions
      if (x + radius > canvasRef.current.width || x - radius < 0) {
        dx = -dx * 0.8; // Add damping on boundary hit
      }
      if (y + radius > canvasRef.current.height || y - radius < 0) {
        dy = -dy * 0.8; // Add damping on boundary hit
      }

      // Update positions with possibly adjusted velocities
      x += dx;
      y += dy;

      return { ...bubble, x, y, dx, dy };
    });
    return updatedBubbles;
  };

  const [explosionCenter, setExplosionCenter] = useState({ x: 0, y: 0 }); // 添加爆炸中心的状态

  const handlePointerDown = useCallback(
    debounce((event) => {
      if (isClient && ctx) {
        const x = event.clientX || event.touches[0].clientX;
        const y = event.clientY || event.touches[0].clientY;
        setExplosionCenter({ x, y }); // 更新爆炸中心的位置
        setExplosion({ x, y, radius: 1, visible: true }); // 设置爆炸状态
        console.log("Explosion center:", x, y);
      }
    }, 100),
    [isClient, ctx]
  );

  useEffect(() => {
    if (!explosionCenter) return;
    setBubbles((prevBubbles) =>
      prevBubbles.map((bubble) => {
        const dx = bubble.x - explosionCenter.x;
        const dy = bubble.y - explosionCenter.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const influence = Math.max(0, 1 - distance / 500); // 调整影响范围，使其不至于太大
        const force = 0.05; // 可以适当减小力的大小以防止气泡速度过快
        // 根据爆炸影响调整速度
        const velocityX = bubble.dx + force * dx * influence;
        const velocityY = bubble.dy + force * dy * influence;
        // 确保速度更新不会导致气泡立即消失
        return { ...bubble, dx: velocityX, dy: velocityY };
      })
    );
  }, [explosionCenter]);

  useEffect(() => {
    const animate = () => {
      if (!ctx) return;
      const canvas = canvasRef.current; // Always use canvasRef.current to access the canvas element
      if (!canvas) return; // Check if canvas is actually defined

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let localBubbles = updateBubbles(bubbles); // Assuming bubbles is updated elsewhere and passed here
      localBubbles.forEach((bubble) => {
        drawBubble(ctx, bubble);
      });

      if (explosion.visible) {
        ctx.beginPath();
        ctx.arc(explosion.x, explosion.y, explosion.radius, 0, 2 * Math.PI);
        ctx.fillStyle = `rgba(255, 165, 0, ${Math.max(0, 1 - explosion.radius / 200)})`; // Orange, semi-transparent
        ctx.fill();
        explosion.radius += 2; // Increment radius
        if (explosion.radius > 200) {
          setExplosion({ ...explosion, visible: false });
        }
      }

      const nextAnimationId = requestAnimationFrame(animate);
      setAnimationId(nextAnimationId);
    };

    const animationId = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(animationId);
    };
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

    let localBubbles = initBubbles(canvas);
    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      localBubbles = updateBubbles(localBubbles);
      localBubbles.forEach((bubble) => {
        drawBubble(ctx, bubble);
      });
      const nextAnimationId = requestAnimationFrame(animate);
      setAnimationId(nextAnimationId);
    };
    const animationId = requestAnimationFrame(animate);

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      localBubbles = initBubbles(canvas);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, [isClient, ctx]);

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
