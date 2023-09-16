import { getMyPost, getMyPostDetail, getMyPosts } from "@/lib/notion";
import { spawn } from "child_process";
import Link from "next/link";
import React from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// いいなと思った: okaidia, prism, oneDark, coldarkDark, darcula, dracula, materialDark, tomorrow
import { okaidia as themeColor } from "react-syntax-highlighter/dist/cjs/styles/prism";

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

      <div>
        <ReactMarkdown
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "");
              return !inline && match ? (
                <SyntaxHighlighter
                  {...props}
                  // children={}
                  style={themeColor}
                  language={match[1]}
                  PreTag="div"
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              ) : (
                <code {...props} className={className}>
                  {children}
                </code>
              );
            },
          }}
        >
          {props.detail}
        </ReactMarkdown>
        <Link href={"/"} className="block mt-4 text-blue-800">
          ←戻る
        </Link>
      </div>
    </section>
  );
}
