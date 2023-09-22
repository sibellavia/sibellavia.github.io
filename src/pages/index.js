import Link from "next/link";
import Layout from "../components/Layout";
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
          Hey 🌻
          <br></br>I am a 25 y/o working at Accenture as a PMO and Software
          Engineer in awesome international teams. I am a Data Science student
          at the University of Milan-Bicocca.
          <br></br>I like sports and I am in love with the sea. You can often
          find me at the beach, even in winter. Interested in healthcare, data
          science, software engineering, project management, Unix.{" "}
          <Link href="/about">
            <span className="text-blue-600 dark:text-blue-400 hover:underline">
              Read more about me here :)
            </span>
          </Link>
        </p>
      </div>

      <div className="space-y-4">
        <h1 className="text-xl">Side-projects</h1>
        <div className="grid grid-cols-1 gap-6">
          <div>
            <a
              href="https://infotumori.it/"
              target="_blank"
              className="text-lg font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Infotumori.it
            </a>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Infotumori aims to provide essential information and key resources
              for proper cancer awareness. It is aimed at people who want to get
              informed, prevent and cure. Developed for an Italian target
              audience. Its development is still in progress.
            </p>
          </div>
          <div>
            <a
              href="https://github.com/simoneb1x/zen"
              target="_blank"
              className="text-lg font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Zen
            </a>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              A minimalist, simple and essential timer. Yet another Pomodoro app
              for macOS, developed using Swift.
            </p>
          </div>
          <div>
            <Link href="/bemydoc">
              <span className="text-lg font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                beMyDoc
              </span>
            </Link>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              beMyDoc is the design of an application for monitoring the health
              status of leukemia patients to whom chemotherapy protocols can be
              applied by administering oral drugs.
            </p>
          </div>
        </div>
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
