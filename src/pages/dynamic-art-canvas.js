// src/pages/DynamicArtCanvas.js
import React, { useRef, useEffect } from "react";
import Link from "next/link";

function DynamicArtCanvas() {
  const canvasRef = useRef(null);
  let lastX = 0;
  let lastY = 0;
  let lastTime = Date.now();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    let size = 30; // 默认大小

    const drawShape = (x, y, size, color1, color2) => {
      if (color2) {
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
        gradient.addColorStop(0, color1);
        gradient.addColorStop(1, color2);
        ctx.fillStyle = gradient;
      } else {
        ctx.fillStyle = color1;
      }
      ctx.beginPath();
      ctx.arc(x, y, size, 0, 2 * Math.PI);
      ctx.fill();
    };

    // 处理鼠标移动
    const handleMouseMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const now = Date.now();
      const dt = now - lastTime;
      const dx = x - lastX;
      const dy = y - lastY;
      const speed = Math.sqrt(dx * dx + dy * dy) / dt;
      const dynamicSize = Math.max(10, speed * 60); // 根据速度调整大小

      const color1 = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
      drawShape(x, y, dynamicSize, color1, null);

      lastX = x;
      lastY = y;
      lastTime = now;
    };

    // 处理触摸移动
    const handleTouchMove = (event) => {
      event.preventDefault(); // 阻止滚动行为
      const touch = event.touches[0];
      const rect = canvas.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;

      const now = Date.now();
      const dt = now - lastTime;
      const dx = x - lastX;
      const dy = y - lastY;
      const speed = Math.sqrt(dx * dx + dy * dy) / dt;
      const dynamicSize = Math.max(10, speed * 60) / 2; // 根据速度调整大小并缩小一半

      const color1 = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
      drawShape(x, y, dynamicSize, color1, null);

      lastX = x;
      lastY = y;
      lastTime = now;
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("touchmove", handleTouchMove);

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{ display: "block", background: "linear-gradient(180deg, rgba(255, 255, 255, 1) 0%, rgba(0, 0, 0, 1) 100%)" }}
      ></canvas>
      <Link href="/" style={{ position: "fixed", top: 20, left: 20, color: "black", fontSize: "20px" }}>
        Home
      </Link>
    </>
  );
}

export default DynamicArtCanvas;
