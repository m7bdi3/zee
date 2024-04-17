"use client";
import React from "react";
import PostCreateForm from "./create-post-form";
import { Card } from "../ui/card";

export default function HomePostForm() {
  return (
    <div>
      <Card className="flex w-full p-3">
        <PostCreateForm isHome={true} />
      </Card>
    </div>
  );
}
