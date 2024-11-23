"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export type HeaderItem = {
  title: string;
  route: string;
};

interface HeaderProps {
  headerItems: HeaderItem[];
}

export function Header({ headerItems }: HeaderProps) {
  const pathName = usePathname();

  const isActive = (path: string) => pathName === path;

  return (
    <header className="flex items-center p-4 bg-white shadow-md">
      <Image
        src="/volo_logo_100x100.png"
        width={100}
        height={100}
        alt="Volo Accendo insignia"
      />
      <div className="p-4">
        <Image src="volo_logo.png" 
        width={400}
        height={80}
        alt="Volo Accendo logo full text." />
        <div className="navbar">
          {headerItems.map((item) => (
            <Link
              key={item.route}
              className={`btn ${
                isActive(item.route) ? "btn-active" : "btn-ghost"
              }`}
              href={item.route}
            >
              {item.title}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
