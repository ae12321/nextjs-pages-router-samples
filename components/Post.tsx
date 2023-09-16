import Link from "next/link";

export default function Post(props: { post: MyPost }) {
  return (
    <section className=" bg-lime-500 rounded-lg p-4 mb-4 hover:translate-y-1 transition-all duration-300">
      <div>
        <p className="text-xs">{props.post.createdAt}</p>
        <Link href={`/posts/${props.post.id}`}>
          <p className="text-2xl">{props.post.title}</p>
        </Link>
        {props.post.tags.map((tag, index) => (
          <span key={index} className="bg-gray-500 rounded p-1 mr-1">
            {tag}
          </span>
        ))}
      </div>
      <p>{props.post.description}</p>
    </section>
  );
}
