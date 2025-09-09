---
title: "Helm: what I like and dislike"
date: "2025-06-22"
---

I have been working with Helm for some time now and I've developed a love-hate relationship with it. It seems to have become the de-facto package manager for K8s, and there are good reasons for that. But like any tool, it comes with its own set of frustrations that can make you question your life choices. Some honest thoughts follow. 

## What I like

I find Helm to be fairly simple to get started. For all its complexity under the hood, Helm has a gentle learning curve in my opinion. You can start deploying applications with basic `helm install` commands, then gradually learn about values, dependencies, and templating (unlucky) as they need to.

Dependency management is good. Helm dependencies solve this quite elegantly, handling resolution, download and installation. 

Multi-environment support lets you deploy the same chart with different configurations. It's a good feature when you are forced to deal with multiple environments. Also, in that regard rollbacks sometimes save you. `helm rollback app 3` and that's it. You're back at revision 3. It just works.

## What I don't like 

At the same time, I think Helm has fundamental design flaws that make it increasingly unsuitable for managing complex applications in modern, stratified infrastructures. First one: Go templating system. It is Helm's biggest strength and its greatest weakness. It offers immense flexibility which is necessary for complex applications, but it results in code that is hard to reason about. The syntax is unintuitive and verbose, error messages are cryptic and unhelpful. Which value is nil? What's the context? Why can't I just get a proper stacktrace? It's not rare to end up debugging templates and ending up commenting out sections and re-rendering repeatedly. This happened because I guess it was a natural choice to inherit Go templates, since they are "native". In any case, the fundamental issue isn't just that Go templates are bad, it's that templating YAML is inherently problematic. It often leads to indentation bugs that break file-parsing and difficulty validating templates before rendering. 

I don't know if I am the only one, but I miss some kind of Drift detection logic. Someone manually edits a deployment and Helm has no idea. The next `helm upgrade` might work, might partially fail, or might silently ignore the drift. The fact is that in complex installations with numerous microservices and dependencies, manual interventions are often necessary because Helm lacks native installation ordering. When one service fails to start while waiting for dependencies, the pragmatic solution is manual editing—but this silently breaks Helm's understanding of your system state.

Helm's approach to secrets is "just base64 encode it and hope for the best." Tools like Helm Secrets exist, but they feel like band-aids on a fundamental design issue. 

Helm is purely client-side and imperative, even if we consider it as partially-declarative. This goes back to point 3. Helm fires commands and just trusts that what it thinks is deployed actually matches reality. Also, everything requires manual intervention. In fact, many teams end up with (imho) awkward combinations: ArgoCD + Helm, Flux + Helm, or just Helm + CI/CD. The fact that we're retrofitting declarative behavior onto an imperative tool shows just how much the ecosystem has evolved past Helm's original assumption. 

Helm doesn't manage an install order or readiness. Helm simply ensures the sub-charts are included in the final rendered manifests. There is absolutely no guarantee of install order or readiness. As I said in point 3 I think, you usually solve this with hacks like init containers, complex readiness probes, or by running multiple `helm install` commands in a specific order. I don't like it. 

## The Alternative

I don't have an alternative as of now. Also, I don't think there could be a better, community-supported alternative to Helm. Not because I think it's not feasible, quite the contrary! Helm is widely used at the enterprise level and is fully supported by the CNCF, so I just believe that an alternative must be truly worthwhile to justify a change. In any case, I believe that the next step beyond Helm is a native Kubernetes system that uses CRDs, is declarative, and imposes a package structure standard similar to Linux. I hope to be able to create a proof of concept in the future :-)
