import Link from "next/link";
import SaudiArabicPage from "@/components/country/SaudiArabicPage";
import { saudiArabicMetadata } from "@/lib/saudi-arabic-metadata";

const title = "عن هوريكا هوست في السعودية";
const description = "حلول معدات المطابخ التجارية والضيافة للفنادق والمطاعم والمقاهي في المملكة العربية السعودية.";
export const metadata = saudiArabicMetadata("about", title, description);

export default function AboutPage() {
  return <SaudiArabicPage title={title} description={description}>
    <div className="max-w-3xl space-y-10">
      <section><h2 className="text-2xl font-bold mb-4">شريكك في تجهيز مشروعك</h2><p className="text-gray-600 leading-loose text-lg">تساعد هوريكا هوست أصحاب المطاعم والفنادق والمقاهي على اختيار معدات تناسب احتياجات التشغيل. نخدم العملاء في السعودية من مقرنا في دبي، ونتعاون معهم لمناقشة متطلبات المشروع والمعدات المناسبة والمساحة المتاحة.</p></section>
      <section><h2 className="text-2xl font-bold mb-4">من اختيار المعدات إلى التوريد</h2><p className="text-gray-600 leading-loose text-lg">يمكنك استكشاف المنتجات والعلامات التجارية، ثم إرسال قائمة المعدات المطلوبة ومدينة التسليم إلى فريقنا للتحقق من التوافر وخيارات الشحن وتفاصيل عرض السعر.</p></section>
      <div className="flex flex-wrap gap-4">
        <Link href="/sa/ar/products" className="bg-red-600 hover:bg-red-700 text-white rounded-lg px-6 py-3">استكشف المنتجات</Link>
        <Link href="/sa/ar/contact" className="border border-gray-300 rounded-lg px-6 py-3 hover:border-red-600">تواصل مع فريقنا</Link>
        <a href="/downloads/HorecaHost-Company-Profile.pdf" className="text-red-700 underline px-2 py-3">تحميل ملف الشركة (PDF)</a>
      </div>
    </div>
  </SaudiArabicPage>;
}
