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
          Hi there! I am Simone Bellavia, I am 25 years old. I was born and
          raised in Catania, Sicily, a wonderful city overlooking the Ionian Sea
          and living at the foot of the volcano Etna. I am now based in Milan,
          another city I love, but I travel all the time. I work full-time as an
          IT Senior Analyst at Accenture. I study at the University of
          Milan-Bicocca in the Master of Science in Data Science program. I am a
          person who is strongly driven by passion and who looks at life with a
          lot of curiosity.
        </p>

        <p className="text-gray-700 dark:text-gray-300">
          I mainly work as a Scrum Master and Software Engineer on multiple
          projects and multiple teams. Web programming and the DevOps world
          constitute two predominant interests. I enjoy delivering high-quality
          software, so I also continuously study Technical Agility practices
          that can help teams perform better. I always tend to be a
          servant-leader and a point of reference in my teams. I have worked in
          different industries: currently, I am involved in the Energy one for a
          large Italian multinational, but I have also been in Public Services,
          Chemical-Cosmetic, Tobacco, and E-Commerce.
        </p>

        <p className="text-gray-700 dark:text-gray-300">
          I study Data Science because it encompasses many of my passions:
          programming, math, and statistics, business development. My biggest
          dream is to make my skills available in the healthcare industry,
          particularly the oncology industry. In the past I also held a
          preponderant role as a UX/UI designer: it taught me to love
          symmetries, well-chosen typographies, and good taste in design. I am
          in love with the wind, the sea, and its waves. In my life, I have
          always practiced Windsurfing and SUP, sports that have taught me so
          much, and continue to do so always.
        </p>

        <h2>Skills</h2>
        <ul className="list-disc text-gray-700 dark:text-gray-300 pl-8">
          <li>Programming: Python, R, JavaScript, C, SQL </li>
          <li>
            Data Science: Pandas, NumPy, Matplotlib, Scikit-learn, Tidyverse
          </li>
          <li>Front-End: Hugo, Jekyll, React, HTML5, SASS, Angular</li>
          <li>Back-End: Flask, FastAPI, REST APIs, Node.js</li>
          <li>DB: Redis, MySQL, MongoDB</li>
          <li>DevOps: K8s, Docker, CI/CD pipelines</li>
          <li>VCS: Git</li>
          <li>BPM: Red Hat PAM, Camunda</li>
          <li>OS: Windows XP+, macOS 10.6+, Debian</li>
          <li>
            Relevant Tools: Jira, Azure DevOps, Confluence, Trello, Mural/Miro
          </li>
        </ul>

        <h2>Certifications</h2>
        <ul className="list-disc text-gray-700 dark:text-gray-300 pl-8">
          <li>Agile: PAL I, PSM I, PSPO I, SPS, SAFe 5 Practitioner</li>
          <li>CRM: Salesforce Administrator</li>
          <li>Languages: English C1, French B2, Spanish A2 self-evaluated</li>
        </ul>
      </div>
    </Layout>
  );
}
