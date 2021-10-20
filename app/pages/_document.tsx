import Document, { Html, Head, Main, NextScript } from 'next/document'

class SolohaDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <meta name="description" content="Make saying gm a little more meaningful" />
          <link rel="icon" href="/favicon.ico" />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Nunito&display=swap"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default SolohaDocument
