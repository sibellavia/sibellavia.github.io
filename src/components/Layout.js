import Head from "next/head";

export default function Layout({ children }) {
  return (
    <div className="px-6">
      <Head>
        <title>Simone Bellavia</title>
        <meta
          name="description"
          content="Simone Bellavia's (aka @simoneb1x) official blog."
          key="desc"
        />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/android-chrome-192x192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="256x256"
          href="/android-chrome-256x256.png"
        />
      </Head>

      <main className="mx-auto md:max-w-3xl sm:py-34 py-20 space-y-8">
        {children}
      </main>
    </div>
  );
}
