import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from 'remark';
import remarkPrism from "remark-prism";
import html from "remark-html";

const postsDirectory = path.join(process.cwd(), "posts");

export function getSortedPostsData() {
  // ottengo i nomi dei file nella directory dei post
  const fileNames = fs.readdirSync(postsDirectory);

  // ottengo i dati di ogni post
  const allPostsData = fileNames.map((fileName) => {
    // rimuovo ".md" dall'estensione del file per ottenere lo slug
    const slug = fileName.replace(/\.md$/, "");

    // leggo il contenuto del file
    const fileContents = fs.readFileSync(
      path.join(postsDirectory, fileName),
      "utf8"
    );

    // uso gray-matter per analizzare la sezione dei metadati del post
    const { data } = matter(fileContents);

    // combino i dati con lo slug
    return {
      slug,
      ...data,
    };
  });

  // ordino i post per data
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getAllPostSlugs() {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.map((fileName) => ({
    params: {
      slug: fileName.replace(/\.md$/, ""),
    },
  }));
}

export async function getPostData(id) {
    const fullPath = path.join(postsDirectory, `${id}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
  
    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);
  
    // Use remark to convert markdown into HTML string
    const processedContent = await remark()
      .use(html, { sanitize: false })
      .use(remarkPrism, { plugins: ["line-numbers"] })
      .process(matterResult.content);
    const contentHtml = processedContent.toString();
  
    // Combine the data with the id and contentHtml
    return {
      id,
      contentHtml,
      ...matterResult.data,
    };
  }
