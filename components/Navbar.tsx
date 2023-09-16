import Link from "next/link";
import React from "react";

export default function Navbar() {
  return (
    <nav className="py-4">
      <div className="container flex flex-row items-center justify-between mx-auto">
        <div>
          <Link href={"/"}>Home</Link>
        </div>
        <div>
          <ul className="flex flex-row items-center">
            <li className="m-2 p-2">
              <Link href={"/"}>Home</Link>
            </li>
            <li className="m-2 p-2">
              <Link href={"https://github.com/"}>GitHub</Link>
            </li>
            <li className="m-2 p-2">
              <Link href={"https://www.google.com/"}>Google</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
