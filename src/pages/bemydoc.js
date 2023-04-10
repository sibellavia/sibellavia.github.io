import Layout from "../components/Layout";
import Link from "next/link";
import Image from 'next/image'

export default function About() {
  return (
    <Layout>
      <div className="pb-8">
        <Link href="/">cd ../</Link>
      </div>

      <div className="space-y-4">
        <h1 className="text-2xl">beMyDoc</h1>
        <img
          src="https://i.imgur.com/2VH09c4.png"
          style={{ borderRadius: "2%" }}
          alt="beMyDoc presentation banner"
        ></img>
        <p className="text-gray-700 dark:text-gray-300">
          beMyDoc is the concept of an application designed during the Covid
          pandemic in 2020. The Covid-19 pandemic, as is well known, has
          actually made the management of frail patients by health care
          personnel difficult. No less so is the management of that type of
          leukemia patient to whom chemotherapy protocols can be applied by
          administering oral drugs. This type of patient can be well managed
          without the need for hospitalization. However, the condition must be
          constantly monitored in order to intervene quickly if side effects or
          reactions to therapy occur. And this is precisely the task that is
          entrusted to the system that was requested by the Hematology
          Department of the Polyclinic of Catania.
        </p>
        <img
          src="https://i.imgur.com/ah9rctj.png"
          className="w-1/2 mx-auto"
          style={{ borderRadius: "0.8%" }}
          alt="beMyDoc app"
        ></img>
        <p className="text-gray-700 dark:text-gray-300">
          The project was entirely conceived and developed by the non-profit
          organization{" "}
          <Link href="https://www.veyes.it/" target="_blank">
            <span className="text-blue-600 dark:text-blue-400 hover:underline">
              vEyes
            </span>
          </Link>
          , led by Professor{" "}
          <Link href="https://www.dmi.unict.it/salfi/index.htm" target="_blank">
            <span className="text-blue-600 dark:text-blue-400 hover:underline">
              Massimiliano Salfi
            </span>
          </Link>
          , an exceptional person to whom I owe the great pleasure and honor of
          having allowed me to participate in a project so important to me.
        </p>

        <p className="mx-auto text-gray-700 dark:text-gray-300">
          The app was supposed to function as a health diary, offering important
          features such as: an information section on the pathology, specific to
          each patient; reporting of illness, the most important one in my
          opinion, because it would allow a direct connection with the
          hematology department and the specialist physician-the feature is
          shown in the screenshot, and would guide the patient in indicating
          symptoms and details, also accompanied by photographs; a report
          submission feature; and a health diary feature, to remind of
          appointments and medication intake.
        </p>

        <p className="text-gray-700 dark:text-gray-300">
          I was able to take care of the branding, logo making, and the UX/UI
          part.
        </p>

        <img
          src="https://i.imgur.com/qc6Lor5.png"
          style={{ borderRadius: "0.8%" }}
          alt="beMyDoc logo realization, 1"
        ></img>

        <p className="mx-auto text-gray-700 dark:text-gray-300">
          This is the concept I based the logo on. I wanted to include the
          foundational elements of the app: hematology, medical relief, and
          communication.
        </p>

        <img
          src="https://i.imgur.com/8NeyTWF.png"
          style={{ borderRadius: "0.8%" }}
          alt="beMyDoc logo realization, 2"
        ></img>
        <img
          src="https://i.imgur.com/bkC59DC.png"
          style={{ borderRadius: "0.8%" }}
          alt="beMyDoc logo realization, 3"
        ></img>

        <p className="text-gray-700 dark:text-gray-300">
          If you speak Italian, you can learn more about the project through
          reading{" "}
          <Link
            href="http://magazine.veyes.it/2020/12/30/be-mydoc/"
            target="_blank"
          >
            <span className="text-blue-600 dark:text-blue-400 hover:underline">
              this article
            </span>
          </Link>
          , published by Professor Salfi in vEyes magazine.
        </p>
      </div>
    </Layout>
  );
}
