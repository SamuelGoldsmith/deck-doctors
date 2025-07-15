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

const gallery: { title: string; href: string; description: string }[] = [
  {
    title: "Deck Restoration",
    href: "/gallery/deck-restoration",
    description:
      "See our gallery of deck restoration projects, showcasing shocking before and after images.",
  },
  {
    title: "Mailboxes",
    href: "/gallery/mailboxes",
    description:
      "Explore our collection of custom mailboxes installs, designed to enhance curb appeal and functionality.",
  },
  {
    title: "New Builds",
    href: "/gallery/new-builds",
    description:
      "Discover our new builds gallery, featuring a range of custom decks and outdoor structures.",
  },
  {
    title: "Other Projects",
    href: "/gallery/other-projects",
    description: "Browse our other projects, and unique outdoor solutions.",
  },
];

export default function Navbar() {
  return (
    <div className="w-full bg-primary text-primary-foreground shadow-lg">
      <div className="fixed top-0 w-full bg-primary text-primary-foreground shadow-lg">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink asChild><Link href="/">Home</Link></NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger className="bg-primary text-primary-foreground">Gallery</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  {gallery.map((item) => (
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
              <NavigationMenuLink asChild><Link href="/testimonials">Testimonials</Link></NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild><Link href="/about">About</Link></NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild><Link href="/contact">Contact</Link></NavigationMenuLink>
            </NavigationMenuItem>

          </NavigationMenuList>

        </NavigationMenu>
      </div>
      <div className="w-full h-[50vh] md:h-[30vh] lg:h-[25vh] overflow-hidden">
        <img
          src="/banner.jpg"
          alt="Banner"
          className="w-full h-full object-cover"
        />
      </div>

    </div>
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