import Link from "next/link";
import Layout from "../components/Layout";
import { getSortedPostsData } from "../../lib/posts";

export default function Home({ allPostsData }) {
  return (
    <Layout>
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold my-4">Simone Bellavia&apos;s Web Page</h1>
        <div className="flex flex-wrap -mx-2">
          <div className="w-full md:w-1/2 px-2 md:mt-0 mt-4 mb-8">
            <h2 className="text-xl font-bold mb-2">about</h2>
            <p className="text-gray-700 dark:text-gray-300">
          hey I&apos;m Simone Bellavia, aka @simoneblv or sblv, a 25 y/o working at Accenture as a Senior Analyst and
          Software Engineer in awesome international teams. I&apos;m also a Data Science
          student at the University of Milan-Bicocca. when I&apos;m not writing code, you
          can find me at the nearest beach or in a gym. I&apos;m interested in
          software engineering, data science, project management, healthcare.
          <br></br>
          <Link href="/about">
            <span className="text-blue-600 dark:text-blue-400 hover:underline">
              read more about me here :)
            </span>
          </Link>
        </p>
          </div>
          <div className="w-full md:w-1/2 px-2">
            <h2 className="text-xl font-bold mb-2">posts</h2>
            <ul className="space-y-4">
              {allPostsData.map(({ slug, title, date }) => (
                <li key={slug} className="lowercase">
                  <ul><Link href={`/posts/${slug}`}>
                      {title}
                  </Link></ul>
                  
                </li>
              ))}
            </ul>
          </div>
        </div>
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
    }
}
