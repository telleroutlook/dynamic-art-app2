// src/pages/dynamic-art-canvas.js

import React, { useRef, useEffect } from "react";
import Link from "next/link";

function DynamicArtCanvas() {
  const canvasRef = useRef(null);
  const lastXRef = useRef(0);
  const lastYRef = useRef(0);
  const lastTimeRef = useRef(Date.now());

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

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

    const handleMove = (x, y) => {
      const now = Date.now();
      const dt = now - lastTimeRef.current;
      const dx = x - lastXRef.current;
      const dy = y - lastYRef.current;
      const speed = Math.sqrt(dx * dx + dy * dy) / dt;
      const dynamicSize = Math.max(10, speed * 10);
      const color1 = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.6)`; // 设置透明度为0.6
      drawShape(x, y, dynamicSize, color1, null);
      lastXRef.current = x;
      lastYRef.current = y;
      lastTimeRef.current = now;
    };

    const handleMouseMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      handleMove(x, y);
    };

    const handleTouchMove = (event) => {
      event.preventDefault();
      const touch = event.touches[0];
      const rect = canvas.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      handleMove(x, y);
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("touchmove", handleTouchMove);

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  const handleClearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
          background: "linear-gradient(180deg, rgba(255, 255, 255, 1) 0%, rgba(0, 0, 0, 1) 100%)",
        }}
      ></canvas>
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
        onTouchStart={handleClearCanvas} // 添加移动设备上的清除操作
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
