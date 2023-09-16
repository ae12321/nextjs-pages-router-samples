import Link from "next/link";
import React from "react";

export default function Pagenation(props: { maxPage: number }) {
  console.log(props.maxPage);
  return (
    <div>
      <ul className="flex flex-row items-center justify-center gap-4">
        {[...Array(props.maxPage)].map((_, i) => {
          const index = i + 1;
          return (
            <li
              key={index}
              className="bg-amber-500 h-8 w-6 rounded-lg relative"
            >
              <Link
                href={`/posts/page/${index}`}
                className="absolute top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4"
              >
                {index}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
