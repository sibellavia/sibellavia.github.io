---
title: 'I made a React Password Generator for fun'
date: '2021-06-20'
id: 'i-made-a-react-password-generator-for-fun'
---

Security has always been important, but **more attention is required today in protecting your accounts.** The various data breaches now no longer allow us to use simple and identical passwords for all the services we subscribe to. It is important to use more sophisticated credentials, preferably supported by a Password Manager. I suggest some of them below:

- [1Password](https://1password.com/)
- [Bitwarden](https://bitwarden.com/), it's open source!
- [Keepass](https://keepass.info/)
- [Lastpass](https://www.lastpass.com/it/)

Anyway, **I used this pretext to make my own Password Generator.** At first I wrote it in Python, but then I totally rewrote it in with React.

The approach I used is ASCII conversion [(I got my inspiration here)](https://www.studytonight.com/post/building-a-password-generator-with-javascript). Then I implemented an algorithm that randomizes the password to each generation. The User Interface is extremely simple, it allows you to choose the length of the password and to use lowercase, uppercase characters, numbers and symbols.

Collaborations or criticisms are more than welcome. [You can look at the code here.](https://github.com/simoneb1x/simonebellavia/blob/main/pages/coding-projects/password-generator.js) Surely the solution I have adopted will not be the most elegant or efficient, for this reason I will improve it in the future. I know I didn't invent hot water, but I found it to be a good reason to practice React and provide something that could be really useful 😊

Maybe the next step will be to create a password manager? I'll think about it, that would be a good challenge.

Hope you like it, thanks for reading this far!