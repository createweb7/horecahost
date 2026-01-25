"use client";

import Link from "next/link";
import Footer from "@/components/global/Footer";

export default function ContactPageAr() {
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
            <span className="text-gray-900 font-semibold">تواصل معنا</span>
          </div>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="bg-gray-50 py-12" dir="rtl">
        <div className="mx-auto max-w-6xl xl:max-w-7xl px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              تواصل معنا
            </h1>
            <div className="flex justify-center mb-4">
              <div className="w-12 h-1 bg-red-600"></div>
            </div>
            <p className="text-lg text-gray-600">
              نود أن نسمع منك. تواصل مع فريقنا في أي وقت.
            </p>
          </div>
        </div>
      </div>

      <main className="min-h-screen bg-white" dir="rtl">
        {/* Contact Information Cards */}
        <div className="mx-auto max-w-6xl xl:max-w-7xl px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {/* Contact 1 - UAE */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="text-2xl mb-3">🇦🇪</div>
              <h4 className="font-bold text-gray-900 mb-1">السيد عبدالكبير</h4>
              <p className="text-xs text-gray-600 mb-3">الإمارات العربية المتحدة</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-red-600">📞</span>
                  <a
                    href="tel:+971503079863"
                    className="text-gray-700 hover:text-red-600"
                  >
                    +971 50 307 9863
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-red-600">💬</span>
                  <a
                    href="https://api.whatsapp.com/send?phone=+971503079863"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-700 hover:text-red-600"
                  >
                    +971 50 307 9863
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-red-600">✉️</span>
                  <a
                    href="mailto:gm@horecahost.com"
                    className="text-gray-700 hover:text-red-600 truncate"
                  >
                    gm@horecahost.com
                  </a>
                </div>
              </div>
            </div>

            {/* Contact 2 - UAE */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="text-2xl mb-3">🇦🇪</div>
              <h4 className="font-bold text-gray-900 mb-1">السيد إرشاد أحمد</h4>
              <p className="text-xs text-gray-600 mb-3">الإمارات العربية المتحدة</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-red-600">📞</span>
                  <a
                    href="tel:+971507758742"
                    className="text-gray-700 hover:text-red-600"
                  >
                    +971 50 7758742
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-red-600">💬</span>
                  <a
                    href="https://api.whatsapp.com/send?phone=+971507758742"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-700 hover:text-red-600"
                  >
                    +971 50 7758742
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-red-600">✉️</span>
                  <a
                    href="mailto:irshad@horecahost.com"
                    className="text-gray-700 hover:text-red-600 truncate"
                  >
                    irshad@horecahost.com
                  </a>
                </div>
              </div>
            </div>

            {/* Contact 3 - UAE */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="text-2xl mb-3">🇦🇪</div>
              <h4 className="font-bold text-gray-900 mb-1">السيد محمد</h4>
              <p className="text-xs text-gray-600 mb-3">الإمارات العربية المتحدة</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-red-600">📞</span>
                  <a
                    href="tel:+971504624324"
                    className="text-gray-700 hover:text-red-600"
                  >
                    +971 50 462 4324
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-red-600">💬</span>
                  <a
                    href="https://api.whatsapp.com/send?phone=+971504624324"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-700 hover:text-red-600"
                  >
                    +971 50 462 4324
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-red-600">✉️</span>
                  <a
                    href="mailto:mohammed@horecahost.com"
                    className="text-gray-700 hover:text-red-600 truncate"
                  >
                    mohammed@horecahost.com
                  </a>
                </div>
              </div>
            </div>

            {/* Contact 4 - USA */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="text-2xl mb-3">🇺🇸</div>
              <h4 className="font-bold text-gray-900 mb-1">السيد شايك</h4>
              <p className="text-xs text-gray-600 mb-3">الولايات المتحدة الأمريكية</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-red-600">📞</span>
                  <a
                    href="tel:+15122943836"
                    className="text-gray-700 hover:text-red-600"
                  >
                    +1 512 294 3836
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-red-600">💬</span>
                  <a
                    href="https://api.whatsapp.com/send?phone=+15122943836"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-700 hover:text-red-600"
                  >
                    +1 512 294 3836
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-red-600">✉️</span>
                  <a
                    href="mailto:shaik@horecahost.com"
                    className="text-gray-700 hover:text-red-600 truncate"
                  >
                    shaik@horecahost.com
                  </a>
                </div>
              </div>
            </div>

            {/* Contact 5 - Malaysia */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="text-2xl mb-3">🇲🇾</div>
              <h4 className="font-bold text-gray-900 mb-1">السيد مير</h4>
              <p className="text-xs text-gray-600 mb-3">ماليزيا</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-red-600">📞</span>
                  <a
                    href="tel:+60178702132"
                    className="text-gray-700 hover:text-red-600"
                  >
                    +60 178 702 132
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-red-600">💬</span>
                  <a
                    href="https://api.whatsapp.com/send?phone=+60178702132"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-700 hover:text-red-600"
                  >
                    +60 178 702 132
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-red-600">✉️</span>
                  <a
                    href="mailto:hhm@horecahost.com"
                    className="text-gray-700 hover:text-red-600 truncate"
                  >
                    hhm@horecahost.com
                  </a>
                </div>
              </div>
            </div>

            {/* Contact 6 - Italy */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="text-2xl mb-3">🇮🇹</div>
              <h4 className="font-bold text-gray-900 mb-1">السيد فيديريكو</h4>
              <p className="text-xs text-gray-600 mb-3">إيطاليا</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-red-600">📞</span>
                  <a
                    href="tel:+393429935695"
                    className="text-gray-700 hover:text-red-600"
                  >
                    +39 342 993 5695
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-red-600">💬</span>
                  <a
                    href="https://api.whatsapp.com/send?phone=+393429935695"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-700 hover:text-red-600"
                  >
                    +39 342 993 5695
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-red-600">✉️</span>
                  <a
                    href="mailto:hhit@horecahost.com"
                    className="text-gray-700 hover:text-red-600 truncate"
                  >
                    hhit@horecahost.com
                  </a>
                </div>
              </div>
            </div>

            {/* Contact 7 - Mauritius */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="text-2xl mb-3">🇲🇺</div>
              <h4 className="font-bold text-gray-900 mb-1">السيد ساهابوليا</h4>
              <p className="text-xs text-gray-600 mb-3">موريشيوس</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-red-600">📞</span>
                  <a
                    href="tel:+23057348666"
                    className="text-gray-700 hover:text-red-600"
                  >
                    +230 57 348 666
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-red-600">💬</span>
                  <a
                    href="https://api.whatsapp.com/send?phone=+23057348666"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-700 hover:text-red-600"
                  >
                    +230 57 348 666
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-red-600">✉️</span>
                  <a
                    href="mailto:sn@horecahost.com"
                    className="text-gray-700 hover:text-red-600 truncate"
                  >
                    sn@horecahost.com
                  </a>
                </div>
              </div>
            </div>

            {/* Contact 8 - Bahrain */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="text-2xl mb-3">🇧🇭</div>
              <h4 className="font-bold text-gray-900 mb-1">السيد غاني</h4>
              <p className="text-xs text-gray-600 mb-3">البحرين</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-red-600">📞</span>
                  <a
                    href="tel:+97333322762"
                    className="text-gray-700 hover:text-red-600"
                  >
                    +973 3332 2762
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-red-600">💬</span>
                  <a
                    href="https://api.whatsapp.com/send?phone=+97333322762"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-700 hover:text-red-600"
                  >
                    +973 3332 2762
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-red-600">✉️</span>
                  <a
                    href="mailto:gani@horecahost.com"
                    className="text-gray-700 hover:text-red-600 truncate"
                  >
                    gani@horecahost.com
                  </a>
                </div>
              </div>
            </div>

            {/* Contact 9 - Bahrain */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="text-2xl mb-3">🇧🇭</div>
              <h4 className="font-bold text-gray-900 mb-1">السيد هانسول</h4>
              <p className="text-xs text-gray-600 mb-3">البحرين</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-red-600">📞</span>
                  <a
                    href="tel:+97333381762"
                    className="text-gray-700 hover:text-red-600"
                  >
                    +973 3338 1762
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-red-600">💬</span>
                  <a
                    href="https://api.whatsapp.com/send?phone=+97333381762"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-700 hover:text-red-600"
                  >
                    +973 3338 1762
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-red-600">✉️</span>
                  <a
                    href="mailto:hansul@horecahost.com"
                    className="text-gray-700 hover:text-red-600 truncate"
                  >
                    hansul@horecahost.com
                  </a>
                </div>
              </div>
            </div>

            {/* Contact 10 - Qatar */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="text-2xl mb-3">🇶🇦</div>
              <h4 className="font-bold text-gray-900 mb-1">السيد حاكم</h4>
              <p className="text-xs text-gray-600 mb-3">قطر</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-red-600">📞</span>
                  <a
                    href="tel:+97430839587"
                    className="text-gray-700 hover:text-red-600"
                  >
                    +974 3083 9587
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-red-600">💬</span>
                  <a
                    href="https://api.whatsapp.com/send?phone=+97430839587"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-700 hover:text-red-600"
                  >
                    +974 3083 9587
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-red-600">✉️</span>
                  <a
                    href="mailto:hhqt@horecahost.com"
                    className="text-gray-700 hover:text-red-600 truncate"
                  >
                    hhqt@horecahost.com
                  </a>
                </div>
              </div>
            </div>

            {/* Contact 11 - India */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="text-2xl mb-3">🇮🇳</div>
              <h4 className="font-bold text-gray-900 mb-1">السيد مهدير</h4>
              <p className="text-xs text-gray-600 mb-3">الهند</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-red-600">📞</span>
                  <a
                    href="tel:+919629505892"
                    className="text-gray-700 hover:text-red-600"
                  >
                    +91 9629 505 892
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-red-600">💬</span>
                  <a
                    href="https://api.whatsapp.com/send?phone=+919629505892"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-700 hover:text-red-600"
                  >
                    +91 9629 505 892
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-red-600">✉️</span>
                  <a
                    href="mailto:hhin@horecahost.com"
                    className="text-gray-700 hover:text-red-600 truncate"
                  >
                    hhin@horecahost.com
                  </a>
                </div>
              </div>
            </div>

            {/* Contact 12 - Kenya */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="text-2xl mb-3">🇰🇪</div>
              <h4 className="font-bold text-gray-900 mb-1">السيد أروند</h4>
              <p className="text-xs text-gray-600 mb-3">كينيا</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-red-600">📞</span>
                  <a
                    href="tel:+254717445591"
                    className="text-gray-700 hover:text-red-600"
                  >
                    +254 717 445 591
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-red-600">💬</span>
                  <a
                    href="https://api.whatsapp.com/send?phone=+254717445591"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-700 hover:text-red-600"
                  >
                    +254 717 445 591
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-red-600">✉️</span>
                  <a
                    href="mailto:arvind@horecahost.com"
                    className="text-gray-700 hover:text-red-600 truncate"
                  >
                    arvind@horecahost.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                أرسل لنا رسالة
              </h2>
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    اسمك الكامل
                  </label>
                  <input
                    type="text"
                    placeholder="أدخل اسمك الكامل"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    عنوان بريدك الإلكتروني
                  </label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رقم الهاتف
                  </label>
                  <input
                    type="tel"
                    placeholder="+971 (555) 000-0000"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رسالتك
                  </label>
                  <textarea
                    rows={5}
                    placeholder="اكتب رسالتك هنا..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  ></textarea>
                </div>
                <button className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-colors">
                  إرسال الرسالة
                </button>
              </form>
            </div>

            {/* Company Info */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                عن هوريكا هوست
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  هوريكا هوست هي شريكك الموثوق في صناعة معدات الضيافة، تخدم الشركات في قارات متعددة بمنتجات عالية الجودة وخدمة استثنائية.
                </p>
                <p>
                  مع مكاتب في الإمارات العربية المتحدة والولايات المتحدة وماليزيا وإيطاليا وما وراءها، نوفر حلول التوريد للمطاعم والفنادق ومنشآت الضيافة وعمليات خدمة الأغذية.
                </p>
                <p>
                  تشمل خبرتنا العلامات التجارية الرائدة بما في ذلك Vulcan و Continental Forni و Rational وعديد آخرين، مما يضمن حصولك على أفضل المعدات لاحتياجات عملك.
                </p>
                <div className="pt-6 border-t border-gray-300 mt-6">
                  <h3 className="font-bold text-gray-900 mb-3">
                    ساعات العمل
                  </h3>
                  <p>الاثنين - الجمعة: 9:00 ص - 6:00 م (بتوقيت الخليج)</p>
                  <p>السبت: 10:00 ص - 4:00 م (بتوقيت الخليج)</p>
                  <p>الأحد: مغلق</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="w-full bg-gray-50 py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              حضورنا العالمي
            </h2>
            <div className="rounded-lg overflow-hidden shadow-lg">
              <iframe
                src="https://www.google.com/maps/d/u/2/embed?mid=153sG3FGU9fwjbPnkMuhbHfOqMs3eAzA&ehbc=2E312F&noprof=1"
                width="100%"
                height="500"
                frameBorder={0}
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
