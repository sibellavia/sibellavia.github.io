import Link from "next/link"
import Layout from "../components/Layout"
import { getSortedPostsData } from "../../lib/posts";
import DarkModeButton from "../components/DarkModeButton";

export default function Home({ allPostsData }) {
  return (
    <Layout>
      {/* <header className="flex justify-end py-4">
        <DarkModeButton />
      </header>
       */}
      <div className="space-y-4">
        <h1 className="text-2xl">Simone Bellavia</h1>
        <p className="text-gray-700 dark:text-gray-300">
          Stuff orchestrator. I coordinate teams, develop products and provide
          services in Accenture. I am strongly results-oriented and committed to
          designing optimal solutions for complex architectures.
        </p>

        <p className="text-gray-700 dark:text-gray-300">
          I have experience in the Energy, Public Administration,
          Chemical-Cosmetic and E-Commerce industries. If you would like to learn
          more about me, check out my{" "}
          <Link href="/about">
            <span className="text-blue-600 dark:text-blue-400 hover:underline">
              about page
            </span>
          </Link>
          .
        </p>
      </div>

      <div className="space-y-4">
        <h1 className="text-xl">Last posts</h1>
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

      <div className="space-y-4">
        <h1 className="text-sm text-gray-500">
          © 2019-23 made with ❤️ by{" "}
          <Link href="https://twitter.com/simoneb1x">
            <span className="text-blue-600 dark:text-blue-400 hover:underline">
              @simoneb1x
            </span>
          </Link>
        </h1>
      </div>
    </Layout>
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
