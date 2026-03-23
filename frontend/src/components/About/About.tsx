import Image from "next/image";
import LinearBorder from "../Global/LinearBorder";
import SectionTitle from "../Global/SectionTitle";
import { getTranslations } from "next-intl/server";

export default async function About() {
  const t = await getTranslations("About");

  const members = [
    { name: t("hassanName"), role: t("ceo"), image: "/mr-hassan.jpg" },
    { name: t("omarName"), role: t("coo"), image: "/mr-omar.jpg" },
  ];

  return (
    <div id="about-section" className="space-y-12 pb-20 md:pb-30">
      {/* Main Title */}
      <SectionTitle title={t("aboutUs")} subtitle="" />

      {/* About Us Section */}
      <LinearBorder
        className="max-w-full rounded-xl ml-0.5"
        className2="w-full rounded-xl"
      >
        <div className="w-full rounded-2xl py-10 md:py-16 relative flex justify-center items-center px-4 sm:px-8 md:px-16 overflow-hidden bg-background">
          <div className="absolute w-50 aspect-square bg-primary/40 blur-[80px] -left-5 -bottom-5"></div>

          <div className="space-y-6 relative z-10">
            <h4 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-[1.3] text-transparent bg-clip-text bg-linear-to-t from-primary1 to-primary2 text-center">
              {t("aboutUs")}
            </h4>
            <p className="text-sm md:text-lg text-center max-w-4xl whitespace-pre-line leading-relaxed">
              {t("intro")}
            </p>
          </div>
        </div>
      </LinearBorder>

      {/* Vision */}
      <LinearBorder
        className="max-w-full rounded-xl ml-0.5"
        className2="w-full rounded-xl"
      >
        <div className="w-full rounded-2xl py-10 md:py-16 relative flex justify-center items-center px-4 sm:px-8 md:px-16 overflow-hidden bg-background">
          <div className="absolute w-50 aspect-square bg-primary/40 blur-[80px] right-5 -bottom-5"></div>

          <div className="space-y-6 relative z-10">
            <h4 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-[1.3] text-transparent bg-clip-text bg-linear-to-t from-primary1 to-primary2 text-center">
              {t("visionTitle")}
            </h4>
            <p className="text-sm md:text-lg text-center max-w-4xl leading-relaxed">
              {t("visionText")}
            </p>
          </div>
        </div>
      </LinearBorder>

      {/* Mission */}
      <LinearBorder
        className="max-w-full rounded-xl ml-0.5"
        className2="w-full rounded-xl"
      >
        <div className="w-full rounded-2xl py-10 md:py-16 relative px-4 sm:px-8 md:px-16 overflow-hidden bg-background">
          <div className="absolute w-50 aspect-square bg-primary/40 blur-[80px] -left-5 -bottom-5"></div>

          <div className="space-y-6 relative z-10">
            <h4 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-[1.3] text-transparent bg-clip-text bg-linear-to-t from-primary1 to-primary2 text-center">
              {t("missionTitle")}
            </h4>
            <ul className="space-y-4 max-w-4xl mx-auto">
              {t.raw("missionPoints").map((point: string, idx: number) => (
                <li
                  key={idx}
                  className="flex gap-3 items-start text-sm md:text-lg"
                >
                  <span className="text-primary font-bold mt-1">•</span>
                  <span className="leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </LinearBorder>

      {/* What We Offer */}
      <LinearBorder
        className="max-w-full rounded-xl ml-0.5"
        className2="w-full rounded-xl"
      >
        <div className="w-full rounded-2xl py-10 md:py-16 relative px-4 sm:px-8 md:px-16 overflow-hidden bg-background">
          <div className="absolute w-50 aspect-square bg-primary/40 blur-[80px] right-5 -bottom-5"></div>

          <div className="space-y-6 relative z-10">
            <h4 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-[1.3] text-transparent bg-clip-text bg-linear-to-t from-primary1 to-primary2 text-center">
              {t("whatWeOfferTitle")}
            </h4>
            <ul className="space-y-4 max-w-4xl mx-auto">
              {t.raw("whatWeOfferPoints").map((point: string, idx: number) => (
                <li
                  key={idx}
                  className="flex gap-3 items-start text-sm md:text-lg"
                >
                  <span className="text-primary font-bold mt-1">•</span>
                  <span className="leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </LinearBorder>

      {/* Commitment */}
      <LinearBorder
        className="max-w-full rounded-xl ml-0.5"
        className2="w-full rounded-xl"
      >
        <div className="w-full rounded-2xl py-10 md:py-16 relative flex justify-center items-center px-4 sm:px-8 md:px-16 overflow-hidden bg-background">
          <div className="absolute w-50 aspect-square bg-primary/40 blur-[80px] -left-5 -bottom-5"></div>

          <div className="space-y-6 relative z-10">
            <h4 className="text-2xl md:text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-linear-to-t from-primary1 to-primary2 text-center">
              {t("commitmentTitle")}
            </h4>
            <p className="text-sm md:text-lg text-center max-w-4xl whitespace-pre-line leading-relaxed">
              {t("commitmentText")}
            </p>
          </div>
        </div>
      </LinearBorder>

      {/* Founding Team */}
      <LinearBorder
        className="max-w-full rounded-xl ml-0.5"
        className2="w-full rounded-xl"
      >
        <div className="w-full rounded-2xl py-10 md:py-16 relative px-4 sm:px-8 md:px-16 overflow-hidden bg-background">
          <div className="absolute w-50 aspect-square bg-primary/40 blur-[80px] right-5 -bottom-5"></div>

            <div className="space-y-8 relative z-10">
            <div>
              <h4 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-[1.3] text-transparent bg-clip-text bg-linear-to-t from-primary1 to-primary2 text-center">
                {t("meetTitle")}
              </h4>
              <h2 className="text-xl md:text-2xl font-semibold text-center mt-2">
                {t("meetSubtitle")}
              </h2>
            </div>

            <div className="flex justify-center items-stretch gap-8 md:gap-12 flex-wrap">
              {members.map((item, idx) => (
                <div
                  key={idx}
                  className="group w-full max-w-[340px] flex flex-col items-center"
                >
                  <div className="relative w-56 h-56 sm:w-64 sm:h-64 md:w-80 md:h-80 rounded-2xl overflow-hidden ring-2 ring-primary/30 group-hover:ring-primary/60 transition-all duration-300 shadow-lg shadow-primary/10 group-hover:shadow-primary/25">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover scale-105 group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="mt-5 text-center space-y-1">
                    <h3 className="font-bold text-lg sm:text-xl lg:text-2xl">
                      {item.name}
                    </h3>
                    <h4 className="text-sm sm:text-base lg:text-lg font-medium text-transparent bg-clip-text bg-linear-to-r from-primary1 to-primary2">
                      {item.role}
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </LinearBorder>
    </div>
  );
}
