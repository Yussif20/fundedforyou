import { getTranslations } from 'next-intl/server';
import Container from '../Global/Container';
import SubscribeForm from './SubscribeForm';

export default async function Subscribe() {
    const t = await getTranslations('Subscribe');

    return (
      <Container className="pb-10 md:pb-16 flex flex-col items-center md:block">
        <div className="w-full relative flex justify-center items-center overflow-hidden rounded-2xl border border-primary/40 bg-linear-to-b from-primary/5 to-primary/10 py-14 md:py-20 px-6 sm:px-10 md:px-16 shadow-[0_0_0_1px_rgba(5,150,102,0.06),0_4px_24px_rgba(5,150,102,0.08)] hover:shadow-[0_0_0_1px_rgba(5,150,102,0.1),0_8px_32px_rgba(5,150,102,0.12)] transition-all duration-300">
          {/* Soft glow accents */}
          <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
            <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-primary/20 blur-[120px] rounded-full" />
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/15 blur-[100px] rounded-full" />
          </div>

          <div className="relative z-10 w-full max-w-2xl space-y-7 text-center flex flex-col items-center md:block">
            <div className="space-y-2">
              <p className="text-xs md:text-sm font-medium tracking-[0.2em] text-primary uppercase opacity-90">
                {t("stayConnected")}
              </p>
              <h2 className="text-xl md:text-3xl lg:text-4xl font-bold text-foreground tracking-tight sm:whitespace-nowrap">
                {t("title")}
              </h2>
            </div>
            <div className="flex justify-center w-full max-w-xl mx-auto">
              <SubscribeForm />
            </div>
          </div>
        </div>
      </Container>
    );
}
