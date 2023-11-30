// import '../styles/global.css';

// export default function App({ Component, pageProps }) {
//   return <Component {...pageProps} />;
// }

import type { AppProps } from 'next/app'
import React from 'react'
 
export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
