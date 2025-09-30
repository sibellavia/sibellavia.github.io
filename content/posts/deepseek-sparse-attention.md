---
title: "About DeepSeek Sparse Attention"
date: 2025-09-30T14:57:00+02:00
---

[DeepSeek Sparse Attention](https://github.com/deepseek-ai/DeepSeek-V3.2-Exp/blob/main/DeepSeek_V3_2.pdf), some considerations about it after reading the paper. 

[DeepSeek-V3.2-Exp](https://sibellavia.lol/notes/2025/09/30/deepseek-v3.2-exp-claude-sonnet-4.5-and-more/) is defined as an *experimental sparse-attention model*. Its architecture is the same as DeepSeek-V3.1-Terminus, except for the introduction of DeepSeek Sparse Attention (DSA). The core idea is to reduce the number of key-value pairs each query token looks at, instead of attending to all tokens. Sparse attention only computes a subset of entries, making long-context reasoning more feasible. 

Most sparse methods fix a pattern, but DSA is dynamic. It is composed by (i) a lightning indexer that computes a lightweight index score between query and candidate tokens, and selects the top-k most relevant tokens per query; (ii) a fine-grained token seelction mechanism that retrieves only the key-value entries corresponding to the top-k index score. From what I can understand, each query chooses its own set of tokens. The main advantage is that it's more adaptive, because it's based on a query-specific selection rather than fixed pattern. But this introduces the need of an extra module (the indexer) and its own training. Also, some performance drops in reasoning-heavy tasks if too few tokens are selected, but this small aspect is negligible in the whole context. I think that this suggests that DSA prunes aggressively but sometimes removes "useful but not obviously important" context tokens. 

More about the lightning indexer: it is implemented with few heads and even in FP8. I think it's a smart design choice. It's lightweight enough not to negate efficiency gains, and it offers adaptive sparsity. 

My takeaway for now is that hybridization is the practical path, in my opinion it is unavoidable. We've seen Qwen-Next models using hybrid layers, and I really like that solution, the models perform pretty well. Nevertheless, I like DSA and I think it's compelling because it can be introduced via continued training, meaning the model doesn't lose what it already learned under dense attention. 




