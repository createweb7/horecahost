"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
// import { MdOutlineAccountCircle } from "react-icons/md";

import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Menu } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

function Navbar() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const isArabic = pathname.startsWith("/ar");

  const switchLanguage = (lang: string) => {
    const segments = pathname.split("/").filter(Boolean);

    if (lang === "ar") {
      if (segments[0] === "ar") {
        router.push("/" + segments.join("/"));
      } else {
        segments.unshift("ar");
        router.push("/" + segments.join("/"));
      }
    } else {
      // English - remove "ar" prefix if it exists
      if (segments[0] === "ar") {
        segments.shift();
        router.push(segments.length ? "/" + segments.join("/") : "/");
      } else {
        router.push("/");
      }
    }
  };
  return (
    <nav className="flex items-center justify-between w-full">
      <div className="flex-none">
        <Link href={isArabic ? "/ar" : "/"}>
          <div className="relative w-36 sm:w-56 h-12 sm:h-16">
            <Image
              src="/horecahost_logo.webp"
              alt="Horecahost Logo"
              fill
              sizes="(max-width: 640px) 144px, (max-width: 1024px) 224px, 250px"
              className="object-contain"
              priority
            />
          </div>
        </Link>
      </div>

      <div className="hidden lg:flex ml-auto">
        <ul className="flex flex-row">
          <li
            className={`px-5 py-2 transition-colors hover:text-red-600 relative ${
              pathname === "/" || pathname === "/ar" ? "text-red-600" : ""
            }`}
          >
            <Link href={isArabic ? "/ar" : "/"}>Home</Link>
            {(pathname === "/" || pathname === "/ar") && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-red-600"></div>
            )}
          </li>
          <li
            className={`px-5 py-2 transition-colors hover:text-red-600 relative ${
              pathname === "/products" || pathname === "/ar/products"
                ? "text-red-600"
                : ""
            }`}
          >
            <Link href={isArabic ? "/ar/products" : "/products"}>Products</Link>
            {(pathname === "/products" || pathname === "/ar/products") && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-red-600"></div>
            )}
          </li>
          <li
            className={`px-5 py-2 transition-colors hover:text-red-600 relative ${
              pathname === "/about" || pathname === "/ar/about"
                ? "text-red-600"
                : ""
            }`}
          >
            <Link href={isArabic ? "/ar/about" : "/about"}>About</Link>
            {(pathname === "/about" || pathname === "/ar/about") && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-red-600"></div>
            )}
          </li>
          <li
            className={`px-5 py-2 transition-colors hover:text-red-600 relative ${
              pathname === "/contact" || pathname === "/ar/contact"
                ? "text-red-600"
                : ""
            }`}
          >
            <Link href={isArabic ? "/ar/contact" : "/contact"}>Contact</Link>
            {(pathname === "/contact" || pathname === "/ar/contact") && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-red-600"></div>
            )}
          </li>
        </ul>
      </div>

      <div className="flex gap-5 items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="cursor-pointer flex gap-2">
              <span className="text-xl">{isArabic ? "🇦🇪" : "🇬🇧"}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => switchLanguage("ar")}>
              <span className="text-xl mr-2">🇦🇪</span> العربية
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => switchLanguage("en")}>
              <span className="text-xl mr-2">🇬🇧</span> English
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {/* Login/Register dropdown hidden for now - to be implemented later */}
        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="cursor-pointer flex max-w-[100px] gap-4"
            >
              <MdOutlineAccountCircle className="size-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <Link href="/login">Login</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href="/Register">Register</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu> */}

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>

          <SheetContent side="left" className="p-4">
            <VisuallyHidden>
              <SheetTitle>Navigation Menu</SheetTitle>
              <SheetDescription>Mobile navigation links</SheetDescription>
            </VisuallyHidden>
            <nav className="flex flex-col gap-6 pt-16">
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="text-lg border-b pb-2"
              >
                Home
              </Link>
              <Link
                href="/products"
                onClick={() => setOpen(false)}
                className="text-lg border-b pb-2"
              >
                Products
              </Link>
              <Link
                href="/about"
                onClick={() => setOpen(false)}
                className="text-lg border-b pb-2"
              >
                About
              </Link>
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="text-lg border-b pb-2"
              >
                Contact
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}

export default Navbar;
