import Head from "next/head";

export default function Layout({ children }) {
  return (
    <div className="px-6">
      <Head>
        <title>Simone Bellavia</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="mx-auto md:max-w-3xl sm:py-34 py-20 space-y-8">
        {children}
      </main>
    </div>
  );
}
