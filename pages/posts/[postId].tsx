import { getMyPost } from "@/lib/notion";
import React from "react";

export async function getStaticPaths() {
  return {
    paths: [
      { params: { postId: "2b6fa022-a65e-4a7d-b8e3-cfc1f05c425a" } },
      { params: { postId: "59455f49-f0ea-4adb-a2f3-45747fe7338e" } },
      { params: { postId: "03b170bf-f6b6-4f19-aeb8-f3e86dc48120" } },
    ],
    fallback: "blocking",
  };
}

export async function getStaticProps({
  params,
}: {
  params: { postId: string };
}) {
  const post = await getMyPost(params.postId);
  return {
    props: {
      post,
    },
    revalidate: 10,
  };
}

export default function PostDetail(props: { posts: number }) {
  return (
    <section className="container mt-10 p-4">
      <p className="text-3xl underline font-bold">this is title</p>
      <p className="mb-4">2023-2010</p>
      <span className="bg-gray-500 rounded p-1 mr-1">aaa</span>

      <div className="mt-10">asdfasdf asdfasdf</div>
    </section>
  );
}
