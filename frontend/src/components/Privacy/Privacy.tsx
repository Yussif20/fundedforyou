import LinearBorder from "../Global/LinearBorder";
import SectionTitle from "../Global/SectionTitle";
import { getLocale, getTranslations } from "next-intl/server";

type Subsection = {
  subtitle: string;
  content?: string;
  points?: string[];
};

type Section = {
  title: string;
  content?: string;
  points?: string[];
  subsections?: Subsection[];
  closing?: string;
};

export default async function Privacy() {
  const t = await getTranslations("Privacy");
  const locale = await getLocale();
  const isArabic = locale === "ar";

  const sections: Section[] = [
    {
      title: t("dataCollection.title"),
      content: t("dataCollection.intro"),
      subsections: [
        {
          subtitle: t("dataCollection.personal.title"),
          content: t("dataCollection.personal.content"),
          points: t.raw("dataCollection.personal.points") as string[],
        },
        {
          subtitle: t("dataCollection.nonPersonal.title"),
          content: t("dataCollection.nonPersonal.content"),
          points: t.raw("dataCollection.nonPersonal.points") as string[],
        },
        ...(!isArabic
          ? [
              {
                subtitle: t("dataCollection.analytics.title"),
                content: t("dataCollection.analytics.content"),
              },
            ]
          : []),
        {
          subtitle: t("dataCollection.cookies.title"),
          content: t("dataCollection.cookies.content"),
        },
        ...(!isArabic
          ? [
              {
                subtitle: t("dataCollection.consent.title"),
                content: t("dataCollection.consent.content"),
              },
            ]
          : []),
        {
          subtitle: t("dataCollection.thirdPartySources.title"),
          content: t("dataCollection.thirdPartySources.content"),
        },
      ],
    },
    {
      title: t("purpose.title"),
      content: t("purpose.intro"),
      subsections: [
        {
          subtitle: t("purpose.provide.title"),
          content: t("purpose.provide.content"),
        },
        {
          subtitle: t("purpose.improve.title"),
          content: t("purpose.improve.content"),
        },
        {
          subtitle: t("purpose.communicate.title"),
          content: t("purpose.communicate.content"),
        },
        {
          subtitle: t("purpose.marketing.title"),
          content: t("purpose.marketing.content"),
        },
        {
          subtitle: t("purpose.compliance.title"),
          content: t("purpose.compliance.content"),
        },
        {
          subtitle: t("purpose.protect.title"),
          content: t("purpose.protect.content"),
        },
      ],
      closing: t("purpose.closing"),
    },
    {
      title: t("dataSharing.title"),
      content: t("dataSharing.intro"),
      subsections: [
        {
          subtitle: t("dataSharing.withConsent.title"),
          content: t("dataSharing.withConsent.content"),
        },
        {
          subtitle: t("dataSharing.providers.title"),
          content: t("dataSharing.providers.content"),
        },
        {
          subtitle: t("dataSharing.legal.title"),
          content: t("dataSharing.legal.content"),
        },
        {
          subtitle: t("dataSharing.business.title"),
          content: t("dataSharing.business.content"),
        },
        {
          subtitle: t("dataSharing.aggregated.title"),
          content: t("dataSharing.aggregated.content"),
        },
      ],
    },
    {
      title: t("retention.title"),
      content: t("retention.intro"),
      subsections: [
        {
          subtitle: t("retention.period.title"),
          content: t("retention.period.content"),
        },
        ...(!isArabic
          ? [
              {
                subtitle: t("retention.analytics.title"),
                content: t("retention.analytics.content"),
              },
            ]
          : []),
        {
          subtitle: t("retention.deletion.title"),
          content: t("retention.deletion.content"),
        },
        ...(!isArabic
          ? [
              {
                subtitle: t("retention.storage.title"),
                content: t("retention.storage.content"),
              },
            ]
          : []),
        {
          subtitle: t("retention.security.title"),
          content: t("retention.security.content"),
        },
      ],
    },
    {
      title: t("rights.title"),
      content: t("rights.intro"),
      subsections: [
        {
          subtitle: t("rights.access.title"),
          content: t("rights.access.content"),
        },
        {
          subtitle: t("rights.correction.title"),
          content: t("rights.correction.content"),
        },
        {
          subtitle: t("rights.deletion.title"),
          content: t("rights.deletion.content"),
        },
        ...(!isArabic
          ? [
              {
                subtitle: t("rights.restriction.title"),
                content: t("rights.restriction.content"),
              },
            ]
          : []),
        {
          subtitle: t("rights.session.title"),
          content: t("rights.session.content"),
        },
        ...(!isArabic
          ? [
              {
                subtitle: t("rights.objection.title"),
                content: t("rights.objection.content"),
              },
              {
                subtitle: t("rights.withdraw.title"),
                content: t("rights.withdraw.content"),
              },
              {
                subtitle: t("rights.complaints.title"),
                content: t("rights.complaints.content"),
              },
            ]
          : []),
        {
          subtitle: t("rights.optout.title"),
          content: t("rights.optout.content"),
        },
        {
          subtitle: t("rights.cookies.title"),
          content: t("rights.cookies.content"),
        },
      ],
    },
    {
      title: t("security.title"),
      content: t("security.intro"),
      subsections: [
        {
          subtitle: t("security.practices.title"),
          content: t("security.practices.content"),
        },
        {
          subtitle: t("security.responsibilities.title"),
          content: t("security.responsibilities.content"),
        },
        {
          subtitle: t("security.limitations.title"),
          content: t("security.limitations.content"),
        },
      ],
    },
    {
      title: t("thirdParty.title"),
      content: t("thirdParty.content"),
    },
    {
      title: t("children.title"),
      content: t("children.content"),
    },
    {
      title: t("international.title"),
      content: t("international.content"),
    },
    {
      title: t("changes.title"),
      content: t("changes.content"),
    },
    {
      title: t("contact.title"),
      content: t("contact.content"),
    },
  ];

  return (
    <div className="space-y-12 pb-20 md:pb-30 max-w-6xl mx-auto">
      <SectionTitle title={t("title")} subtitle="" />

      {/* Introduction */}
      <LinearBorder
        className="max-w-full rounded-xl ml-0.5"
        className2="w-full rounded-xl"
      >
        <div className="w-full rounded-2xl py-10 md:py-16 relative px-4 sm:px-8 md:px-16 overflow-hidden bg-background">
          <div className="absolute w-50 aspect-square bg-primary/40 blur-[80px] -left-5 -bottom-5"></div>
          <div className="space-y-6 relative z-10">
            <p className="text-base md:text-lg leading-relaxed">{t("intro")}</p>
            <p className="text-base md:text-lg font-semibold text-primary">
              {t("introHeader")}
            </p>
            <ul className="space-y-3">
              {(t.raw("introPoints") as string[]).map(
                (point: string, idx: number) => (
                  <li
                    key={idx}
                    className="flex gap-3 items-start text-base md:text-lg"
                  >
                    <span className="text-primary font-bold mt-1">•</span>
                    <span className="leading-relaxed">{point}</span>
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>
      </LinearBorder>

      {/* Sections */}
      {sections.map((section, idx) => (
        <LinearBorder
          key={idx}
          className="max-w-full rounded-xl ml-0.5"
          className2="w-full rounded-xl"
        >
          <div className="w-full rounded-2xl py-10 md:py-16 relative px-4 sm:px-8 md:px-16 overflow-hidden bg-background">
            <div
              className={`absolute w-50 aspect-square bg-primary/40 blur-[80px] ${idx % 2 === 0 ? "-left-5" : "right-5"} -bottom-5`}
            ></div>

            <div className="space-y-6 relative z-10">
              <h4 className="text-xl md:text-2xl lg:text-3xl font-bold text-transparent bg-clip-text bg-linear-to-t from-primary1 to-primary2">
                {section.title}
              </h4>

              {section.content && (
                <p className="text-base md:text-lg leading-relaxed">
                  {section.content}
                </p>
              )}

              {section.subsections &&
                section.subsections.map((sub, subIdx) => (
                  <div key={subIdx} className="space-y-4">
                    <h5 className="text-lg md:text-xl font-semibold text-primary">
                      {sub.subtitle}
                    </h5>
                    {sub.content && (
                      <p className="text-base md:text-lg leading-relaxed">
                        {sub.content}
                      </p>
                    )}
                    {sub.points && (
                      <ul className="space-y-3">
                        {sub.points.map((point: string, pointIdx: number) => (
                          <li
                            key={pointIdx}
                            className="flex gap-3 items-start text-base md:text-lg"
                          >
                            <span className="text-primary font-bold mt-1">
                              •
                            </span>
                            <span className="leading-relaxed">{point}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}

              {section.points && (
                <ul className="space-y-4">
                  {section.points.map((point: string, pointIdx: number) => (
                    <li
                      key={pointIdx}
                      className="flex gap-3 items-start text-base md:text-lg"
                    >
                      <span className="text-primary font-bold mt-1">•</span>
                      <span className="leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              )}

              {section.closing && (
                <p className="text-base md:text-lg leading-relaxed">
                  {section.closing}
                </p>
              )}
            </div>
          </div>
        </LinearBorder>
      ))}
    </div>
  );
}
