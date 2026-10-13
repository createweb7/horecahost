import type { Metadata } from "next";
import Link from "next/link";
import { Mail, Phone, Package } from "lucide-react";

const SITE_ORIGIN = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.horecahost.com";
const title = "معدات المطابخ التجارية والضيافة في السعودية | هوريكا هوست";
const description = "تجهيزات المطاعم والفنادق والمقاهي في المملكة العربية السعودية من هوريكا هوست. استكشف معدات المطابخ والعلامات التجارية وتواصل معنا لطلب عرض سعر.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: `${SITE_ORIGIN}/sa/ar`,
    languages: {
      "en-AE": SITE_ORIGIN,
      "en-SA": `${SITE_ORIGIN}/sa`,
      "ar-SA": `${SITE_ORIGIN}/sa/ar`,
      "en-MV": `${SITE_ORIGIN}/mv`,
      "en-MU": `${SITE_ORIGIN}/mu`,
      "x-default": SITE_ORIGIN,
    },
  },
  openGraph: { title, description, url: `${SITE_ORIGIN}/sa/ar`, locale: "ar_SA", alternateLocale: ["en_SA"], type: "website", siteName: "HorecaHost" },
  twitter: { card: "summary_large_image", title, description },
};

const industries = [
  { title: "الفنادق والمنتجعات", text: "معدات لإعداد الطعام والطهي وخدمة الضيوف في المطابخ الفندقية." },
  { title: "المطاعم", text: "حلول للمطابخ التجارية تساعدك على اختيار المعدات المناسبة لقائمة الطعام وحجم التشغيل." },
  { title: "المقاهي", text: "معدات تحضير المشروبات وتجهيز الطعام لتلبية احتياجات المقهى." },
  { title: "المخابز وخدمات التموين", text: "تجهيزات للإنتاج والتحضير تناسب متطلبات المخابز وشركات تقديم الطعام." },
];

export default function SaudiArabicPage() {
  return (
    <div lang="ar" dir="rtl">
      <main>
        <section className="relative bg-gray-900 text-white border-t-4 border-red-600">
          <div className="mx-auto max-w-7xl px-6 sm:px-8 py-16 sm:py-24">
            <p className="text-red-300 font-semibold mb-6">هوريكا هوست · المملكة العربية السعودية</p>
            <h1 className="max-w-4xl text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">معدات المطابخ التجارية والضيافة في السعودية</h1>
            <p className="max-w-3xl text-lg sm:text-xl text-gray-300 leading-loose mb-8">ندعم تجهيز الفنادق والمطاعم والمقاهي في المملكة العربية السعودية بمعدات احترافية من علامات تجارية عالمية. تواصل مع فريقنا لاختيار المعدات المناسبة لمشروعك ومناقشة متطلبات التوريد.</p>
            <div className="flex flex-wrap gap-4">
              <Link href="/sa/ar/contact" className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 px-6 py-3 rounded-xl font-semibold"><Mail className="size-5" />اطلب عرض سعر</Link>
              <Link href="/sa/ar/products" className="inline-flex items-center gap-2 border border-gray-500 hover:border-white px-6 py-3 rounded-xl"><Package className="size-5" />تصفح المنتجات</Link>
            </div>
          </div>
        </section>
        <section id="about" className="mx-auto max-w-7xl px-6 sm:px-8 py-16 sm:py-20 scroll-mt-8">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">شريكك في تجهيز المطابخ وقطاع الضيافة</h2>
            <p className="text-gray-600 text-lg leading-loose">من اختيار الأجهزة إلى مناقشة احتياجات المشروع، يساعدك فريق هوريكا هوست في تحديد حلول مناسبة لطبيعة العمل والمساحة المتاحة. نخدم العملاء في السعودية من مقرنا في دبي، ويمكنك التواصل معنا للتحقق من التوافر وخيارات الشحن إلى مدينتك.</p>
            <Link href="/sa/ar/brands" className="inline-block mt-6 text-red-700 font-semibold underline underline-offset-4">استكشف العلامات التجارية</Link>
          </div>
        </section>
        <section className="bg-gray-50 border-y border-gray-100 py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-6 sm:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-10">حلول لقطاعات الضيافة في المملكة</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {industries.map((industry) => <article key={industry.title} className="bg-white border border-gray-200 rounded-2xl p-6"><h3 className="text-xl font-bold mb-3">{industry.title}</h3><p className="text-gray-600 leading-loose">{industry.text}</p></article>)}
            </div>
          </div>
        </section>
        <section id="contact" className="bg-gray-900 text-white py-16 sm:py-20 scroll-mt-8">
          <div className="mx-auto max-w-7xl px-6 sm:px-8">
            <h2 className="text-3xl font-bold mb-5">لنناقش تجهيز مشروعك في السعودية</h2>
            <p className="text-gray-300 text-lg leading-loose max-w-3xl mb-8">أرسل لنا نوع المشروع والمدينة والمعدات المطلوبة. سيساعدنا ذلك في إعداد عرض يناسب احتياجاتك وتوضيح تفاصيل التوريد.</p>
            <div className="flex flex-wrap gap-4">
              <a href="mailto:info@horecahost.com?subject=Saudi%20Arabia%20equipment%20enquiry" className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 rounded-xl px-6 py-3"><Mail className="size-5" />أرسل طلبك بالبريد الإلكتروني</a>
              <a href="tel:+971503079863" className="inline-flex items-center gap-2 border border-gray-500 hover:border-white rounded-xl px-6 py-3" aria-label="اتصل بفريق هوريكا هوست في دبي"><Phone className="size-5" /><bdi dir="ltr">+971 50 307 9863</bdi></a>
            </div>
            <p className="text-gray-400 mt-5 text-sm">فريق المبيعات: دبي، الإمارات العربية المتحدة</p>
          </div>
        </section>
      </main>
      <footer className="bg-gray-950 text-gray-300 py-8">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 flex flex-wrap justify-between gap-4">
          <p>© {new Date().getFullYear()} هوريكا هوست. جميع الحقوق محفوظة.</p>
          <Link href="/sa" lang="en" className="underline underline-offset-4">Saudi Arabia — English</Link>
        </div>
      </footer>
    </div>
  );
}
