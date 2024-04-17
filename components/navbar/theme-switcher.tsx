"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import {
  DropdownMenuItem,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
import { MoonIcon, SunIcon } from "lucide-react";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {theme === "light" && (
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Light
          <DropdownMenuShortcut>
            <SunIcon className="h-5 w-5 p-0 m-0 text-foreground" />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      )}

      {theme === "dark" && (
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Dark
          <DropdownMenuShortcut>
            <MoonIcon className="h-5 w-5 text-foreground p-0 m-0" />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      )}
    </>
  );
}
