// pages/index.js
import Link from 'next/link';

export default function Home() {
  return (
    <div className="container">
      <div className="hero">
        <video autoPlay muted loop className="background-video">
          <source src="/videos/art-background.mp4" type="video/mp4" />
        </video>
        <h1 className="title">Art Gallery</h1>
      </div>
      <div className="gallery">
        <Link href="/dynamic-art-canvas" style={{ textDecoration: 'none' }}>
          <div className="card">
            <img src="/images/dynamic-art-canvas.jpg" alt="Dynamic Art Canvas" />
            <h2>Dynamic Art Canvas</h2>
          </div>
        </Link>
        {/* Additional cards can be added here */}
      </div>
    </div>
  );
}
