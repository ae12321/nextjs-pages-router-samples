import Head from "next/head";
import { getMyPosts, getMyPostsForTopPage } from "../lib/notion";
import Post from "@/components/Post";

export async function getStaticProps() {
  const posts = await getMyPostsForTopPage(5);
  return {
    props: {
      posts,
    },
    revalidate: 10,
  };
}

export default function Home({ posts }: { posts: MyPost[] }) {
  console.log(posts);
  return (
    <div className="container w-full h-full mx-auto">
      <Head>
        <title>notion-blog</title>
        <meta name="description" content="aaa" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container w-full">
        <h1 className="text-2xl text-center w-full">hello, world</h1>
        {posts.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </main>
    </div>
  );
}
