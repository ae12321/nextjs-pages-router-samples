import { Client } from "@notionhq/client";
import { NOTION_DATABASE_ID, NOTION_TOKEN } from "@/lib/constant";
import {
  GetPagePropertyResponse,
  GetPageResponse,
  PageObjectResponse,
  PartialPageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { NotionToMarkdown } from "notion-to-md";

export const PAGE_SIZE = 4;

const notion = new Client({
  auth: NOTION_TOKEN,
});

const n2m = new NotionToMarkdown({ notionClient: notion });

function getMetadata(page: PageObjectResponse): MyPost {
  const id = page.id;
  let title = "";
  if (page.properties.Name.type === "title") {
    title = page.properties.Name.title[0].plain_text;
  }
  let description = "";
  if (page.properties.Description.type === "rich_text") {
    description = page.properties.Description.rich_text[0].plain_text;
  }
  let tags: string[] = [];
  if (page.properties.Tags.type === "multi_select") {
    tags = page.properties.Tags.multi_select.map((tag) => tag.name);
  }
  let isPublish = false;
  if (page.properties.IsPublish.type === "checkbox") {
    isPublish = page.properties.IsPublish.checkbox;
  }
  const createdAt = format(new Date(page.created_time), "yyyy-MM-dd", {
    locale: ja,
  });
  const updatedAt = format(new Date(page.last_edited_time), "yyyy-MM-dd", {
    locale: ja,
  });

  return {
    id,
    title,
    description,
    tags,
    isPublish,
    createdAt,
    updatedAt,
  };
}

export async function getTags(): Promise<Tag[]> {
  const res = await notion.databases.query({
    database_id: NOTION_DATABASE_ID,
  });
  const records = res.results as PageObjectResponse[];

  const allTags = records.reduce((acc: string[], record) => {
    if (record.properties.Tags.type !== "multi_select") return acc;

    record.properties.Tags.multi_select.map((tag) => {
      const newTagName = tag.name;
      if (acc.includes(newTagName)) return;
      acc.push(newTagName);
    });

    return acc;
  }, []);

  return allTags.sort((a, b) => a.localeCompare(b));
}

export async function getMyPosts() {
  const res = await notion.databases.query({
    database_id: NOTION_DATABASE_ID,
  });

  const pages = res.results as PageObjectResponse[];

  const myPosts = pages.reduce((acc: MyPost[], page) => {
    const myPost = getMetadata(page);
    // titleが空（未入力レコードと判断）は出力対象外
    if (myPost.title === "") {
      return acc;
    }

    acc.push(myPost);
    return acc;
  }, []);

  return myPosts;
}

export async function getMyPost(postId: string) {
  const page = (await notion.pages.retrieve({
    page_id: postId,
  })) as PageObjectResponse;

  const post = getMetadata(page);

  const blocks = await n2m.pageToMarkdown(post.id);
  const mdString = n2m.toMarkdownString(blocks);
  console.log(mdString);

  return post;
}

export async function getMyPostDetail(postId: string) {
  const blocks = await n2m.pageToMarkdown(postId);
  const { parent } = n2m.toMarkdownString(blocks);

  return parent;
}

export async function getMyPostsForTopPage(pageSize = PAGE_SIZE) {
  const posts = await getMyPosts();
  const filtered = posts.slice(0, pageSize);
  return filtered;
}

export async function getMyPostsWithPagenation(pageNumber: number) {
  // とりあえずまずはすべての記事を引っ張り加工する
  const posts = await getMyPosts();

  const start = (pageNumber - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;

  const filtered = posts.slice(start, end);
  return filtered;
}
