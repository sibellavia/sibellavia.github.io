---
title: "GPT-5-Codex and Codex improvements"
date: "2025-09-15"
---

New model in town! [GPT-5-Codex](https://openai.com/index/introducing-upgrades-to-codex/) is a version of GPT-5 specifically realized for agentic coding in Codex. Here's what you need to know:

- It dynamically adapts its *thinking* based on the complexity of the task.
- Adheres to [AGENTS.md](https://agents.md/) instructions.
- It has been trained specifically for conducting code reviews and finding critical flaws.
- GPT-5 and GPT-5-Codex achieve comparable accuracy on SWE-bench Verified (72.8% vs. 74.5%), but GPT-5-Codex shows a clear advantage in code refactoring tasks (51.3% vs. 33.9%).
- OpenAI found that comments by GPT‑5-Codex are less likely to be incorrect or unimportant: GPT-5-Codex produces fewer incorrect comments (4.4% vs. 13.7%) and more high-impact comments (52.4% vs. 39.4%) than GPT-5. Interestingly, GPT-5 makes more comments per pull request on average (1.32 vs. 0.93), but with lower precision and impact.

Many are complaining about the naming and the "Codex everywhere". Honestly, I don't care so much about the poor naming scheme as long as models and tools are good. 

GPT-5-Codex is not available in the API but it will be soon. To use it, you will need Codex CLI, so make sure to install it: `npm i -g @openai/codex`. [@sama](https://x.com/sama/status/1967674950502015165) claims that GPT-5-Codex already represents ~40% of traffic for Codex.

I installed and tried it (yes, haven't done before, this is the first time for me using Codex). You can choose the model reasoning effort: prompting `/model`, Codex will let you choose between `gpt-5-codex low`, `gpt-5-codex medium` and `gpt-5-codex high`. Although [OpenAI recommends to leave the model_reasoning_effort at default (medium)](https://x.com/embirico/status/1967655551762075861) to take the most advantage of the more dynamic reasoning effort. 

Along with the model, they also provided more updates: 

- Codex runs in a sandboxed environment with network access (opens in a new window) disabled, whether locally or in the cloud.
- In Codex CLI, you can now resume a previous interactive session.
- Once turned on for a GitHub repo, Codex automatically reviews PRs.
- It is possible to asynchronously delegate tasks to Codex Cloud.

And more.

I think they're heading in the right direction, actually. They're focusing their efforts on the tools, which is good. What's more, I have to say that I've reevaluated GPT5 and am using it daily instead of Claude. That's why I appreciate and welcome these new releases.

Last but not least, [Codex is open-source!](https://github.com/openai/codex)
