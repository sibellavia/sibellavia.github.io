import Head from "next/head";
import { getSortedPostsData } from "../../lib/posts";

export default function Home({ allPostsData }) {
  return (
    <div className="px-6">
      <Head>
        <title>Mio Blog</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="mx-auto md:max-w-3xl sm:py-34 py-20 space-y-8">
        <div className="space-y-4">
          <div className="text-center">
            <h1 className="text-4xl font-sans font-semibold text-gray-900 dark:text-gray-100">
              Benvenuto sul mio blog
            </h1>
            <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">
              Ciao! Sono [Il tuo nome].
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="text-center">
            <h2 className="text-2xl font-sans font-semibold text-gray-900 dark:text-gray-100">
              Ultimi articoli
            </h2>
            <ul className="mt-8 space-y-4">
              {allPostsData.map(({ slug, title, date }) => (
                <li key={slug}>
                  <a
                    href={`/posts/${slug}`}
                    className="text-lg font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {title}
                  </a>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {date}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-4">
          <div className="text-center">Footer</div>
        </div>
      </main>
    </div>
  );
}

export async function getStaticProps() {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
}
