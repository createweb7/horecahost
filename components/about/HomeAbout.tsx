import Container from "../global/Container";

export default function HomeAbout() {
  return (
    <Container>
      <section className="py-16">
        <div className="container mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-gray-900">
            About Horeca Host
          </h2>

          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            With over{" "}
            <span className="font-semibold">25 years of experience</span>
            in the HORECA (Hotel, Restaurant, and Café) industry, Horeca Host
            stands as a trusted provider of premium commercial catering
            equipment and machinery. We proudly represent more than{" "}
            <span className="font-semibold">60 global brands</span>, ensuring
            our clients receive only the finest and most reliable products.
          </p>

          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            Our expertise extends beyond product supply. We offer
            <span className="font-semibold"> professional consulting </span>
            for hotels, cafés, and restaurants—helping businesses optimize their
            kitchen operations, enhance efficiency, and elevate culinary
            standards.
          </p>

          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            With a global approach and international shipping capabilities,
            Horeca Host welcomes clients from around the world. Our
            <span className="font-semibold">
              {" "}
              factory-to-customer business model{" "}
            </span>
            ensures high-quality products delivered directly with warranty,
            guaranteeing unmatched value and reliability.
          </p>
        </div>
      </section>
    </Container>
  );
}
