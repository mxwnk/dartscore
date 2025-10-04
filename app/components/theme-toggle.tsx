'use client';
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const Icon = theme === 'dark' ? Moon : Sun;
    return (
        <Button className="cursor-pointer" type="button"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} variant="ghost" size="icon">
            <Icon />
        </Button>
    );
}