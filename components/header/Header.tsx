"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Container from "../global/Container";
import Navbar from "../navbar/Navbar";

function Header() {
  const pathname = usePathname();

  // Hide header on admin pages
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <header>
      <Container className="flex flex-col sm:flex-row sm:justify-between sm:items-center flex-wrap py-4">
        <Navbar />
      </Container>
    </header>
  );
}

export default Header;
