"use client";
import type { Metadata } from "next";
import *  as React from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
}
from "@/components/ui/navigation-menu"
import Link from "next/link";
import Projects from "@/components/projects";
import Expieriences from "@/components/expieriences";
import { Button } from "@/components/ui/button";

const resume: { title: string; href: string; description: string }[] = [
  {
    title: "Interactive Resume",
    href: "/resume/interactive",
    description:
      "An interactive resume that showcases my skills and experience with descriptions and examples.",
  },
  {
    title: "Resume PDF",
    href: "/resume/resume.pdf",
    description:
      "Download my resume in PDF format.",
  },
  {
    title: "Interactive Transcript",
    href: "/transcript/interactive",
    description:
      "An interactive transcript that showcases my skills and experience with descriptions, examples and links to related projects.",
  },
  {
    title: "Transcript PDF",
    href: "/transcript/transcript.pdf",
    description: "Download my transcript in PDF format.",
  },
];

export default function Navbar() {
  return (
        <NavigationMenu>
          <NavigationMenuList>

            <NavigationMenuItem>
              <NavigationMenuLink asChild><Link href="/">Home</Link></NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger>Resume</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  {resume.map((item) => (
                    <ListItem
                      key={item.title}
                      title={item.title}
                      href={item.href}
                    >
                      {item.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger>Projects</NavigationMenuTrigger>
              <NavigationMenuContent>
                <Projects />
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Expieriences</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-1 lg:w-[600px]">
                  <Expieriences />
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
                <NavigationMenuLink asChild><Link href="/about">About Me</Link></NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
            <NavigationMenuLink asChild><Link href="/contact">Contact</Link></NavigationMenuLink>
            </NavigationMenuItem>

          </NavigationMenuList>

        </NavigationMenu>
  );
}

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link href={href}>
          <div className="text-sm leading-none font-medium">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  )
}