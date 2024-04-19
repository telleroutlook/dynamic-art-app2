// src/pages/DynamicArtCanvas.js
import React, { useRef, useEffect } from 'react';
import Link from 'next/link';

function DynamicArtCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
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
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = color1;
      }
      ctx.beginPath();
      ctx.arc(x, y, size, 0, 2 * Math.PI);
      ctx.fill();
      ctx.globalAlpha = 1.0; // 恢复不透明度
    };

    // 处理触摸移动
    const handleTouchMove = (event) => {
      event.preventDefault(); // 阻止滚动行为
      const touch = event.touches[0];
      const rect = canvas.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      const dynamicSize = size; // 在移动端可能不需要根据速度调整大小
      const color1 = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
      drawShape(x, y, dynamicSize, color1, null); // 移动端不使用渐变色
    };

    // 处理鼠标移动
    const handleMouseMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const speed = Math.abs(event.movementX) + Math.abs(event.movementY);
      const dynamicSize = speed * 0.1 + 10;
      const color1 = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
      drawShape(x, y, dynamicSize, color1, null);
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('touchmove', handleTouchMove);

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{ display: 'block', background: 'linear-gradient(180deg, rgba(255, 255, 255, 1) 0%, rgba(0, 0, 0, 1) 100%)' }}
      ></canvas>
      <Link href="/" style={{ position: 'fixed', top: 20, left: 20, color: 'black', fontSize: '20px' }}>
        Home
      </Link>
    </>
  );
}

export default DynamicArtCanvas;
