import "../styles/globals.css"; 
import { useEffect } from "react";

export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
