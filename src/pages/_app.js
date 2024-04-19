// src/pages/_app.js
import "../../public/css/style.css"; // Ensure the path is correctly set based on your directory structure

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
