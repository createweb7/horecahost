import SaudiArabicPage from "@/components/country/SaudiArabicPage";
import { saudiArabicMetadata } from "@/lib/saudi-arabic-metadata";

const title = "تواصل معنا لتجهيز مشروعك في السعودية";
const description = "تواصل مع فريق هوريكا هوست لطلب عرض سعر ومناقشة معدات المطابخ التجارية وخيارات التوريد إلى السعودية.";
export const metadata = saudiArabicMetadata("contact", title, description);

export default function ContactPage() {
  return <SaudiArabicPage title={title} description={description}>
    <div className="grid md:grid-cols-2 gap-8">
      <section className="rounded-2xl border border-gray-200 p-6 sm:p-8">
        <h2 className="text-2xl font-bold mb-6">تحدث إلى فريق المبيعات</h2>
        <p className="text-gray-600 leading-loose mb-6">نخدم العملاء في المملكة العربية السعودية من دبي، الإمارات العربية المتحدة.</p>
        <div className="flex flex-col items-start gap-5">
          <a href="mailto:info@horecahost.com?subject=Saudi%20Arabia%20equipment%20enquiry" className="text-red-700 underline underline-offset-4"><bdi>info@horecahost.com</bdi></a>
          <a href="tel:+971503079863" className="text-red-700 underline underline-offset-4" aria-label="اتصل بفريق المبيعات"><bdi dir="ltr">+971 50 307 9863</bdi></a>
          <a href="https://wa.me/971503079863?text=Saudi%20Arabia%20equipment%20enquiry" className="bg-red-600 hover:bg-red-700 text-white rounded-lg px-6 py-3">تواصل عبر واتساب</a>
        </div>
      </section>
      <section className="bg-gray-50 rounded-2xl p-6 sm:p-8">
        <h2 className="text-2xl font-bold mb-6">ماذا نحتاج لإعداد عرض السعر؟</h2>
        <ul className="list-disc list-inside space-y-4 text-gray-600 leading-loose"><li>نوع المشروع ومدينة التسليم في السعودية.</li><li>أسماء المعدات أو أرقام الموديلات والكميات المطلوبة.</li><li>الموعد المطلوب للتوريد وأي متطلبات خاصة بالمشروع.</li></ul>
        <p className="mt-6 text-gray-600 leading-loose">أرسل هذه التفاصيل بالبريد الإلكتروني أو واتساب لمناقشة التوافر والشحن والأسعار مع فريقنا.</p>
      </section>
    </div>
  </SaudiArabicPage>;
}
