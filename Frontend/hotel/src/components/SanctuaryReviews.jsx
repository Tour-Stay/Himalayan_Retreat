import { Container, SparklesIcon } from '@shared';

const reviews = [
  {
    quote: "Waking up to snow peaks shining in the morning sun with a warm heated bed was pure joy. The quiet peace here in Kasar Devi is something we will never forget.",
    author: 'Sunita & Arvind Sharma',
    origin: 'New Delhi • Devotees of Kainchi Dham',
    stayedIn: 'Nanda Devi Snow View Suite',
  },
  {
    quote: "The glass ceiling let us watch thousands of stars right from our warm bed. The home-cooked vegetarian food and hot ginger tea were so fresh and delicious.",
    author: 'David & Claire M.',
    origin: 'Melbourne • Peaceful Holiday',
    stayedIn: "Crank's Ridge Attic Glass Suite",
  },
  {
    quote: "We visited Kasar Devi and Jageshwar with my elderly parents. The room heater, electric bed warmers, 24-hour hot water, and direct car parking made everything so comfortable for them.",
    author: 'Raghavendra K.',
    origin: 'Bengaluru • Family Yatra',
    stayedIn: 'Cedar Family Chalet',
  },
];

const SanctuaryReviews = () => {
  return (
    <section className="py-10 sm:py-14 px-4 bg-[#FDFBF7] border-b border-[#C5A059]/20 relative">
      <Container size="lg">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10 reveal">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#FAF6EF] text-[#7C1D23] text-xs font-semibold tracking-[0.2em] uppercase mb-3 border border-[#C5A059]/30 font-cinzel">
            Guest Reviews
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl text-[#2C2523] font-medium leading-tight">
            What Our Guests Say
          </h2>
          <div className="w-16 h-0.5 bg-[#C5A059]/60 mx-auto my-4"></div>
          <p className="text-[#5C5350] text-sm sm:text-base font-normal leading-relaxed">
            Real experiences from families, pilgrims, and travelers who stayed with us at Kasar Devi.
          </p>
        </div>

        {/* 3 Review Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 reveal">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="bg-[#FAF6EF] p-7 rounded-3xl border border-[#C5A059]/30 shadow-xs flex flex-col justify-between hover:shadow-lg hover:border-[#7C1D23]/35 transition-all duration-300"
            >
              <div>
                {/* 5 Stars */}
                <div className="flex items-center gap-1 text-[#C5A059] mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-sm">★</span>
                  ))}
                  <span className="text-[11px] text-[#6B615E] ml-2 font-cinzel font-semibold">5.0</span>
                </div>

                <p className="font-serif italic text-base sm:text-lg text-[#2C2523] leading-relaxed mb-6">
                  &ldquo;{rev.quote}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-[#C5A059]/20">
                <h3 className="font-serif font-semibold text-sm text-[#7C1D23]">
                  {rev.author}
                </h3>
                <span className="text-xs text-[#6B615E] block font-sans">
                  {rev.origin}
                </span>
                <span className="text-[11px] text-[#C5A059] font-cinzel font-semibold block mt-1">
                  Stayed in: {rev.stayedIn}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Sanctuary Trust Strip */}
        <div className="mt-12 text-center text-xs text-[#6B615E] font-cinzel flex flex-wrap items-center justify-center gap-6 pt-6 border-t border-[#C5A059]/20">
          <span className="flex items-center gap-1.5 text-[#2C2523] font-semibold">
            <SparklesIcon className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>4.9 / 5 Guest Satisfaction</span>
          </span>
          <span className="hidden sm:inline text-[#C5A059]">•</span>
          <span>Warm Heated Rooms Guarantee</span>
          <span className="hidden sm:inline text-[#C5A059]">•</span>
          <span>Warm &amp; Caring Hospitality</span>
        </div>
      </Container>
    </section>
  );
};

export default SanctuaryReviews;
