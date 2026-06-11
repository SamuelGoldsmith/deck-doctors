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



export default function Navbar() {
  return (
    <div className="w-full bg-primary text-primary-foreground shadow-lg fixed z-50">
      <div className="top-0 w-full bg-primary text-primary-foreground shadow-lg">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink asChild><Link href="/">Home</Link></NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild><Link href="/gallery">Gallery</Link></NavigationMenuLink>
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

            <NavigationMenuItem>
              <NavigationMenuLink asChild><Link href="/apply">Apply</Link></NavigationMenuLink>
            </NavigationMenuItem>

          </NavigationMenuList>

        </NavigationMenu>
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