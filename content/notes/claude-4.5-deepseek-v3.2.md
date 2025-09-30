---
title: "DeepSeek v3.2-Exp, Claude Sonnet 4.5, and more"
date: 2025-09-30T09:13:00+02:00
---

Lot of interesting stuff, I don't know where to start!

I'll start from DeepSeek, since I am a stan.

[DeepSeek-V3.2-Exp](https://github.com/deepseek-ai/DeepSeek-V3.2-Exp/blob/main/DeepSeek_V3_2.pdf). It's a new model built on [V3.1-Terminus](https://sibellavia.lol/notes/2025/09/23/new-qwen-and-deepseek-models/), and it introduces DeepSeek Sparse Attention, which is a new architecture module that enables fine-grained sparse attention, selecting top-k key-value entries for each query using efficient FP8 operations and lightning indexer. It was built by training five RL-specialized models (math, competitive programming, agentic coding, logical reasoning, and agentic search) using GRPO, then distilling them into the final 685B-parameter model. It comes with a 6-page paper which does not seem to be *really* specific, but it really seems that they are silently cooking and figured something out. Anyway, 10x cheaper inference at 128k tokens, with API prices cut by 50%+. They insist on it being experimental. Matches V3.1-Terminus on most benchmarks, but shows slight degradation in reasoning-heavy tasks like GPQA due to generating fewer reasoning tokens. It seems they cracked cheap, long context for LLMs. I'll try to write more on the paper when I have time.

[Claude 4.5 Sonnet](https://www.anthropic.com/news/claude-sonnet-4-5) -- boring stuff? Anthropic made a bold statement about their latest model: the world's best coding model. I'm not a fan of benchmarks, it just seems to be superior of Opus 4.1, Sonnet 4, GPT-5-Codex, GPT-5 and Gemini 2.5 Pro on a lot of benchmarks. My personal highlights: extended thinking mode, which allows sustained focus on multi-step tasks for over 30 hours; it's trained on a proprietary dataset mix including public internet data (up to July 2025). Post-training uses RL from human and AI feedback.  

Bonus: [LoRA without regret](https://thinkingmachines.ai/blog/lora/). New blog post from Thinking Machines that experimentally shows that LoRA fine-tuning matches full fine-tuning's sample and compute efficiency for post-training on smaller datasets when using high ranks and applying it to all layers (especially MLPs). Worth reading.
