import React, { useRef, useEffect, useState, useCallback } from "react";
import Link from "next/link";

function DynamicArtCanvas() {
  const canvasRef = useRef(null);
  const [bubbles, setBubbles] = useState([]);
  const [ctx, setCtx] = useState(null);
  const [animationId, setAnimationId] = useState(null);
  const isClient = typeof window !== "undefined";

  const updateBubblesByPointer = useCallback((x, y) => {
    setBubbles((prevBubbles) =>
      prevBubbles.map((bubble) => {
        const dx = x - bubble.x;
        const dy = y - bubble.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        // 增加影响力的范围和系数
        const influence = Math.max(0, 1 - distance / 500); // 增加最大影响距离
        return {
          ...bubble,
          dx: bubble.dx + dx * influence * 1, // 增加影响系数
          dy: bubble.dy + dy * influence * 1,
        };
      })
    );
  }, []);

  const handleMouseMove = useCallback(
    (event) => {
      if (isClient && ctx) {
        updateBubblesByPointer(event.clientX, event.clientY);
      }
    },
    [isClient, updateBubblesByPointer, ctx]
  );

  const handleTouchMove = useCallback(
    (event) => {
      if (isClient && event.touches.length > 0 && ctx) {
        updateBubblesByPointer(event.touches[0].clientX, event.touches[0].clientY);
      }
    },
    [isClient, updateBubblesByPointer, ctx]
  );

  useEffect(() => {
    if (!isClient || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (!context) return; // Ensure the context is not null
    setCtx(context);

    // Set the canvas dimensions to match the window size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let localBubbles = initBubbles(canvas);
    const animate = () => {
      if (!ctx) return; // Check ctx is not null
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      localBubbles = updateBubbles(localBubbles);
      localBubbles.forEach((bubble) => {
        drawBubble(ctx, bubble); // Pass ctx as an argument
      });
      const nextAnimationId = requestAnimationFrame(animate);
      setAnimationId(nextAnimationId);
    };
    const animationId = requestAnimationFrame(animate);
    setAnimationId(animationId);

    // Handle window resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      localBubbles = initBubbles(canvas); // Reset bubbles on resize
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, [isClient, ctx]); // Add ctx to the dependency array

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
    // 添加边框以突出显示影响
    ctx.strokeStyle = "rgba(255, 255, 255, 0.5)"; // 白色半透明边框
    ctx.stroke();
    console.log("Bubble drawn:", bubble);
  };

  const updateBubbles = (currentBubbles) => {
    console.log("Updating bubbles:", currentBubbles);
    const updatedBubbles = currentBubbles.map((bubble) => {
      let { x, y, radius, dx, dy } = bubble;
      if (x + radius > canvasRef.current.width || x - radius < 0) {
        dx = -dx;
      }
      if (y + radius > canvasRef.current.height || y - radius < 0) {
        dy = -dy;
      }
      x += dx;
      y += dy;
      return { ...bubble, x, y, dx, dy };
    });
    console.log("Updated bubbles:", updatedBubbles);
    return updatedBubbles;
  };

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
