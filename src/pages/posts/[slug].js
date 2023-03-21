import { useRouter } from 'next/router'
import Layout from "../../components/Layout"
import { getPostData, getAllPostSlugs } from '../../../lib/posts'
import Link from "next/link"

export default function Post({ postData }) {
  const router = useRouter()

  if (router.isFallback) {
    return <div>Loading...</div>
  }

  return (
    <Layout>
      <div className="pb-8">
        <Link href="/">cd ../</Link>
      </div>
      <h1 className="text-4xl font-semibold mb-4">{postData.title}</h1>
      <p className="text-gray-600 mb-8">{postData.date}</p>
      <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
    </Layout>
  );
}

export async function getStaticPaths() {
  const paths = getAllPostSlugs()
  return {
    paths,
    fallback: true
  }
}

export async function getStaticProps({ params }) {
  const postData = await getPostData(params.slug)
  return {
    props: {
      postData
    }
  }
}
