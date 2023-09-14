import { Client } from "@notionhq/client";
import { NOTION_DATABASE_ID, NOTION_TOKEN } from "@/lib/constant";
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

const notion = new Client({
  auth: NOTION_TOKEN,
});

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

  const records = res.results as PageObjectResponse[];

  const myPosts = records.reduce((acc: MyPost[], record) => {
    const id = record.id;

    let title = "";
    if (record.properties.Name.type === "title") {
      title = record.properties.Name.title[0].plain_text;
    }
    // 空行やタイトルが空の場合、投稿とはみなさない
    if (title === "") return acc;

    let description = "";
    if (record.properties.Description.type === "rich_text") {
      description = record.properties.Description.rich_text[0].plain_text;
    }

    let tags: string[] = [];
    if (record.properties.Tags.type === "multi_select") {
      tags = record.properties.Tags.multi_select.map((tag) => tag.name);
    }

    let isPublish = false;
    if (record.properties.IsPublish.type === "checkbox") {
      isPublish = record.properties.IsPublish.checkbox;
    }
    let createdAt = format(new Date(record.created_time), "yyyy-MM-dd", {
      locale: ja,
    });
    let updatedAt = format(new Date(record.last_edited_time), "yyyy-MM-dd", {
      locale: ja,
    });

    acc.push({
      id,
      title,
      description,
      tags,
      isPublish,
      createdAt,
      updatedAt,
    });

    return acc;
  }, []);

  return myPosts;
}
