---
title: "New Qwen and DeepSeek models"
date: 2025-09-23
---

A lot of activities from Qwen team, and DeepSeek is starting to go out from their temporary stealth mode. Following is a summary with the updates that I found most interesting from them.

## Qwen models

- [Qwen3-Omni](https://github.com/QwenLM/Qwen3-Omni), a 30B multimodal model that supports text, audio, images and video. *MoE-based Thinker–Talker design with AuT pretraining for strong general representations, plus a multi-codebook design that drives latency to a minimum.* It seems to think a lot! BF16 Instruct model is 78.85 GB. This model replaces the previous [Qwen2.5-Omni](https://github.com/QwenLM/Qwen2.5-Omni).
- [Qwen3-Next-80B-A3B-Instruct-FP8 and Qwen3-Next-80B-A3B-Thinking-FP8](https://huggingface.co/collections/Qwen/qwen3-next-68c25fd6838e585db8eeea9d) FP8 quantized versions. Official ones.

## DeepSeek updates to V3.1

DeepSeek released [DeepSeek-v3.1-Terminus](https://api-docs.deepseek.com/news/news250922), an updated version of their V3.1 model. *What’s improved? Language consistency: fewer CN/EN mix-ups & no more random chars.* Also, it seems to be improved in agentic tool use. 

Exciting times.
