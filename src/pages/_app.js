import { useEffect } from 'react'
import '../styles/globals.css'
import "prismjs/themes/prism-okaidia.css";
import "prismjs/plugins/line-numbers/prism-line-numbers.css";

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    const darkMode = localStorage.getItem('darkMode') === 'true'
    document.documentElement.classList.toggle('dark', darkMode)
  }, [])

  return <Component {...pageProps} />
}

export default MyApp