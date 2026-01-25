import { FaMedal, FaThumbsUp, FaShippingFast } from "react-icons/fa";

export default function HomeFeatures() {
  return (
    <section className="w-full py-16">
      <div className="grid grid-cols-1 md:grid-cols-3 text-white">
        {/* BOX 1 */}
        <div className="bg-[#111111] flex flex-col items-center justify-center py-16 px-6 text-center">
          <FaMedal className="text-5xl mb-4" />
          <h3 className="text-lg font-semibold tracking-wide">BEST QUALITY</h3>
          <h2 className="text-3xl font-bold mt-1">PRODUCTS</h2>
          <div className="w-10 h-0.5 bg-white mt-4"></div>
        </div>

        {/* BOX 2 */}
        <div className="bg-[#003366] flex flex-col items-center justify-center py-16 px-6 text-center">
          <FaThumbsUp className="text-5xl mb-4" />
          <h3 className="text-lg font-semibold tracking-wide">ONE YEAR</h3>
          <h2 className="text-3xl font-bold mt-1">WARRANTY</h2>
          <div className="w-10 h-0.5 bg-white mt-4"></div>
        </div>

        {/* BOX 3 */}
        <div className="bg-[#0074D9] flex flex-col items-center justify-center py-16 px-6 text-center">
          <FaShippingFast className="text-5xl mb-4" />

          <h3 className="text-lg font-semibold tracking-wide">WORLDWIDE</h3>
          <h2 className="text-3xl font-bold mt-1">SHIPPING</h2>
          <div className="w-10 h-0.5 bg-white mt-4"></div>
        </div>
      </div>
    </section>
  );
}
