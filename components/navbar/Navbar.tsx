"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

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

import { Menu, Search, X } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

// All supported country codes — extend this list as new countries are added
const COUNTRY_CODES = ["mv", "mu", "sa", "qa", "bh", "ke", "tz", "ng", "et", "sd", "cg", "zm", "na", "ao", "td"];

const COUNTRY_FLAGS: Record<string, string> = {
  mv: "🇲🇻", mu: "🇲🇺", sa: "🇸🇦", qa: "🇶🇦", bh: "🇧🇭",
  ke: "🇰🇪", tz: "🇹🇿", ng: "🇳🇬", et: "🇪🇹", sd: "🇸🇩",
  cg: "🇨🇬", zm: "🇿🇲", na: "🇳🇦", ao: "🇦🇴", td: "🇹🇩",
};

function Navbar() {
  const [open, setOpen] = useState(false);
  const [desktopSearchOpen, setDesktopSearchOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const desktopSearchInputRef = useRef<HTMLInputElement>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  const isArabic = pathname.startsWith("/ar");

  // Detect active country code (e.g. "mu" when on /mu or /mu/products/...)
  const countryCode = !isArabic
    ? COUNTRY_CODES.find(
        (code) => pathname === `/${code}` || pathname.startsWith(`/${code}/`)
      ) ?? null
    : null;

  const countryFlag = countryCode ? COUNTRY_FLAGS[countryCode] : null;

  // Build nav hrefs based on context
  const homeHref = isArabic ? "/ar" : countryCode ? `/${countryCode}` : "/";
  const productsHref = isArabic
    ? "/ar/products"
    : countryCode
    ? `/${countryCode}/products`
    : "/products";
  const aboutHref = isArabic ? "/ar/about" : "/about";
  const contactHref = isArabic ? "/ar/contact" : "/contact";
  const brandsHref = isArabic
    ? "/ar/brands"
    : countryCode
    ? `/${countryCode}/brands`
    : "/brands";
  // Search always targets the main products page — country subsites don't have search wired up yet
  const searchHref = isArabic ? "/ar/products" : "/products";

  const submitSearch = () => {
    const query = searchQuery.trim();
    if (!query) return;
    router.push(`${searchHref}?search=${encodeURIComponent(query)}`);
    setDesktopSearchOpen(false);
    setMobileSearchOpen(false);
    setOpen(false);
  };

  useEffect(() => {
    if (desktopSearchOpen) desktopSearchInputRef.current?.focus();
  }, [desktopSearchOpen]);

  useEffect(() => {
    if (mobileSearchOpen) mobileSearchInputRef.current?.focus();
  }, [mobileSearchOpen]);

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
      if (segments[0] === "ar") {
        segments.shift();
        router.push(segments.length ? "/" + segments.join("/") : "/");
      } else {
        router.push("/");
      }
    }
  };

  const isActive = (href: string) => pathname === href || (href !== "/" && pathname.startsWith(href));

  const activeDot = (
    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-red-600" />
  );

  return (
    <nav
      className="flex items-center justify-between w-full flex-wrap"
      suppressHydrationWarning
    >
      {/* Logo */}
      <div className={`flex-none ${isArabic ? "order-last" : "order-first"}`}>
        <Link href={homeHref}>
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
        <div className="flex flex-1 justify-center items-center order-0">
          <p className="text-2xl sm:text-3xl text-gray-700">﷽</p>
        </div>
      )}

      {/* Country badge — shown when browsing a country section */}
      {countryFlag && (
        <div className="hidden lg:flex items-center gap-1.5 bg-gray-100 border border-gray-200 text-sm font-semibold text-gray-700 px-3 py-1 rounded-full ml-4">
          <span>{countryFlag}</span>
          <span className="uppercase text-xs tracking-wide">{countryCode}</span>
        </div>
      )}

      {/* Desktop nav */}
      <div
        className={`hidden lg:flex gap-5 items-center ${isArabic ? "order-first" : "order-last ml-auto"}`}
      >
        <ul className="flex flex-row">
          <li className={`px-5 py-2 transition-colors hover:text-red-600 relative ${isActive(homeHref) && pathname === homeHref ? "text-red-600" : ""}`}>
            <Link href={homeHref}>{isArabic ? "الرئيسية" : "Home"}</Link>
            {pathname === homeHref && activeDot}
          </li>
          <li className={`px-5 py-2 transition-colors hover:text-red-600 relative ${isActive(productsHref) ? "text-red-600" : ""}`}>
            <Link href={productsHref}>{isArabic ? "المنتجات" : "Products"}</Link>
            {isActive(productsHref) && activeDot}
          </li>
          <li className={`px-5 py-2 transition-colors hover:text-red-600 relative ${isActive(brandsHref) ? "text-red-600" : ""}`}>
            <Link href={brandsHref}>{isArabic ? "العلامات" : "Brands"}</Link>
            {isActive(brandsHref) && activeDot}
          </li>
          <li className={`px-5 py-2 transition-colors hover:text-red-600 relative ${isActive(aboutHref) ? "text-red-600" : ""}`}>
            <Link href={aboutHref}>{isArabic ? "من نحن" : "About"}</Link>
            {isActive(aboutHref) && activeDot}
          </li>
          <li className={`px-5 py-2 transition-colors hover:text-red-600 relative ${isActive(contactHref) ? "text-red-600" : ""}`}>
            <Link href={contactHref}>{isArabic ? "اتصل بنا" : "Contact"}</Link>
            {isActive(contactHref) && activeDot}
          </li>
        </ul>

        {/* Desktop search */}
        <div className="flex items-center">
          <div
            className={`overflow-hidden transition-all duration-200 ${desktopSearchOpen ? "w-56 opacity-100 mr-1" : "w-0 opacity-0"}`}
          >
            <input
              ref={desktopSearchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") submitSearch();
                if (e.key === "Escape") setDesktopSearchOpen(false);
              }}
              placeholder={isArabic ? "ابحث عن منتج..." : "Search products..."}
              className="w-56 rounded-full border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            aria-label={isArabic ? "بحث" : "Search"}
            onClick={() => {
              if (!desktopSearchOpen) {
                setDesktopSearchOpen(true);
              } else if (searchQuery.trim()) {
                submitSearch();
              } else {
                setDesktopSearchOpen(false);
              }
            }}
          >
            {desktopSearchOpen && !searchQuery ? (
              <X className="h-5 w-5" />
            ) : (
              <Search className="h-5 w-5" />
            )}
          </Button>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="cursor-pointer flex gap-2">
              <span className="text-xl">{isArabic ? "🇦🇪" : countryFlag ?? "🇬🇧"}</span>
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

      {/* Mobile nav */}
      <div className={`flex gap-2 items-center lg:hidden ${isArabic ? "order-first" : "order-last"}`}>
        <Button
          variant="ghost"
          size="icon"
          aria-label={isArabic ? "بحث" : "Search"}
          onClick={() => setMobileSearchOpen((o) => !o)}
        >
          {mobileSearchOpen ? <X className="h-6 w-6" /> : <Search className="h-6 w-6" />}
        </Button>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>

          <SheetContent side={isArabic ? "right" : "left"} className="p-4">
            <VisuallyHidden>
              <SheetTitle>Navigation Menu</SheetTitle>
              <SheetDescription>Mobile navigation links</SheetDescription>
            </VisuallyHidden>
            <nav className="flex flex-col gap-6 pt-16">
              {countryFlag && (
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 border-b pb-4">
                  <span>{countryFlag}</span>
                  <span className="uppercase tracking-wide">{countryCode} site</span>
                </div>
              )}
              <Link href={homeHref} onClick={() => setOpen(false)} className="text-lg border-b pb-2">
                {isArabic ? "الرئيسية" : "Home"}
              </Link>
              <Link href={productsHref} onClick={() => setOpen(false)} className="text-lg border-b pb-2">
                {isArabic ? "المنتجات" : "Products"}
              </Link>
              <Link href={brandsHref} onClick={() => setOpen(false)} className="text-lg border-b pb-2">
                {isArabic ? "العلامات" : "Brands"}
              </Link>
              <Link href={aboutHref} onClick={() => setOpen(false)} className="text-lg border-b pb-2">
                {isArabic ? "من نحن" : "About"}
              </Link>
              <Link href={contactHref} onClick={() => setOpen(false)} className="text-lg border-b pb-2">
                {isArabic ? "اتصل بنا" : "Contact"}
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </div>

      {/* Mobile search row — wraps below the header when open */}
      {mobileSearchOpen && (
        <div className="basis-full w-full lg:hidden mt-3">
          <div className="relative">
            <Search className={`absolute ${isArabic ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400`} />
            <input
              ref={mobileSearchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") submitSearch();
                if (e.key === "Escape") setMobileSearchOpen(false);
              }}
              placeholder={isArabic ? "ابحث عن منتج..." : "Search products..."}
              className={`w-full rounded-full border border-gray-300 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 ${isArabic ? "pr-9 pl-4" : "pl-9 pr-4"}`}
            />
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
