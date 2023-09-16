import Head from "next/head";
import {
  PAGE_SIZE,
  getMyPosts,
  getMyPostsForTopPage,
  getMyPostsWithPagenation,
} from "../../../lib/notion";
import Post from "@/components/Post";
import { GetStaticPaths, GetStaticProps } from "next";
import Pagenation from "./pagenation";

export async function getStaticPaths() {
  const posts = await getMyPosts();
  let pages = Math.floor(posts.length / PAGE_SIZE);
  if (pages * PAGE_SIZE !== posts.length) {
    pages++;
  }
  const paths = [...Array(pages)].map((_, i) => {
    return {
      params: { page: (i + 1).toString() },
    };
  });

  return {
    paths,
    fallback: "blocking",
  };
}

export async function getStaticProps({ params }: { params: { page: string } }) {
  const current = params?.page;
  const posts = await getMyPostsWithPagenation(+current);
  let pages = Math.floor(posts.length / PAGE_SIZE);
  if (pages * PAGE_SIZE !== posts.length) {
    pages++;
  }
  return {
    props: {
      posts,
      maxPage: pages,
    },
    revalidate: 10,
  };
}

export default function Pages({
  posts,
  maxPage,
}: {
  posts: MyPost[];
  maxPage: number;
}) {
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

      <Pagenation maxPage={3} />
    </div>
  );
}
