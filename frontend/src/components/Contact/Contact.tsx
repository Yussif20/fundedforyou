import { getTranslations } from "next-intl/server";
import SectionTitle from "../Global/SectionTitle";
import LinearBorder from "../Global/LinearBorder";
import ContactForm from "./ContactForm";

export default async function Contact() {
    const t = await getTranslations("Contact");

    return (
        <div id="contact-section" className="w-full max-w-2xl pb-20 md:pb-30 mx-auto">
            <LinearBorder className2="rounded-xl max-w-full!" className="rounded-xl max-w-full!">
                <div className="p-4 md:p-8 space-y-12">

                    <SectionTitle
                        title={t("title")}
                        subtitle={t("subtitle")}
                    />

                    <ContactForm />
                </div>
            </LinearBorder>
        </div>
    );
}
