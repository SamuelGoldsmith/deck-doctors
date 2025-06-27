import *  as React from "react";
import { NavigationMenuLink } from "./ui/navigation-menu";
import Link from "next/link";

const data: { title: string; href: string; description: string }[] = [
    {
      title: "add",
      href: "/work/example1",
      description:
        "boom.",
    },
    
  ];

  export default function Work() {
    return (
      <ul className="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-3 lg:w-[600px]">
                  {data.map((item) => (
                    <ListItem
                      key={item.title}
                      title={item.title}
                      href={item.href}
                    >
                      {item.description}
                    </ListItem>
                  ))}
                </ul>
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