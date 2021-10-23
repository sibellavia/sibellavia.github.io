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
            <p>Hello there! I'm a certified Scrum Master that thrives on helping others. In my teams I am a point of reference when it comes to solving a problem or planning tasks to be completed. I make sure that the process is as Agile as possible in order to provide a valuable product to the end customer.</p>
            <p>I'm currently working as a Business & Integration Arch Analyst at Accenture.</p>
            <p>I love writing code, this is also part of my job. I took part in front-end development projects that required the use of Angular, Vue and React. I worked with a DevSecOps approach, with microservices structured architectures, with agile programming paradigms.</p>
            <p>In the past I have also led marketing, graphic and UX/UI design projects. I love symmetries, well-chosen typographies and good taste.</p>
            <p>I am a Data Science student, but above all a data lover. I am very interested in Cybersecurity and everything that comes with it. I have a BSc in Psychology.</p>
        </section>

        <section className={`${utilStyles.padding1px}`}>
            <h2 className={utilStyles.headingLg}>Get in touch</h2>
            <p>Write me on Instagram or on LinkedIn! For me it is always a pleasure to meet new people.</p>
        </section>

        <Social />
    </Layout>
  )
}