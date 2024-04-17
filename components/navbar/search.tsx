"use client";
import { useState, useEffect, useMemo, useRef } from "react";
import { FuseSearch } from "@/lib/fuse-search";
import { Button } from "../ui/button";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useDebounce } from "use-debounce";
import { useRouter } from "next/navigation";
import { Input } from "../ui/input";
import { SearchIcon } from "lucide-react";
import { UserAvatar } from "../userAvater";

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

const SearchModal = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);
  const [activeTab, setActiveTab] = useState("users");

  const modalRef = useRef(null); // Ref for the modal div

  const handleClickOutside = (event: MouseEvent) => {
    const modalNode = modalRef.current as HTMLDivElement | null;

    if (modalNode && !modalNode.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const performSearch = async () => {
      if (debouncedSearchQuery) {
        const results = await FuseSearch({ searchQuery: debouncedSearchQuery });
        setSearchResults(results);
      } else {
        setSearchResults([]);
      }
    };

    if (debouncedSearchQuery.length > 1) {
      performSearch();
    } else {
      setSearchResults([]);
    }
    performSearch();
  }, [debouncedSearchQuery]);

  const filteredUsers = useMemo(
    () =>
      searchResults.filter(
        (result): result is UserResult => result.type === "User"
      ),
    [searchResults]
  );

  const filteredTopics = useMemo(
    () =>
      searchResults.filter(
        (result): result is TopicResult => result.type === "Topic"
      ),
    [searchResults]
  );

  const filteredPosts = useMemo(
    () =>
      searchResults.filter(
        (result): result is PostResult => result.type === "Post"
      ),
    [searchResults]
  );

  return (
    <>
      <Button onClick={() => setIsOpen(!isOpen)} className="p-0 bg-transparent hover:bg-transparent" size={'icon'}>
        <SearchIcon className="w-7 h-7 text-white" />
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 flex justify-center items-center">
          <div
            ref={modalRef}
            className="bg-card p-2 rounded-md max-w-md w-full"
          >
            <Input
              type="text"
              placeholder="Search..."
              className="w-full p-2 rounded-md"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <div className="grid w-full grid-cols-3  h-10 items-center justify-center bg-card p-1 text-muted-foreground">
              <button
                className={`"inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" ${
                  activeTab === "users"
                    ? "bg-background text-foreground shadow"
                    : ""
                }`}
                onClick={() => setActiveTab("users")}
              >
                Users
              </button>
              <button
                className={`"inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 " ${
                  activeTab === "topics"
                    ? "bg-background text-foreground shadow"
                    : ""
                }`}
                onClick={() => setActiveTab("topics")}
              >
                Topics
              </button>
              <button
                className={`"inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" ${
                  activeTab === "posts"
                    ? "bg-background text-foreground shadow"
                    : ""
                }`}
                onClick={() => setActiveTab("posts")}
              >
                Posts
              </button>
            </div>

            <>
              {searchQuery && (
                <>
                  {activeTab === "users" && (
                    <div className=" p-2 bg-background rounded-md">
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                          <div
                            key={user.id}
                            className="flex items-center space-x-2 hover:bg-muted cursor-pointer h-12 rounded-md "
                            onClick={() => {
                              router.push(`/profile/${user.username}`);
                              setIsOpen(false);
                            }}
                          >
                            <UserAvatar
                              src={user.avatar_url}
                              className="h-10 w-10 cursor-pointer"
                            />
                            <div className="flex flex-col gap-1">
                              <span>
                                {user.firstname} {user.lastname}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                @{user.username}
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-center">No users found.</p>
                      )}
                    </div>
                  )}

                  {activeTab === "topics" && (
                    <div className=" gap-2 grid w-full grid-cols-2 p-2 bg-background rounded-md">
                      {filteredTopics.length > 0 ? (
                        filteredTopics.map((topic) => (
                          <div
                            className="flex items-center space-x-2 bg-card hover:bg-muted cursor-pointer h-12 rounded-md "
                            onClick={() => {
                              router.push(`/topics/${topic.slug}`);
                              setIsOpen(false);
                            }}
                            key={topic.id}
                          >
                            <div className="pl-2">
                              <Avatar className="w-5 h-5">
                                <AvatarImage src={topic.image || undefined} />
                                <AvatarFallback>Z</AvatarFallback>
                              </Avatar>
                            </div>
                            <div className="flex flex-col gap-1 p-2">
                              <span>z/{topic.slug}</span>
                              <span className="text-xs text-muted-foreground text-ellipsis break-words w-full">
                                {topic.description}
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-center">No topics found.</p>
                      )}
                    </div>
                  )}

                  {activeTab === "posts" && (
                    <div className="p-2 bg-background rounded-md ">
                      {filteredPosts.length > 0 ? (
                        filteredPosts.map((post) => (
                          <div
                            key={post.id}
                            className="flex items-center space-x-2 hover:bg-muted cursor-pointer p-2 rounded-md break-words w-full"
                            onClick={() => {
                              router.push(
                                `/topics/${post.slug}/post/${post.id}`
                              );
                              setIsOpen(false);
                            }}
                          >
                            {post.content.length > 70
                              ? post.content.substring(0, 70) + "..."
                              : post.content}
                          </div>
                        ))
                      ) : (
                        <p className="text-center">No posts found.</p>
                      )}
                    </div>
                  )}
                </>
              )}
            </>
          </div>
        </div>
      )}
    </>
  );
};

export default SearchModal;
