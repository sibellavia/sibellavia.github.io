---
title: 'From Next.js to Hugo'
date: '2021-12-12'
id: 'from-nextjs-to-hugo'
---

I published this blog on the web on April 10, 2021. In those weeks I had done some scouting of the different Static Site Generators, I also talked about them [in this post](first-post.md) which by the way is the first one I published. I had chosen to use Next.js because it allowed me to be able to write code in React and TypeScript. A few days ago, however, I decided to change and switch to Hugo. I'll explain why.

## My experience with Next.js

It was fun to build the blog with Next.js. The only problem was that a lot of the functionality had to be written completely from scratch. The supporting documentation is great, but the plugin and themes presence isn't as good as Gatsby or Hugo. I needed an even more stable framework, and one that would reduce the amount of time I had to spend. Blogging is a passion of mine, but I don't have the time to write as much content as I want to. In parallel I have a job and a university course to follow. For this reason I liked the idea of having a stable product, and that with monthly sprints (just to think in agile) it could be technically updated by small increments. So that I can focus more on the content and less on the extra builds and features that need to be added.

## Diving into Hugo

After several days, looking deep into [Hugo](https://gohugo.io/) and especially Golang, I decided to build the blog from scratch and change framework. Writing code with Hugo as underlying layer is very satisfying: as I said before, it's not based on JavaScript but on a Go-based HTML. The syntax is very simple and the potential is interesting. The management of the architecture through the [Hugo Modules](https://gohugo.io/hugo-modules/) surprised me a lot for how simple and effective it is. In short, it has convinced me since the beginning. Let's be clear, even Hugo has some limits. But compared to Next.js it seems to me much more suitable for my blog and for my needs. It is important to specify that there are no frameworks or languages that are better than others, but there are those that are better suited to certain needs. For the moment, I don't need all the extra declinations and flexibility that React can give, because I don't have the time to take advantage of it.

Getting started with Hugo is super easy. You must clearly install it:

    brew install hugo

After installing it, you create your new site with a command that creates the root folder with its internal scaffolding:

    hugo new site awesomewebsite

Inside it, the directory structure contains all the elements you need for development:

    .
    ├── archetypes
    ├── config.toml
    ├── content
    ├── data
    ├── layouts
    ├── static
    └── themes

Hugo’s CLI scaffolds a project directory structure and then takes that single directory and uses it as the input to create a complete website.
All content lives inside the `/content/` folder, which contains all posts and articles in markdown, and any secondary pages. Templates are stored in `/layouts/`. You can retrieve an existing theme from GitHub and insert it as a submodule:

    git init
    git submodule add https://github.com/your-theme/your-favorite-theme.git themes/your-theme

The server locally starts with a command, and you can also add the -D flag to keep drafts active:

    hugo server -D

And the build is just as simple:

    hugo -D

The output will be transmitted to the `/public/` folder by default. 

If you want to learn more, [I refer you to the official Hugo documentation.](https://gohugo.io/getting-started/) Any other minor updates regarding my blog will be published as a series. 

Thank you for reading this far. Seeya!
