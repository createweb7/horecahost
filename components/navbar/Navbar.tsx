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
    <nav className="flex items-center justify-between w-full" suppressHydrationWarning>
      <div className={`flex-none ${isArabic ? "order-last" : "order-first"}`}>
        <Link href={isArabic ? "/ar" : "/"}>
          <div className="relative w-36 sm:w-56 h-12 sm:h-16">
            <Image
              src={isArabic ? "/horecahost_logo_arabic.webp" : "/horecahost_logo.webp"}
              alt="Horecahost Logo"
              fill
              sizes="(max-width: 640px) 144px, (max-width: 1024px) 224px, 250px"
              className="object-contain"
              priority
            />
          </div>
        </Link>
      </div>

      {isArabic && (
        <div className="hidden lg:flex flex-1 justify-center items-center order-none">
          <p className="text-sm text-gray-600 font-semibold">بسم الله الرحمن الرحيم</p>
        </div>
      )}

      <div className={`hidden lg:flex gap-5 items-center ${isArabic ? "order-first" : "order-last ml-auto"}`}>
        <ul className="flex flex-row">
          <li
            className={`px-5 py-2 transition-colors hover:text-red-600 relative ${
              pathname === "/" || pathname === "/ar" ? "text-red-600" : ""
            }`}
          >
            <Link href={isArabic ? "/ar" : "/"}>
              {isArabic ? "الرئيسية" : "Home"}
            </Link>
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
            <Link href={isArabic ? "/ar/products" : "/products"}>
              {isArabic ? "المنتجات" : "Products"}
            </Link>
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
            <Link href={isArabic ? "/ar/about" : "/about"}>
              {isArabic ? "من نحن" : "About"}
            </Link>
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
            <Link href={isArabic ? "/ar/contact" : "/contact"}>
              {isArabic ? "اتصل بنا" : "Contact"}
            </Link>
            {(pathname === "/contact" || pathname === "/ar/contact") && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-red-600"></div>
            )}
          </li>
        </ul>

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
      </div>

      <div className={`flex gap-5 items-center lg:hidden`}>
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
                href={isArabic ? "/ar" : "/"}
                onClick={() => setOpen(false)}
                className="text-lg border-b pb-2"
              >
                {isArabic ? "الرئيسية" : "Home"}
              </Link>
              <Link
                href={isArabic ? "/ar/products" : "/products"}
                onClick={() => setOpen(false)}
                className="text-lg border-b pb-2"
              >
                {isArabic ? "المنتجات" : "Products"}
              </Link>
              <Link
                href={isArabic ? "/ar/about" : "/about"}
                onClick={() => setOpen(false)}
                className="text-lg border-b pb-2"
              >
                {isArabic ? "من نحن" : "About"}
              </Link>
              <Link
                href={isArabic ? "/ar/contact" : "/contact"}
                onClick={() => setOpen(false)}
                className="text-lg border-b pb-2"
              >
                {isArabic ? "اتصل بنا" : "Contact"}
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}

export default Navbar;
