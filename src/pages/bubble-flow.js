import React, { useRef, useEffect, useState, useCallback } from "react";
import Link from "next/link";

function DynamicArtCanvas() {
  const canvasRef = useRef(null);
  const [bubbles, setBubbles] = useState([]);
  const [ctx, setCtx] = useState(null);
  const isClient = typeof window !== "undefined"; // 检查是否在客户端环境

  // Update bubbles by pointer (mouse/touch)
  const updateBubblesByPointer = useCallback((x, y) => {
    setBubbles((prevBubbles) =>
      prevBubbles.map((bubble) => {
        const dx = x - bubble.x;
        const dy = y - bubble.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const influence = Math.max(0, 1 - distance / 200);
        return {
          ...bubble,
          dx: bubble.dx + dx * influence * 0.001,
          dy: bubble.dy + dy * influence * 0.001,
        };
      })
    );
  }, []);

  const handleMouseMove = useCallback(
    (event) => {
      if (isClient) {
        updateBubblesByPointer(event.clientX, event.clientY);
      }
    },
    [isClient, updateBubblesByPointer]
  );

  const handleTouchMove = useCallback(
    (event) => {
      if (isClient && event.touches.length > 0) {
        updateBubblesByPointer(event.touches[0].clientX, event.touches[0].clientY);
      }
    },
    [isClient, updateBubblesByPointer]
  );

  useEffect(() => {
    if (!isClient) return; // 如果不在客户端环境，则直接返回
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    setCtx(ctx);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // Initialize bubbles
    initBubbles(canvas);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Use the updated bubbles from the updateBubbles function
      const updatedBubbles = updateBubbles(bubbles);
      updatedBubbles.forEach(drawBubble);
      // Update the state with the new bubbles
      setBubbles(updatedBubbles);
      requestAnimationFrame(animate);
    };

    // Start animation loop after ctx is set and bubbles are initialized
    animate();

    console.log("Initial bubbles:", bubbles);
    console.log("Initial ctx:", ctx);

    // Event listeners
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("touchmove", handleTouchMove);

    // Clean up
    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("touchmove", handleTouchMove);
    };
    console.log("Initial bubbles:", bubbles);
  }, [handleMouseMove, handleTouchMove, isClient]);

  const handleClearCanvas = () => {
    if (!isClient) return; // 如果不在客户端环境，则直接返回

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    initBubbles(canvas, true); // Reset bubbles
  };

  // Initialize bubbles
  const initBubbles = (canvas, reset = false) => {
    const newBubbles = reset
      ? bubbles.map((bubble) => ({
          ...bubble,
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          dx: (Math.random() * 40 - 20) * 0.1,
          dy: (Math.random() * 40 - 20) * 0.1,
        }))
      : [];
    for (let i = 0; i < 20; i++) {
      newBubbles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        color: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.8)`,
        radius: Math.random() * 20 + 10,
        dx: (Math.random() * 40 - 20) * 0.1,
        dy: (Math.random() * 40 - 20) * 0.1,
      });
    }
    setBubbles(newBubbles);
  };

  // Draw bubble
  const drawBubble = (bubble) => {
    console.log("Drawing bubble:", bubble);
    const { x, y, radius, color } = bubble;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
  };

  // Update bubble position
  const updateBubbles = (currentBubbles) => {
    return currentBubbles.map((bubble) => {
      let { x, y, radius, dx, dy } = bubble;
      // Bounce on edges
      if (x + radius > canvasRef.current.width || x - radius < 0) {
        dx = -dx;
      }
      if (y + radius > canvasRef.current.height || y - radius < 0) {
        dy = -dy;
      }
      // Update position
      x += dx;
      y += dy;
      return { ...bubble, x, y, dx, dy };
    });
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
      <div
        style={{
          position: "fixed",
          top: 20,
          right: 20,
          width: 50,
          height: 50,
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
        }}
        onClick={handleClearCanvas}
        onTouchStart={handleClearCanvas}
      >
        Clear
      </div>
      <Link href="/" style={{ position: "fixed", top: 20, left: 20, color: "black", fontSize: "20px" }}>
        Home
      </Link>
    </>
  );
}

export default DynamicArtCanvas;
