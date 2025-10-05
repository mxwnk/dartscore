'use client';
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
    const { theme, resolvedTheme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <Button className="cursor-pointer" type="button" aria-label="Toggle theme" variant="ghost" size="icon">
                <Sun className="opacity-0" />
            </Button>
        );
    }

    const isDark = (theme === 'system' ? resolvedTheme : theme) === 'dark';

    return (
        <Button
            className="cursor-pointer"
            type="button"
            aria-label="Toggle theme"
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            variant="ghost"
            size="icon"
        >
            {isDark ? <Moon /> : <Sun />}
        </Button>
    );
}