import LinearBorder from "../Global/LinearBorder";
import SectionTitle from "../Global/SectionTitle";
import { getTranslations } from "next-intl/server";

export default async function Terms() {
    const t = await getTranslations("Terms");

    return (
        <div className="space-y-12 pb-20 md:pb-30 max-w-6xl mx-auto">
            {/* Main Title */}
            <SectionTitle
                title={t("title")}
                subtitle=""
            />

            {/* Introduction */}
            <LinearBorder
                className="max-w-full rounded-xl ml-0.5"
                className2="w-full rounded-xl"
            >
                <div className="w-full rounded-2xl py-10 md:py-16 relative px-4 sm:px-8 md:px-16 overflow-hidden bg-background">
                    <div className="absolute w-50 aspect-square bg-primary/40 blur-[80px] -left-5 -bottom-5"></div>

                    <div className="space-y-6 relative z-10">
                        <p className="text-base md:text-lg leading-relaxed whitespace-pre-line">
                            {t("intro")}
                        </p>
                    </div>
                </div>
            </LinearBorder>

            {/* Section 1: Acceptance */}
            <LinearBorder className="max-w-full rounded-xl ml-0.5" className2="w-full rounded-xl">
                <div className="w-full rounded-2xl py-10 md:py-16 relative px-4 sm:px-8 md:px-16 overflow-hidden bg-background">
                    <div className="absolute w-50 aspect-square bg-primary/40 blur-[80px] right-5 -bottom-5"></div>
                    <div className="space-y-6 relative z-10">
                        <h4 className="text-xl md:text-2xl lg:text-3xl font-bold text-transparent bg-clip-text bg-linear-to-t from-primary1 to-primary2">
                            {t("acceptance.title")}
                        </h4>
                        <p className="text-base md:text-lg leading-relaxed whitespace-pre-line">{t("acceptance.content")}</p>
                        <ul className="space-y-3">
                            {t.raw("acceptance.points").map((point: string, idx: number) => (
                                <li key={idx} className="flex gap-3 items-start text-base md:text-lg">
                                    <span className="text-primary font-bold mt-1">•</span>
                                    <span className="leading-relaxed">{point}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </LinearBorder>

            {/* Section 2: Scope */}
            <LinearBorder className="max-w-full rounded-xl ml-0.5" className2="w-full rounded-xl">
                <div className="w-full rounded-2xl py-10 md:py-16 relative px-4 sm:px-8 md:px-16 overflow-hidden bg-background">
                    <div className="absolute w-50 aspect-square bg-primary/40 blur-[80px] -left-5 -bottom-5"></div>
                    <div className="space-y-6 relative z-10">
                        <h4 className="text-xl md:text-2xl lg:text-3xl font-bold text-transparent bg-clip-text bg-linear-to-t from-primary1 to-primary2">
                            {t("scope.title")}
                        </h4>
                        <p className="text-base md:text-lg leading-relaxed whitespace-pre-line">{t("scope.content")}</p>
                        <div className="space-y-3">
                            <p className="font-semibold text-lg">{t("scope.notProvide")}</p>
                            <ul className="space-y-2">
                                {t.raw("scope.notProvideList").map((item: string, idx: number) => (
                                    <li key={idx} className="flex gap-3 items-start text-base md:text-lg">
                                        <span className="text-primary font-bold mt-1">•</span>
                                        <span className="leading-relaxed">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        {t("scope.closing") && (
                            <p className="text-base md:text-lg leading-relaxed whitespace-pre-line">{t("scope.closing")}</p>
                        )}
                    </div>
                </div>
            </LinearBorder>

            {/* Section 3: User Accounts */}
            <LinearBorder className="max-w-full rounded-xl ml-0.5" className2="w-full rounded-xl">
                <div className="w-full rounded-2xl py-10 md:py-16 relative px-4 sm:px-8 md:px-16 overflow-hidden bg-background">
                    <div className="absolute w-50 aspect-square bg-primary/40 blur-[80px] right-5 -bottom-5"></div>
                    <div className="space-y-6 relative z-10">
                        <h4 className="text-xl md:text-2xl lg:text-3xl font-bold text-transparent bg-clip-text bg-linear-to-t from-primary1 to-primary2">
                            {t("userAccounts.title")}
                        </h4>
                        <p className="text-base md:text-lg leading-relaxed whitespace-pre-line">{t("userAccounts.content")}</p>
                        <ul className="space-y-3">
                            {t.raw("userAccounts.reasons").map((reason: string, idx: number) => (
                                <li key={idx} className="flex gap-3 items-start text-base md:text-lg">
                                    <span className="text-primary font-bold mt-1">•</span>
                                    <span className="leading-relaxed">{reason}</span>
                                </li>
                            ))}
                        </ul>
                        {t("userAccounts.closing") && (
                            <p className="text-base md:text-lg leading-relaxed whitespace-pre-line">{t("userAccounts.closing")}</p>
                        )}
                    </div>
                </div>
            </LinearBorder>

            {/* Section 4: Content Guidelines */}
            <LinearBorder className="max-w-full rounded-xl ml-0.5" className2="w-full rounded-xl">
                <div className="w-full rounded-2xl py-10 md:py-16 relative px-4 sm:px-8 md:px-16 overflow-hidden bg-background">
                    <div className="absolute w-50 aspect-square bg-primary/40 blur-[80px] -left-5 -bottom-5"></div>
                    <div className="space-y-6 relative z-10">
                        <h4 className="text-xl md:text-2xl lg:text-3xl font-bold text-transparent bg-clip-text bg-linear-to-t from-primary1 to-primary2">
                            {t("contentGuidelines.title")}
                        </h4>
                        <div className="space-y-4">
                            <h5 className="text-lg md:text-xl font-semibold text-primary">{t("contentGuidelines.userContent")}</h5>
                            <p className="text-base md:text-lg leading-relaxed">{t("contentGuidelines.userContentText")}</p>
                        </div>
                        <div className="space-y-4">
                            <h5 className="text-lg md:text-xl font-semibold text-primary">{t("contentGuidelines.platformContent")}</h5>
                            <div className="space-y-2 text-base md:text-lg leading-relaxed">
                                {t("contentGuidelines.platformContentText").split("\n").map((line, i) => {
                                    const trimmed = line.trimStart();
                                    if (trimmed.startsWith("•")) {
                                        const rest = trimmed.slice(1).trimStart();
                                        return (
                                            <div key={i} className="flex gap-3 items-start">
                                                <span className="text-primary font-bold mt-1 shrink-0">•</span>
                                                <span className="leading-relaxed">{rest}</span>
                                            </div>
                                        );
                                    }
                                    return line ? <p key={i} className="whitespace-pre-line">{line}</p> : <br key={i} />;
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </LinearBorder>

            {/* Remaining sections with similar pattern */}
            {[
                { key: "listing", hasSubsections: false },
                { key: "intellectual", hasSubsections: false },
                { key: "commercial", hasSubsections: false },
                { key: "contentChar", hasSubsections: false },
                { key: "prohibited", hasSubsections: false },
                { key: "disclaimer", hasSubsections: false },
                { key: "indemnification", hasSubsections: false },
                { key: "privacy", hasSubsections: false },
                { key: "governing", hasSubsections: false },
                { key: "contact", hasSubsections: false }
            ].map((section, idx) => (
                <LinearBorder key={section.key} className="max-w-full rounded-xl ml-0.5" className2="w-full rounded-xl">
                    <div className="w-full rounded-2xl py-10 md:py-16 relative px-4 sm:px-8 md:px-16 overflow-hidden bg-background">
                        <div className={`absolute w-50 aspect-square bg-primary/40 blur-[80px] ${idx % 2 === 0 ? '-left-5' : 'right-5'} -bottom-5`}></div>
                        <div className="space-y-6 relative z-10">
                            <h4 className="text-xl md:text-2xl lg:text-3xl font-bold text-transparent bg-clip-text bg-linear-to-t from-primary1 to-primary2">
                                {t(`${section.key}.title`)}
                            </h4>
                            <div className="space-y-2 text-base md:text-lg leading-relaxed">
                                {t(`${section.key}.content`).split("\n").map((line, lineIdx) => {
                                    const trimmed = line.trimStart();
                                    if (trimmed.startsWith("•")) {
                                        const rest = trimmed.slice(1).trimStart();
                                        return (
                                            <div key={lineIdx} className="flex gap-3 items-start">
                                                <span className="text-primary font-bold mt-1 shrink-0">•</span>
                                                <span className="leading-relaxed">{rest}</span>
                                            </div>
                                        );
                                    }
                                    if (section.key === "contact" && t("contact.email")) {
                                        const email = t("contact.email");
                                        if (line.includes(email)) {
                                            const [before, ...afterParts] = line.split(email);
                                            const after = afterParts.join(email);
                                            return (
                                                <p key={lineIdx} className="whitespace-pre-line">
                                                    {before}
                                                    <a href={`mailto:${email}`} className="text-primary font-medium underline underline-offset-2 hover:opacity-90">{email}</a>
                                                    {after}
                                                </p>
                                            );
                                        }
                                    }
                                    return line ? <p key={lineIdx} className="whitespace-pre-line">{line}</p> : <br key={lineIdx} />;
                                })}
                            </div>
                            {section.hasSubsections && (
                                <ul className="space-y-3">
                                    {t.raw(`${section.key}.reasons`).map((reason: string, reasonIdx: number) => (
                                        <li key={reasonIdx} className="flex gap-3 items-start text-base md:text-lg">
                                            <span className="text-primary font-bold mt-1">•</span>
                                            <span className="leading-relaxed">{reason}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </LinearBorder>
            ))}
        </div>
    );
}
