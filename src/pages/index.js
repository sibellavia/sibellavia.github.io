import Link from "next/link";
import Head from "next/head";
import { getSortedPostsData } from "../../lib/posts";
import Image from "next/image";

export default function Home({ allPostsData }) {
  return (
    <main className="mx-auto grid max-w-3xl grid-cols-6 gap-6 px-6 pb-40 pt-16">
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

      <div className="col-span-4 flex items-center justify-center overflow-hidden rounded-2xl bg-[#ff7f50] dark:border-black-500 dark:bg-black-500/20 dark:shadow-none dark:backdrop-blur-2xl md:col-span-4 md:h-52">
        <div className="flex flex-col items-center space-y-4 px-6 py-8 md:flex-row md:space-x-4 md:space-y-0">
          <Image
            src="/propic.jpg"
            // placeholder="blur"
            height={96}
            width={96}
            className="h-24 w-24 rounded-full object-cover"
            alt="Photo of me"
          />
          <div className="space-y-1">
            <h1 className="text-center font-title text-xl font-bold text-black-900 dark:text-black-300 dark:text-glow-black-500/50 md:text-left">
              Simone Bellavia
            </h1>
            <p className="text-center text-black-800 dark:text-black-300/95 dark:text-glow-black-500/50 md:text-left">
              pmo, software engineer
            </p>
          </div>
        </div>
      </div>

      {/* Twitter card */}
      <div className="group col-span-2 h-full">
        <a
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-full items-center justify-center rounded-2xl bg-sky-500 text-4xl text-white transform-gpu transition-all duration-500 will-change-[outline,_transform] group-hover:scale-95 active:scale-100"
          href="https://twitter.com/simoneblv"
        >
          <span className="sr-only">Twitter</span>
          <span className="transform-gpu transition duration-500 group-hover:scale-[1.3]">
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth={0}
              role="img"
              viewBox="0 0 24 24"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title />
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
            </svg>
          </span>
        </a>
      </div>

      {/* Bio */}
      <div className="col-span-6 space-y-2 rounded-2xl bg-[#384883] p-6 dark:bg-indigo-800 md:col-span-6">
        <h2 className="font-title text-xl font-bold">
          Hey <span className="inline dark:hidden">🌻</span>
          <span className="hidden dark:inline">⭐</span>
        </h2>
        <p className="text-[#f5f5f5]">
          I am a 25 y/o working at Accenture as a PMO and Software Engineer in
          awesome international teams. I am a Data Science student at the
          University of Milan-Bicocca.
          <br></br>I like sports and I am in love with the sea. You can often
          find me at the beach, even in winter. Interested in healthcare, data
          science, software engineering, project management, Unix.
          <br></br>
          <br></br>
          <Link href="about" className="underline">
            Read more about me here :)
          </Link>
        </p>
      </div>

      {/* LinkedIn */}
      <div className="group col-span-3 h-48">
        <a
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-full items-center justify-center rounded-2xl bg-[#0072b1] text-4xl text-white transform-gpu transition-all duration-500 will-change-[outline,_transform] group-hover:scale-95 active:scale-100"
          href="https://www.linkedin.com/in/simone-bellavia/"
        >
          <span className="sr-only">LinkedIn</span>
          <span className="transform-gpu transition duration-500 group-hover:scale-[1.3]">
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth={0}
              role="img"
              viewBox="0 0 48 48"
              height="2em"
              width="2em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title />
              <path d="M20.9716667,33.5527338 L25.001,33.5527338 L25.001,27.1328007 C25.001,25.439485 25.3213333,23.7988354 27.4206667,23.7988354 C29.491,23.7988354 29.517,25.7351486 29.517,27.2404662 L29.517,33.5527338 L33.5506667,33.5527338 L33.5506667,26.4341413 C33.5506667,22.9381777 32.796,20.2505391 28.711,20.2505391 C26.7483333,20.2505391 25.432,21.3265278 24.8943333,22.3471839 L24.839,22.3471839 L24.839,20.5725357 L20.9716667,20.5725357 L20.9716667,33.5527338 Z M16.423,14.1202696 C15.1273333,14.1202696 14.0823333,15.1682587 14.0823333,16.4595785 C14.0823333,17.7508984 15.1273333,18.7992208 16.423,18.7992208 C17.7133333,18.7992208 18.761,17.7508984 18.761,16.4595785 C18.761,15.1682587 17.7133333,14.1202696 16.423,14.1202696 L16.423,14.1202696 Z M14.4026667,33.5527338 L18.4406667,33.5527338 L18.4406667,20.5725357 L14.4026667,20.5725357 L14.4026667,33.5527338 Z M9.76633333,40 C8.79033333,40 8,39.2090082 8,38.2336851 L8,9.76631493 C8,8.79065843 8.79033333,8 9.76633333,8 L38.234,8 C39.2093333,8 40,8.79065843 40,9.76631493 L40,38.2336851 C40,39.2090082 39.2093333,40 38.234,40 L9.76633333,40 Z" />
            </svg>
          </span>
        </a>
      </div>

      {/* GitHub */}

      <div className="group col-span-3 h-48">
        <a
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-full items-center justify-center rounded-2xl bg-[#333] text-4xl text-white transform-gpu transition-all duration-500 will-change-[outline,_transform] group-hover:scale-95 active:scale-100"
          href="https://www.github.com/simoneb1x"
        >
          <span className="sr-only">Github</span>
          <span className="transform-gpu transition duration-500 group-hover:scale-[1.3]">
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth={0}
              role="img"
              viewBox="0 0 16 16"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title />
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
            </svg>
          </span>
        </a>
      </div>

      {/* Projects */}
      <div className="col-span-6 space-y-2 rounded-2xl bg-yellow-400 p-6 dark:bg-indigo-800 md:col-span-6">
        <h2 className="font-title text-slate-900 text-xl font-bold">
          Recent Things
        </h2>
        <p className="text-slate-900">
          <Link
            href="https://infotumori.it"
            className="underline"
            target="_blank"
          >
            Infotumori.it
          </Link>
          <br></br>
          Infotumori aims to provide essential information and key resources for
          proper cancer awareness. It is aimed at people who want to get
          informed, prevent and cure. Developed for an Italian target audience.
          Its development is still in progress.
          <br></br>
          <br></br>
          <Link href="bemydoc" className="underline">
            beMyDoc
          </Link>
          <br></br>
          beMyDoc is the design of an application for monitoring the health
          status of leukemia patients to whom chemotherapy protocols can be
          applied by administering oral drugs.
          <br></br>
          <br></br>
          <Link
            href="https://github.com/simoneb1x/zen"
            className="underline"
            target="_blank"
          >
            Zen
          </Link>
          <br></br>A minimalist, simple and essential timer. Yet another
          Pomodoro app for macOS, developed using Swift.
        </p>
      </div>

      {/* Blog */}

      <div className="col-span-6 space-y-2 rounded-2xl bg-cyan-900 p-6 dark:bg-indigo-800 md:col-span-6">
        <h2 className="font-title text-[#f5f5f5] text-xl font-bold">Blog</h2>
        <div className="space-y-4">
          {allPostsData.slice(0, 5).map(({ id, date, title }) => (
            <div key={id}>
              <Link href={`/posts/${id}`}>
                <p className="text-[#f5f5f5] underline">{title}</p>
              </Link>
              <div>{date}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
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
