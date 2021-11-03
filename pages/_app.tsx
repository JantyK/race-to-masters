import type { AppProps } from 'next/app'

import "../styles/App.css"

function RaceToMasters({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default RaceToMasters
