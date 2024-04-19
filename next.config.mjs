/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    images: {
      unoptimized: true  // 禁用图片优化
    }
  };
  
  export default nextConfig;
  