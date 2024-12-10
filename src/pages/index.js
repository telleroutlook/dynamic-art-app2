import Link from 'next/link';
import Image from 'next/image';
import backgroundSvg from '../../public/images/background.svg';

export default function Home() {
  return (
    <div className="container" style={{
      backgroundImage: `url(${backgroundSvg.src})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      width: '100%',
      height: '100%',
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: -1,
    }}>
      <div className="background-overlay"></div>
      <div className="hero">
        <h1 className="title">Art Gallery</h1>
      </div>
      <div className="gallery">
        <div className="grid-container">
          <Link href="/dynamic-art-canvas" style={{ textDecoration: 'none' }}>
            <div className="grid-item">
              <Image
                src="/images/dynamic-art-canvas.jpg"
                alt="Dynamic Art Canvas"
                priority
                width={300}
                height={300}
              />
              <h2>Dynamic Art Canvas</h2>
            </div>
          </Link>
          <Link href="/bubble-flow" style={{ textDecoration: 'none' }}>
            <div className="grid-item">
              <Image
                src="/images/bubble-flow.jpg"
                alt="Bubble Flow"
                priority
                width={300}
                height={300}
              />
              <h2>Bubble Flow</h2>
            </div>
          </Link>
          <Link href="/puzzle" style={{ textDecoration: 'none' }}>
            <div className="grid-item">
              <Image
                src="/images/puzzle.jpg"
                alt="Number Puzzle"
                priority
                width={300}
                height={300}
              />
              <h2>Number Puzzle</h2>
            </div>
          </Link>
          {/* 在此处添加更多应用程序卡片 */}
        </div>
      </div>
    </div>
  );
}
