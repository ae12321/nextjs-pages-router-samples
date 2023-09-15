import { getMyPost, getMyPostDetail, getMyPosts } from "@/lib/notion";
import { spawn } from "child_process";
import React from "react";

export async function getStaticPaths() {
  const posts = await getMyPosts();
  const paths = posts.map(({ id }) => ({ params: { postId: id } }));

  return {
    paths,
    fallback: "blocking",
  };
}

export async function getStaticProps({
  params,
}: {
  params: { postId: string };
}) {
  const post = await getMyPost(params.postId);
  const detail = await getMyPostDetail(params.postId);
  return {
    props: {
      post,
      detail,
    },
    revalidate: 10,
  };
}

export default function PostDetail(props: { post: MyPost; detail: string }) {
  return (
    <section className="container mt-10 p-4">
      <p className="text-3xl underline font-bold">{props.post.title}</p>
      <p className="mb-4">{props.post.createdAt}</p>
      <div className="">
        {props.post.tags.map((tag, index) => (
          <span key={index} className="bg-gray-500 rounded p-1 mr-1">
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-10">{props.post.description}</div>

      <div>{props.detail}</div>
    </section>
  );
}
