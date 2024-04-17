'use client'
import { useTopic } from '@/lib/store/topics'
import React from 'react'
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { BentoGrid, BentoGridItem } from "../ui/bento-grid";
import Image from "next/image";

export default function ShowAllTopics() {
    const {topic} = useTopic((state) => state)
    let [hoveredIndex, setHoveredIndex] = useState<string | null>(null);
  return (
    <BentoGrid className="w-full mx-auto md:auto-rows-[20rem] p-4">
    {topic?.map((item) => (
      <Link
        href={`topics/${item.slug}`}
        key={item?.id}
        className="relative group block p-1 h-full w-full"
        onMouseEnter={() => setHoveredIndex(item.id!)}
        onMouseLeave={() => setHoveredIndex(item.id!)}
      >
        <AnimatePresence>
          {hoveredIndex === item.id && (
            <motion.span
              className="absolute -z-10 inset-0 h-full w-full bg-accent block  rounded-md"
              layoutId="hoverBackground"
              initial={{ opacity: 0 }}
              animate={{
                opacity: 0.8,
                transition: { duration: 0.15 },
              }}
              exit={{
                opacity: 0,
                transition: { duration: 0.15, delay: 0.2 },
              }}
            />
          )}
        </AnimatePresence>
        <BentoGridItem
          key={item.id}
          header={
            <Image
              src={item.image as string}
              alt="topic image"
              fill
              className="rounded-md h-12 w-12 object-cover"
            />
          }
          description={item.description}
          title={item.slug}
          className="md:col-span-1 w-full h-full"
        />
      </Link>
    ))}
  </BentoGrid>
  )
}
