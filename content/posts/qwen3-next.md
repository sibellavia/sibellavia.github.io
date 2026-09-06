---
title: "Qwen 3 Next"
date: 2025-09-12
---

[Qwen team released two new models](https://x.com/Alibaba_Qwen/status/1966197643904000262): Qwen3-Next-80B-A3B-Instruct and Qwen3-Next-80B-A3B-Thinking.
Both are already present on [HuggingFace](https://huggingface.co/collections/Qwen/qwen3-next-68c25fd6838e585db8eeea9d). Qwen also published [a post on their blog](https://qwen.ai/blog?id=4074cca80393150c248e508aa62983f9cb7d27cd&from=research.latest-advancements-list).  

> Compared to the MoE structure of Qwen3, Qwen3-Next introduces several key improvements: a hybrid attention mechanism, a highly sparse Mixture-of-Experts (MoE) structure, training-stability-friendly optimizations, and a multi-token prediction mechanism for faster inference.

Both models are based on the Qwen3-Next-80B-A3B-Base model, which only activates 3 billion parameters per token. Qwen 3 Next is an ultra-sparse MoE with 512 experts, combining 10 routed experts and 1 shared experts. Also, it's based on a hybrid architecture, composed by *Gated DeltaNet + Gated Attention*.

They say Qwen3-Next-80B-A3B-Instruct approaches their 235B flagship, and Qwen3-Next-80B-A3B-Thinking seems to outperform Gemini-2.5-Flash-Thinking.

Qwen 3 Next natively supports context lengths of up to 262,144 tokens, but they even validated it on context lengths of up to 1 million tokens using the YaRN method. YaRN is supported by `transformers`, `vllm` and `sglang`. 

