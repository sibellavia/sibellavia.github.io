---
title: "Qwen3-Max and other Qwen releases"
date: 2025-09-24T09:28:00+02:00
---

[Qwen3-Max](https://qwen.ai/blog?id=241398b9cd6353de490b0f82806c7848c5d2777d&from=research.latest-advancements-list) has been released from Qwen team. It's their largest and most advanced large language model to date. It competes against GPT-5 and Grok 4. 

The base model has *over 1 trillion parameters and was pretrained on 36 trillion tokens*. Its architecture seems to follow the same of other models from Qwen3 series: it provides a highly optimized MoE design, which activates only a subset of parameters per inference. This is something we've already seen with Qwen3-Next models, form which I think it inherits the same context window also.

The thinking variant, Qwen3-Max-Thinking, it is equipped with tool use and they say it's deployed *in heavy mode*. It's unclear to me what do they mean with it: perhaps they give it way more computational resources compared to the non-thinking variant.

They are taking the core architecture and maxxioptimizing it to reduce costs and improve efficiency. It's impressive to me.

In the last 12 hours, Qwen has released:

- Qwen3-Max
- Qwen3-VL-235B-A22B: most powerful vision-language model in the series 
- Upgrade to Qwen3-Coder: improved terminal tasks, safer code gen  
- Qwen3Guard: safety moderation series for real-time AI content filtering
- Personal AI Travel Designer: new feature in Qwen Chat for personalized trip planning
- Qwen3-LiveTranslate-Flash: low-latency live translation model for real-time audio/text 

While Qwen is continuing to optimize and release new models, I'll wait for DeepSeek. I'm convinced they are cooking.
