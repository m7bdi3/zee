"use server";

import { serverClient } from "@/utils/supabase/server";
import Fuse from "fuse.js";

type UserResult = {
  id: string;
  username: string;
  avatar_url: string;
  firstname: string;
  lastname: string;
  type: "User";
};

type PostResult = {
  id: string;
  content: string;
  slug: string;
  type: "Post";
};

type TopicResult = {
  id: string;
  slug: string;
  description: string;
  image: string;
  type: "Topic";
};

type SearchResult = UserResult | PostResult | TopicResult;

async function fuseSearchModels(query: string): Promise<SearchResult[]> {
  if (!query) return [];
  const supabase = serverClient();

  const [users, posts, topics] = await Promise.all([
    await supabase
      .from("profiles")
      .select("id, username, avatar_url, firstname, lastname")
      .ilike("username", `%${query}%`),
    await supabase
      .from("posts")
      .select("id, content, slug")
      .ilike("content", `%${query}%`),

    await supabase
      .from("topics")
      .select("id, slug, description, image")
      .ilike(`slug`,`%${query}%`),
  ]);

if(users.error){
  console.log(users.error);
}
  const userResults: UserResult[] = users.data!.map((user) => ({
    id: user.id,
    username: user.username,
    avatar_url: user.avatar_url!,
    firstname: user.firstname!,
    lastname: user.lastname!,
    type: "User",
  }));

  const postResults: PostResult[] = posts.data!.map((post) => ({
    id: post.id,
    content: post.content,
    slug: post.slug,
    type: "Post",
  }));

  const topicResults: TopicResult[] = topics.data!.map((topic) => ({
    id: topic.id,
    slug: topic.slug,
    description: topic.description,
    image: topic.image,
    type: "Topic",
  }));
  return [...userResults, ...postResults, ...topicResults];
}
export async function FuseSearch({ searchQuery }: { searchQuery: string }) {
  const items = await fuseSearchModels(searchQuery);

  const fuse = new Fuse(items, {
    keys: ["username", "slug", "content"],
    includeScore: true,
    useExtendedSearch: true,
    ignoreLocation: true,
    threshold: 0.2,
    minMatchCharLength: 2,
    shouldSort: true,
    location: 0,
    distance: 100,
  });

  const results = fuse.search(searchQuery);
  return results.map((result) => result.item);
}
