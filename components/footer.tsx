"use client";
import { Button } from "./ui/button";
import * as React from "react";


export default function Footer() {
    const [darkMode, setDarkMode] = React.useState<'Light' | 'Dark' | null>(null);

    React.useEffect(() => {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setDarkMode(isDark ? 'Dark' : 'Light');
    }, []);
    const toggleDark = () => {
        document.documentElement.classList.toggle('dark');
        setDarkMode(darkMode === 'Dark' ? 'Light' : 'Dark');
    };
    return (
        <footer className="w-full border-t mt-10 sticky bottom-0 bg-secondary">
            <div className="flex flex-col md:flex-row items-center justify-between py-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    &copy; {new Date().getFullYear()} Samuel Goldsmith. All rights reserved.
                </p>
                <Button className="ml-auto mr-5" onClick={toggleDark}>{darkMode}</Button>
            </div>
        </footer>
    );
}