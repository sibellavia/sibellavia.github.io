---
title: "npm debug and chalk packages compromised"
date: 2025-09-09T22:10:00+02:00
---

Yesterday, a lot of npm packages have been compromised with malicious code. Following, a list of affected packages:

- ansi-styles@6.2.2
- debug@4.4.2 (appears to have been yanked as of 8 Sep 18:09 CEST)
- chalk@5.6.1
- supports-color@10.2.1
- strip-ansi@7.1.1
- ansi-regex@6.2.1
- wrap-ansi@9.0.1
- color-convert@3.1.1
- color-name@2.0.1
- is-arrayish@0.3.3
- slice-ansi@7.1.1
- color@5.0.1
- color-string@2.1.1
- simple-swizzle@0.2.3
- supports-hyperlinks@4.1.1
- has-ansi@6.0.1
- chalk-template@1.1.1
- backslash@0.2.1

and more, I think. I suggest to read the original post published on aikido.dev[1] and related HN discussion[2], both links are reported below.

All packages appear to contain *a piece of code that would be executed on the client of a website, which silently intercepts crypto and web3 activity in the browser, manipulates wallet interactions, and rewrites payment destinations so that funds and approvals are redirected to attacker-controlled accounts without any obvious signs to the user* (as shared from Aikido).

You can run grep or rg to check if your codebase has been impacted -- thanks to sindresorhus for this suggestion:

`rg -u --max-columns=80 _0x112fa8`

This one requires ripgrep, but you can do the same with `grep` (ripgrep its Rust equivalent redesign).

My thoughts about this: dependency hell is real and these are the results. I agree with [Mitchell Hashimoto when he says that npm should adopt some strategies to mitigate these risks](https://x.com/mitchellh/status/1965409636024221901), such as rejecting all dependencies tha have less than 1k LoC. I mean, let's just avoid using external packages to determine if an object can act like an array.  

Also, I would like to share one insight reported by DDerTyp on HN:

> One of the most insidious parts of this malware's payload, which isn't getting enough attention, is how it chooses the replacement wallet address. It doesn't just pick one at random from its list.
> It actually calculates the Levenshtein distance between the legitimate address and every address in its own list. It then selects the attacker's address that is visually most similar to the original one.
> This is a brilliant piece of social engineering baked right into the code. It's designed to specifically defeat the common security habit of only checking the first and last few characters of an address before confirming a transaction.

Needs a little bit of more investigation, for which I don't have enough time, but looks interesting. 

[1] [Original post](https://www.aikido.dev/blog/npm-debug-and-chalk-packages-compromised)

[2] [Hacker News discussion](https://news.ycombinator.com/item?id=45169657)

