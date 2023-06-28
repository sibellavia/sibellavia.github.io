import Layout from "../components/Layout";
import Link from "next/link";

export default function About() {
  return (
    <main className="mx-auto grid max-w-3xl grid-cols-6 gap-6 px-6 pb-40 pt-16">
      <Link href="/">../</Link>

      <div className="col-span-6 space-y-2 rounded-2xl bg-[#384883] p-6 dark:bg-indigo-800 md:col-span-6">
        <h2 className="font-title text-xl font-bold">
          Hello world <span className="inline dark:hidden">🌻</span>
          <span className="hidden dark:inline">⭐</span>
        </h2>
        <p className="text-[#f5f5f5]">
          I am Simone Bellavia, 25 years old. I was born and raised in Catania,
          Sicily, a beautiful city overlooking the Ionian Sea and living at the
          foot of the Mount Etna. I am now based in Milan, another city I love,
          but I travel all the time. I work full-time as a Senior Analyst @
          Accenture. I am studying for a MSc in Data Science at the University
          of Milan-Bicocca. I am a very passionate person who looks at life with
          a lot of curiosity.
          <br></br>
          <br></br>I am currently working as a Technical Coach and Software
          Engineer on several projects. Web Development and DevOps engineering
          have characterized my work experience so far: I am used to working in
          complex contexts based on microservices architecture, where I am
          committed to coordinating my teams and participating in the design and
          development of the solutions we propose. The industries I have worked
          in are Energy, Public Administration, Chemical-Cosmetic, and
          E-Commerce.
          <br></br>
          <br></br>I study Data Science because it is the perfect synthesis of
          my main passions: programming, mathematics, statistics, business
          development. My biggest dream is to one day work in healthcare and
          oncology in general. In the past I also had a prominent role as a
          UX/UI designer: it taught me to love symmetries, well-chosen
          typographies, and good taste in design.
          <br></br>
          <br></br>I am in love with the sea, the waves, the wind and the gym.
          Whenever I can, I go into the water to surf and SUP and I train every
          day to land in the world of powerlifting. I am very curious, I love to
          read and study. I am in love with math, physics, coding and data.
          Coral and black are my favorite colors, Sunflower is the flower I most
          love and in which I reflect myself, and pears are my favorite fruit. I
          prefer morning to evening. I love to travel. I want to learn a lot of
          languages, get to know different cultures. One of my dreams is to help
          others in a concrete way.
        </p>
      </div>

      <div className="col-span-6 space-y-2 rounded-2xl bg-purple-900 p-6 md:col-span-6">
        <h2 className="font-title text-xl font-bold">
          Skills <span className="inline dark:hidden">🧑🏼‍💻</span>
          <span className="hidden dark:inline">⭐</span>
        </h2>

        <ul className="list-disc text-[#f5f5f5] pl-8">
          <li>Programming: C, Python, JavaScript, R, SQL </li>
          <li>
            Data Science: Pandas, NumPy, Matplotlib, Scikit-learn, Tidyverse
          </li>
          <li>Front-End: React, Vue.js, SCSS. Angular fundamentals</li>
          <li>Back-End: Node.js, Flask, FastAPI</li>
          <li>DB: Redis, MySQL, MongoDB</li>
          <li>DevOps: Git, Docker, Azure DevOps, Bitbucket, Bamboo</li>
          <li>BPM: Camunda, RHPAM</li>
          <li>OS: Windows XP+, macOS 10.6+, Debian</li>
          <li>
            Relevant Tools: Jira, Confluence, Trello, Mural/Miro, Figma,
            Photoshop, Illustrator, Office Suite
          </li>
        </ul>
      </div>

      <div className="col-span-6 space-y-2 rounded-2xl bg-teal-900 p-6 md:col-span-6">
        <h2 className="font-title text-xl font-bold">
          Certifications <span className="inline dark:hidden">📄</span>
          <span className="hidden dark:inline">⭐</span>
        </h2>

        <ul class="list-disc text-[#f5f5f5]  pl-8">
          <li>Agile: PAL I, PSM I, PSPO I, SPS, SAFe 5 Practitioner</li>
          <li>CRM: Salesforce Administrator</li>
          <li>
            Languages: English C1, French B2, <i>Spanish B1 self-evaluated</i>,
            Italian mother tongue
          </li>
        </ul>
      </div>
    </main>
  );
}
