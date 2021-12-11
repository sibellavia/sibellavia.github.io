import React, { useState } from 'react' 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Head from 'next/head'
import Layout, { siteTitle } from '../../components/layout'
import styles from '../../styles/utils.module.css'
import utilStyles from '../../styles/utils.module.css'
import Link from 'next/link'

// Funzione che pusha caratteri in un array
let arrayFromLowToHigh = (low, high) => {
  const array = [];
  for (let i = low; i <= high; i++) {
    array.push(i);
  }
  return array;
};

// Costanti
const UPPERCASE_CODES = arrayFromLowToHigh(65, 90);
const LOWERCASE_CODES = arrayFromLowToHigh(97, 122);
const NUMBERS_CODES = arrayFromLowToHigh(48, 57);
const SYMBOLS_CODES = arrayFromLowToHigh(33, 47)
  .concat(arrayFromLowToHigh(58, 64))
  .concat(arrayFromLowToHigh(91, 96))
  .concat(arrayFromLowToHigh(123, 126));

// Home function
export default function Home({ allPostsData }) {

    const [password, setPassword] = useState("");
    const [passwordLength, setPasswordLength] = useState(20);
    const [includeUppercase, setIncludeUppercase] = useState(false);
    const [includeLowercase, setIncludeLowercase] = useState(false);
    const [includeNumbers, setIncludeNumbers] = useState(false);
    const [includeSymbols, setIncludeSymbols] = useState(false);

    const handleGeneratePassword = (e) => {
        if(
            !includeUppercase &&
            !includeLowercase &&
            !includeNumbers &&
            !includeSymbols
        ) {
            notify("You must select at least one option", true)
        }

        let characterList = [];

        if (includeLowercase) {
            characterList =  characterList.concat(LOWERCASE_CODES);
        }

        if(includeUppercase) {
            characterList = characterList.concat(UPPERCASE_CODES);
        }

        if(includeNumbers) {
            characterList = characterList.concat(NUMBERS_CODES);
        }

        if(includeSymbols){
            characterList = characterList.concat(SYMBOLS_CODES);
        }

        setPassword(createPassword(characterList));

    }

    const createPassword = (characterList) => {
        const characterListLength = characterList.length;
        let password = [];

        console.log(characterList);

        /* generation and shuffle */
        for(let i = 0; i < characterListLength; i++){
            let k;
            k = String.fromCharCode(characterList[i]);
            password.push(k);
        }

        console.log(password);

        for(let i = password.length - 1; i > 0; i--){
            let j = Math.floor(Math.random() * (i + 1));
            let temp = password[i];
            password[i] = password[j];
            password[j] = temp;
        }

        password.splice(passwordLength);
        password = password.join("");
        
        if(password){
            notifyPasswordGeneration();
        }
        
        return password;
    }

    const copyToClipboard = () => {
        const newTextArea = document.createElement("textarea");
        newTextArea.innerText = password;
        document.body.appendChild(newTextArea);
        newTextArea.select();
        document.execCommand("copy");
        newTextArea.remove();
    }

    const notify = (message, hasError = false) => {
      if (hasError) {
        toast.error(message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        toast.success(message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    }

    const handleCopyPassword = (e) => {
      if (password === "") {
        notify("Nothing to copy. Please generate a password.", true);
      } else {
        copyToClipboard();
        notify("Evvai!");
      }
    };

    const notifyPasswordGeneration = (e) => {
      notify("Password succesfully generated!");
    };

  return (
    <Layout>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Password Generator</h2>

        <div className="generator__password">
          <span>{password}</span>
          {/* <button onClick={handleCopyPassword} className="copy__btn">
            <p>Copy</p>
          </button> */}
        </div>

        <div className="form-group">
          <label htmlFor="password-strength">Set password length</label>
          <input
            defaultValue={passwordLength}
            onChange={(e) => setPasswordLength(e.target.value)}
            type="number"
            id="password-strength"
            name="password-strength"
            max="20"
            min="10"
          />
        </div>

        <div className="form-group">
          <label htmlFor="uppercase-letters">Include uppercase letters</label>
          <input
            checked={includeUppercase}
            onChange={(e) => setIncludeUppercase(e.target.checked)}
            type="checkbox"
            id="uppercase-letters"
            name="uppercase-letters"
          />
        </div>

        <div className="form-group">
          <label htmlFor="lowercase-letters">Include lowercase letters</label>
          <input
            checked={includeLowercase}
            onChange={(e) => setIncludeLowercase(e.target.checked)}
            type="checkbox"
            id="lowercase-letters"
            name="lowercase-letters"
          />
        </div>

        <div className="form-group">
          <label htmlFor="include-numbers">Include numbers</label>
          <input
            checked={includeNumbers}
            onChange={(e) => setIncludeNumbers(e.target.checked)}
            type="checkbox"
            id="include-numbers"
            name="include-numbers"
          />
        </div>

        <div className="form-group">
          <label htmlFor="include-symbols">Include Symbols</label>
          <input
            checked={includeSymbols}
            onChange={(e) => setIncludeSymbols(e.target.checked)}
            type="checkbox"
            id="include-symbols"
            name="include-symbols"
          />
        </div>

        <button onClick={handleGeneratePassword} className="generator__btn">
          Generate Password
        </button>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </section>

    </Layout>
  );
}