
import type { Metadata } from "next";
import *  as React from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
}
  from "@/components/ui/navigation-menu"
import Link from "next/link";
import { getSession } from "@/lib/serverUtils";




export default async function Navbar() {
  const session = await getSession();
  return (
    <div className="w-full bg-primary text-primary-foreground shadow-lg fixed z-50">
      <div className="top-0 w-full bg-primary text-primary-foreground shadow-lg">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink asChild><Link href="/">Exit</Link></NavigationMenuLink>
            </NavigationMenuItem>
            {session && (
              <>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild><Link href="/employee-portal/jobs">Jobs</Link></NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild><Link href="/employee-portal/employees">Employees</Link></NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild><Link href="/employee-portal/contacts">Contacts</Link></NavigationMenuLink>
                </NavigationMenuItem>
              </>)}
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