---
title: "About Netyzer"
date: "2023-04-24"
---

Hey there,

Long time no see! Today I would like to talk about my new project. I named it Netyzer (from NETwork analYZER). It will be a network packet analyzer, like Wireshark. But it will be more essential, lightweight and fast, and only usable through CLI.

Why? Wireshark, TCPdump, Solarwind NPS are all great tools, and I don't want to write a competing tool to replace them. Everyone uses Wireshark, it's well consolidated, and there's no need to create an alternative.

I just want to deepen my knowledge in computer networking, and I also want to practice a low-level programming language like C. I started programming with C, I have a kind of affection for it. C allows you to get in touch with the "carnality" of your machine, you could see the bytes running together. I love it.

This need made me start writing Netyzer. To put into practice and touch with my bare hands what I'm studying, and to offer an open source alternative to those who want to use it.

## What Netyzer will be

Other tools like Netyzer already exist. They are stable, open source and largely supported by the community. So I don't think that Netyzer will be used by developers other than me. In fact, I'm planning to write it for educational purposes.

But writing a software that is an exact copy of existing projects would be boring for me. So I thought about some features that could make Netyzer unique.

I want Netyzer to be a lightweight, multi-platform tool. Easy to integrate into existing pipelines, fast and customizable. It won't have a GUI and will live in a CLI. The features that will be implemented will be the essential ones for a packet analyzer tool.

Netyzer will make extensive use of the [lipbcap](https://www.tcpdump.org/) library.

Netyzer is a project that started as a self-study, and only later could it offer itself as a real productive tool (I would love to, but that is not the primary goal).

So the code may not be of high quality. It may contain bugs and errors. It may be inelegant, and striving for clean code is one of my goals.

Right now I'm thinking about implementing these features:

1. Packet visualization;
2. Packet analysis;
3. Search for specific packets;
4. Saving packets to a file;
5. Filters to capture specific packets.

As I write this, I'm working on the first feature.

## The beauty of coding

I don't have a strict timeline. I don't want to rush things. I want to enjoy my coding times and to learn to use C in the best way I can. I want to learn how to write code in a more elegant and refined way, and I want to discover the beauty of implementing certain algorithms and data structures by getting as close to machine language as possible.

And if this tool will be useful for someone, I will be only happy about it!

## Open source, baby

Netyzer is an open source project. Feel free to contribute with code and suggestions, if you want to. [Have a look to its repository.](https://github.com/simoneb1x/netyzer)

Thank you for reading this far. See you soon!