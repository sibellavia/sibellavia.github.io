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
          but I travel all the time. I work full-time as an IT Senior Analyst @
          Accenture. I am studying for a MSc in Data Science at the University
          of Milan-Bicocca. I am a very passionate person who looks at life with
          a lot of curiosity.
        </p>

        <p className="text-gray-700 dark:text-gray-300">
          I am currently working as a Scrum Master and Software Engineer on
          several projects. Web Development and DevOps engineering have
          characterized my work experience so far: I am used to working in
          complex contexts based on microservice architectures, where I am
          committed to coordinating my teams and participating in the design and
          development of the solutions we propose. The industries I have worked
          in are Energy, Public Administration, Chemical-Cosmetic, and
          E-Commerce.
        </p>

        <p className="text-gray-700 dark:text-gray-300">
          I study Data Science because it is the perfect synthesis of my main
          passions: programming, mathematics, statistics, business development.
          My biggest dream is to one day work in healthcare and oncology in
          general. In the past I also had a prominent role as a UX/UI designer:
          it taught me to love symmetries, well-chosen typographies, and good
          taste in design.
        </p>

        <p className="text-gray-700 dark:text-gray-300">
          I am in love with the sea, the waves, the wind and... the gym! I train
          every day to land in the world of powerlifting. And whenever I can, I
          go into the water to surf and SUP. I am very curious. I love to read
          and study. I am in love with math and physics. My favorite colors are
          coral and black. My favorite flower is the sunflower. My favorite
          fruit is the pear. I prefer morning to evening. I love to travel.
        </p>

        <h2>Skills 👨🏼‍💻</h2>
        <ul className="list-disc text-gray-700 dark:text-gray-300 pl-8">
          <li>Programming: C, Python, JavaScript, R, SQL </li>
          <li>
            Data Science: Pandas, NumPy, Matplotlib, Scikit-learn, Tidyverse
          </li>
          <li>Front-End: Hugo, Jekyll, React, Angular, HTML5, SASS,</li>
          <li>Back-End: Flask, FastAPI, REST APIs, Node.js</li>
          <li>DB: Redis, MySQL, MongoDB</li>
          <li>DevOps: K8s, Docker, CI/CD scripting</li>
          <li>VCS: Git</li>
          <li>BPM: Red Hat PAM, Camunda</li>
          <li>OS: Windows XP+, macOS 10.6+, Debian</li>
          <li>
            Relevant Tools: Jira, Azure DevOps, Confluence, Trello, Mural/Miro
          </li>
        </ul>

        <h2>Certifications 📄</h2>
        <ul className="list-disc text-gray-700 dark:text-gray-300 pl-8">
          <li>Agile: PAL I, PSM I, PSPO I, SPS, SAFe 5 Practitioner</li>
          <li>CRM: Salesforce Administrator</li>
          <li>
            Languages: English C1, French B2, <i>Spanish A2 self-evaluated</i>,
            Italian mother tongue
          </li>
        </ul>

        <h2>Let&apos;s get in touch 😊</h2>
        <ul className="list-disc text-gray-700 dark:text-gray-300 pl-8">
          <li>
            Twitter:{" "}
            <Link href="https://twitter.com/simoneb1x">
              <span className="text-blue-600 dark:text-blue-400 hover:underline">
                @simoneb1x
              </span>
            </Link>
          </li>
          <li>
            LinkedIn:{" "}
            <Link href="https://www.linkedin.com/in/simone-bellavia/">
              <span className="text-blue-600 dark:text-blue-400 hover:underline">
                /in/simone-bellavia
              </span>
            </Link>
          </li>
        </ul>
      </div>
    </Layout>
  );
}
