import Link from "next/link";

export default function SaudiArabicFooter() {
  return (
    <footer lang="ar" dir="rtl" className="bg-gray-950 text-gray-300 py-8">
      <nav aria-label="روابط السعودية" className="mx-auto max-w-7xl px-6 flex flex-wrap gap-6">
        <Link href="/sa/ar">السعودية</Link>
        <Link href="/sa/ar/about">من نحن</Link>
        <Link href="/sa/ar/brands">العلامات التجارية</Link>
        <Link href="/sa/ar/products">المنتجات</Link>
        <Link href="/sa/ar/contact">اتصل بنا</Link>
      </nav>
    </footer>
  );
}
