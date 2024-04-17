'use server'
import { serverClient } from "@/utils/supabase/server";
import Fuse from "fuse.js";

interface Props {
  searchQuery: string;
}
export async function FuseSearchTopics({ searchQuery }: Props) {
  const supabase = serverClient()
  const { data: topics, error } = await supabase
  .from('topics')
  .select('*')
  .match({ slug: `%${searchQuery}%` });

  const AllTopics = topics!.map((topic) => ({
    id: topic.id,
    slug: topic.slug,
  }));
  const fuse = new Fuse(AllTopics, {
    keys: ["slug"],
    includeScore: true,
    isCaseSensitive: false,
    shouldSort: true,
    minMatchCharLength: 1,
    location: 0,
  });

  const results = fuse.search(searchQuery);
  return results.map((result) => result.item);
}
