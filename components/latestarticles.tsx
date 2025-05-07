"use client";

import Image from "next/image";

interface ArticleCardProps {
  imageSrc: string;
  title: string;
  description: string;
}

const ArticleCard = ({ imageSrc, title, description }: ArticleCardProps) => {
  return (
    <div className="flex flex-col items-center group w-full max-w-sm">
      <div className="w-full h-96 relative rounded-lg overflow-hidden shadow-md">
        <Image
          src={imageSrc || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 hover:scale-105 rounded-lg"
        />
      </div>
      <h3 className="text-lg font-serif mt-6 mb-3 text-left">{title}</h3>
      <p className="text-gray-600 text-left">{description}</p>
    </div>
  );
};

export default function LatestArticles() {
  const articles = [
    {
      imageSrc: "/latest articles/latestarticle1.png",
      title: "Sed malesuada venenatis eget porttitor habitasse.",
      description:
        "Facilisis venenatis varius rhoncus maecenas diam auctor pellentesque vitae. Quam adipiscing est quis aenean felis.",
    },
    {
      imageSrc: "/latest articles/latestarticle2.png",
      title: "Elit leo tincidunt aliquet vulputate.",
      description:
        "Nec fermentum nibh proin vel tortor gravida. Fringilla vitae sem facilisi proin dictum tempus erat facilisis libero.",
    },
    {
      imageSrc: "/latest articles/latestarticle3.png",
      title: "Donec placerat mattis ullamcorper dolor tortor.",
      description:
        "Accumsan duis dictum elit justo praesent cursus leo facilisi lorem. Interdum egestas lobortis pulvinar nunc non mauris viverra risus risus.",
    },
  ];

  return (
    <section className="py-16 px-6 md:py-24 bg-white text-black">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-[#1a1a1a] text-5xl md:text-6xl font-serif mb-4">
            Dive Deep to Our Latest Articles
          </h2>
          <p className="text-[#1a1a1a] text-lg max-w-3xl mx-auto">
            Stay informed with expert insights and tips on skincare and beauty
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center">
          {articles.map((article, index) => (
            <ArticleCard
              key={index}
              imageSrc={article.imageSrc}
              title={article.title}
              description={article.description}
            />
          ))}
        </div>

        <div className="mt-12 text-center">
          <button className="px-6 py-3 border border-black text-black rounded-md hover:bg-gray-100 transition">
            See All Articles
          </button>
        </div>
      </div>
    </section>
  );
}