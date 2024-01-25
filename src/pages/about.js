import Layout from "../components/Layout";
import Link from "next/link";

export default function About() {
  return (
    <Layout>
      <div className="pb-8">
        <Link href="/">cd ../</Link>
      </div>

      <div className="space-y-4">
        <h1 className="text-2xl">About me</h1>
        <p className="text-gray-700 dark:text-gray-300">
          I am Simone Bellavia, 25 years old. I was born and raised in Catania,
          Sicily, a beautiful city overlooking the Ionian Sea and living at the
          foot of the Mount Etna. I am now based in Milan, another city I love,
          but I travel all the time. I work full-time as a Senior Analyst @
          Accenture. I am studying for a MSc in Data Science at the University
          of Milan-Bicocca. I am a very passionate person who looks at life with
          a lot of curiosity.
        </p>

        <p className="text-gray-700 dark:text-gray-300">
          I am currently working as a Senior Analyst and Software Engineer on
          several projects. I am used to working in complex contexts based on
          microservices architecture, where I am committed to coordinating my
          teams and participating in the design and development of the solutions
          we propose. The industries I have worked in are Energy, Public
          Administration, Chemical-Cosmetic, and E-Commerce.
        </p>

        <p className="text-gray-700 dark:text-gray-300">
          I study Data Science because it is the perfect synthesis of my main
          passions: programming, mathematics, statistics, business development.
          My biggest dream is to one day work in healthcare and oncology in
          general. In the past I also had a prominent role as a UX/UI designer:
          it taught me to love symmetries, well-chosen typographies, and good
          taste in design.
        </p>

        <h2>Skills 👨🏼‍💻</h2>
        <ul className="list-disc text-gray-700 dark:text-gray-300 pl-8">
          <li>Programming: C, Python, JavaScript, TypeScript, Java, R, SQL </li>
          <li>
            Data Science: Pandas, Hadoop, Spark, NumPy, Matplotlib, Scikit-learn, Tidyverse
          </li>
          <li>Front-End: React, Vue.js, SCSS. Angular</li>
          <li>Back-End: Node.js, Flask, FastAPI, Kafka</li>
          <li>DB: MySQL, Redis, MongoDB</li>
          <li>DevOps: Azure DevOps, Git, Docker, Jira, Bitbucket, Bamboo</li>
          <li>BPM: Camunda, RHPAM</li>
          <li>OS: Windows XP+, macOS 10.6+, Debian, Red Hat Linux</li>
          <li>
            Relevant Tools: Azure services, PowerBI, MS Project, Visio, Office suite...
          </li>
        </ul>

        <h2>Certifications 📄</h2>
        <ul className="list-disc text-gray-700 dark:text-gray-300 pl-8">
          <li>Agile: PAL I, PSM II, PSPO I, SPS, SAFe 5 Practitioner</li>
          <li>CRM: Salesforce Administrator</li>
          <li>
            Languages: English C1, French B2, <i>Spanish B1 self-evaluated</i>,
            Italian mother tongue
          </li>
        </ul>

        <h2>Fun facts ☕️</h2>
        <ul className="list-disc text-gray-700 dark:text-gray-300 pl-8">
          <li>
            I am in love with the sea, the waves and the wind. Whenever I can, I
            go into the water with my SUP.
          </li>
          <li>
            I go to the gym every day. Powerlifting is my favorite discipline.
          </li>
          <li>
            I am very curious (sometimes too much), I love to read and study. I
            am in love with math, physics, coding and data.
          </li>
          <li>Coral and black are my favorite colors.</li>
          <li>Sunflower is my favorite flower.</li>
          <li>
            I love to travel: I want to learn a lot of languages and get to know
            different cultures.
          </li>
          <li>One of my dreams is to help others in a concrete way.</li>
        </ul>

        <h2>Side-projects 🫶</h2>
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
              href="https://github.com/simoneblv/zen"
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

        <h2>Let&apos;s get in touch 😊</h2>
        <ul className="list-disc text-gray-700 dark:text-gray-300 pl-8">
          <li>
            X/Twitter:{" "}
            <Link href="https://twitter.com/sineblia">
              <span className="text-blue-600 dark:text-blue-400 hover:underline">
                @sineblia
              </span>
            </Link>
          </li>
          <li>
            Github:{" "}
            <Link href="https://github.com/sineblia">
              <span className="text-blue-600 dark:text-blue-400 hover:underline">
                @sineblia
              </span>
            </Link>
          </li>
          <li>
            LinkedIn:{" "}
            <Link href="https://www.linkedin.com/in/simone-bellavia/">
              <span className="text-blue-600 dark:text-blue-400 hover:underline">
                @simone-bellavia
              </span>
            </Link>
          </li>
          <li>Email: simone.bellavia@live.it</li>
        </ul>
      </div>
    </Layout>
  );
}
