import Head from "next/head";
import styles from "./layout.module.css";
import utilStyles from "../styles/utils.module.css";
import Link from "next/link";

const name = "Simone Bellavia";
export const siteTitle = "Simone Bellavia – simonebellavia.com";

export default function Layout({ children, home }) {
  return (
    <div className={styles.container}>
      <Head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicon/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon/favicon-16x16.png"
        />
        <meta
          name="description"
          content="I'm a curious Scrum Master, developer and Data Science student. Read more on my blog."
        />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <header className={styles.header}>
        {home ? (
          <>
            <Link href="/">
              <h1 className={utilStyles.heading2Xl}>
                Hello there, I'm Simone 👨🏼‍💻
              </h1>
            </Link>
            <section className={utilStyles.subHeadingHeader}>
              I'm a curious Scrum Master, developer and Data Science student.
              Sometimes I write articles on my blog. I work as a Business and
              Integration Arch Analyst at Accenture. Know more about me{" "}
              <Link href="/about">here.</Link>
            </section>
          </>
        ) : (
          <>
            <h2 className={utilStyles.headingLg}>
              <Link href="/">
                <a className={utilStyles.colorInherit}>{name}</a>
              </Link>
            </h2>
          </>
        )}
      </header>
      <main>{children}</main>
      {!home && (
        <div className={styles.backToHome}>
          <Link href="/">
            <a>← Back to home</a>
          </Link>
        </div>
      )}
    </div>
  );
}
