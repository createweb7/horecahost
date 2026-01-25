"use client";

import Link from "next/link";
import Footer from "@/components/global/Footer";

export default function AboutPageAr() {
  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-gray-100 border-t-4 border-gray-300 py-4" dir="rtl">
        <div className="mx-auto max-w-6xl xl:max-w-7xl px-8">
          <div className="text-sm text-gray-600">
            <Link href="/ar" className="hover:text-gray-900">
              الرئيسية
            </Link>
            {" › "}
            <span className="text-gray-900 font-semibold">من نحن</span>
          </div>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="bg-gray-50 py-12" dir="rtl">
        <div className="mx-auto max-w-6xl xl:max-w-7xl px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              عن هوريكا هوست
            </h1>
            <div className="flex justify-center mb-4">
              <div className="w-12 h-1 bg-red-600"></div>
            </div>
            <p className="text-lg text-gray-600">
              شريكك الموثوق في حلول معدات الضيافة المميزة
            </p>
          </div>
        </div>
      </div>

      <main className="min-h-screen bg-white" dir="rtl">
        <div className="mx-auto max-w-6xl xl:max-w-7xl px-8 py-16">
          {/* Our Story */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">قصتنا</h2>
            <div className="space-y-4 text-gray-600 text-lg">
              <p>
                تم تأسيس هوريكا هوست برسالة هي سد الفجوة بين الشركات في مجال الضيافة وموردي المعدات المميزة حول العالم. بدأ مشروعنا كمبادرة صغيرة وتطور ليصبح مؤسسة عالمية تخدم آلاف المطاعم والفنادق والمنشآت الغذائية وأماكن تقديم الخدمات الغذائية.
              </p>
              <p>
                نفهم التحديات الفريدة التي يواجهها متخصصو الضيافة. لهذا السبب، كرسنا أنفسنا للبحث عن وتوفير ودعم أفضل علامات المعدات في الصناعة، مما يضمن حصول عملائنا على ما يحتاجونه بالضبط لعملياتهم.
              </p>
              <p>
                بحضورنا في أكثر من 10 دول بما في ذلك الإمارات العربية المتحدة والولايات المتحدة وماليزيا وإيطاليا وغيرها، نستفيد من شبكتنا العالمية لتوفير أسعار تنافسية وتسليم موثوق ودعم عملاء استثنائي.
              </p>
            </div>
          </section>

          {/* Our Mission */}
          <section className="mb-20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-50 rounded-lg p-8 border border-gray-200">
                <div className="text-4xl font-bold text-red-600 mb-4">🎯</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  رسالتنا
                </h3>
                <p className="text-gray-600">
                  توفير معدات الضيافة عالية الجودة والموثوقة للشركات في جميع أنحاء العالم وخدمة استثنائية تساعدها على النجاح والنمو.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-8 border border-gray-200">
                <div className="text-4xl font-bold text-red-600 mb-4">👁️</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  رؤيتنا
                </h3>
                <p className="text-gray-600">
                  أن نكون المصدر الأكثر ثقة وموثوقية لحلول معدات الضيافة عالمياً، معروفون بالجودة والنزاهة وارضاء العملاء.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-8 border border-gray-200">
                <div className="text-4xl font-bold text-red-600 mb-4">⭐</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  قيمنا
                </h3>
                <p className="text-gray-600">
                  الجودة والموثوقية والنزاهة والنهج الموجه للعملاء توجه كل ما نفعله. نحن ملتزمون ببناء علاقات طويلة الأجل.
                </p>
              </div>
            </div>
          </section>

          {/* Why Choose Us */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-12">
              لماذا تختار هوريكا هوست
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  title: "الشبكة العالمية",
                  description:
                    "مع المكاتب والشركاء عبر القارات، نضمن التغطية العالمية والخبرة المحلية.",
                },
                {
                  title: "العلامات المميزة",
                  description:
                    "نتشارك مع العلامات الرائدة في الصناعة مثل Vulcan وRational وContinental Forni وغيرها.",
                },
                {
                  title: "فريق خبير",
                  description:
                    "يتمتع فريقنا بعقود من الخبرة المشتركة في معدات الضيافة وأفضل الممارسات الصناعية.",
                },
                {
                  title: "أسعار تنافسية",
                  description:
                    "تسمح لنا قدرات التوريد العالمية بتقديم أسعار تنافسية دون التضحية بالجودة.",
                },
                {
                  title: "دعم موثوق",
                  description:
                    "من الاستشارة إلى الخدمة اللاحقة للبيع، نوفر دعماً شاملاً في كل مرحلة.",
                },
                {
                  title: "ضمان الجودة",
                  description:
                    "يخضع كل منتج لفحوصات جودة صارمة للتأكد من استيفائه المعايير الدولية.",
                },
              ].map((item, index) => (
                <div key={index} className="flex gap-4">
                  <div className="shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-red-600 text-white">
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 mt-2">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Our Products & Services */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              ما نقدمه
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                "معدات الطبخ",
                "أنظمة التبريد",
                "تحضير الطعام",
                "معدات المشروبات",
                "الخبز والأفران",
                "أنظمة غسل الأطباق",
                "تدفئة وعرض الطعام",
                "أنظمة التهوية",
                "الأدوات الصغيرة والملحقات",
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-lg p-6 border border-gray-200"
                >
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {item}
                  </h3>
                  <p className="text-gray-600 text-sm mt-2">
                    اختيار مميز من العلامات الرائدة
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Global Presence */}
          <section className="bg-gray-50 rounded-lg p-12 border border-gray-200">
            <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">
              حضورنا العالمي
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { country: "الإمارات العربية المتحدة", flag: "🇦🇪" },
                { country: "الولايات المتحدة", flag: "🇺🇸" },
                { country: "ماليزيا", flag: "🇲🇾" },
                { country: "إيطاليا", flag: "🇮🇹" },
                { country: "موريشيوس", flag: "🇲🇺" },
                { country: "البحرين", flag: "🇧🇭" },
                { country: "قطر", flag: "🇶🇦" },
                { country: "الهند", flag: "🇮🇳" },
              ].map((loc, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl mb-3">{loc.flag}</div>
                  <p className="font-semibold text-gray-900">{loc.country}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Call to Action */}
          <section className="mt-20 bg-red-600 rounded-lg p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">هل أنت مستعد للعمل معنا؟</h2>
            <p className="text-lg mb-8 text-red-50">
              تواصل مع فريقنا اليوم لمناقشة احتياجاتك من معدات الضيافة.
            </p>
            <Link
              href="/ar/contact"
              className="inline-block bg-white text-red-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-50 transition-colors"
            >
              تواصل معنا
            </Link>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
