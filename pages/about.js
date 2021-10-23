import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import Social from '../components/social'

export default function Home({ allPostsData }) {
  return (
    <Layout>
        <Head>
            <title>{siteTitle}</title>
        </Head>

        <section className={`${utilStyles.padding1px}`}>
            <h2 className={utilStyles.headingXl}>About me</h2>
            <p>Hello there! I'm a result-oriented Business Analyst. In my teams I am a point of reference when it comes to solving a problem or planning tasks to be completed.</p>
            <p>I'm currently working as a Business & Integration Arch Analyst at Accenture. I coordinate agile teams and I assist the client to achieve the requirements and objectives set by the project</p>
            <p>I am also involved in the design, development and configuration of systems and architectures, making my knowledge of technologies, applications and methodologies available. I have experience in the Energy, Cybersecurity and Hybrid-Cloud Applications, Chemical-Cosmetic and Food sectors.</p>
            <p>In the past I took part in FE/BE development projects that required the use of Angular, Vue and React. I worked with microservices structured architectures, integrating a DevSecOps approach.</p>
            <p>I have also led marketing, graphic and UX/UI design projects. I love symmetries, well-chosen typographies and good taste.</p>
            <p>I am a data lover, and a student of the Master's Degree in Data Science at the University of Trento. I am very interested in Cybersecurity and everything that comes with it. I have a BSc in Psychology.</p>
        </section>

        <section className={`${utilStyles.padding1px}`}>
            <h2 className={utilStyles.headingXl}>Knowledge and technologies</h2>
            <ul>
              <li>Languages: JavaScript, C, Python</li>
              <li>Front-End: React, CSS, SCSS. Angular fundamentals</li>
              <li>Back-End: node.js and ExpressJS fundamentals</li>
              <li>Proficiency in Git as VCS</li>
              <li>OS: Windows XP+, macOS 10.6+, Debian</li>
              <li>CRM: Salesforce Admin</li>
              <li>Graphics & UX/UI: Photoshop, Illustrator, Xd, Figma, Sketch</li>
            </ul>
        </section>

        <section className={`${utilStyles.padding1px}`}>
          <h2 className={utilStyles.headingXl}>Let's connect</h2>
          <p>You can find me on LinkedIn, Instagram, Twitter. Lesssgo!</p>
        </section>

        <Social />
    </Layout>
  )
}