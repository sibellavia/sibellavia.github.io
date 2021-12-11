import Head from "next/head";
import Layout from "../components/layout";
import utilStyles from "../styles/utils.module.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import { faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";

export default function Social() {
  return (
    <section className={utilStyles.headingMd}>
      <a href="https://www.linkedin.com/in/simone-bellavia/">
        <FontAwesomeIcon icon={faLinkedin} className={utilStyles.socialIcons} />
      </a>
      <span style={{ padding: 8 }}></span>
      <a href="https://instagram.com/simonebellavia">
        <FontAwesomeIcon
          icon={faInstagram}
          className={utilStyles.socialIcons}
        />
      </a>
      <span style={{ padding: 8 }}></span>
      <a href="https://twitter.com/simoneb1x">
        <FontAwesomeIcon icon={faTwitter} className={utilStyles.socialIcons} />
      </a>
    </section>
  );
}
