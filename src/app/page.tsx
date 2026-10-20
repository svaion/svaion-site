import { getHomepage } from "@/application/homepage/homepage";
import { IconSprite } from "@/ui/brand/IconSprite";
import { RevealObserver } from "@/ui/behavior/RevealObserver";
import { Audience } from "@/ui/sections/Audience";
import { Closing } from "@/ui/sections/Closing";
import { Contact } from "@/ui/sections/Contact";
import { Demo } from "@/ui/sections/Demo";
import { Engagement } from "@/ui/sections/Engagement";
import { Faq } from "@/ui/sections/Faq";
import { Footer } from "@/ui/sections/Footer";
import { Hero } from "@/ui/sections/Hero";
import { Ledger } from "@/ui/sections/Ledger";
import { Nav } from "@/ui/sections/Nav";
import { Process } from "@/ui/sections/Process";
import { Services } from "@/ui/sections/Services";

export default function HomePage() {
  const view = getHomepage();
  return (
    <>
      <a className="skip" href="#main">{view.skipLink}</a>
      <IconSprite />
      <Nav view={view.nav} />
      <main id="main">
        <Hero view={view.hero} />
        <Demo view={view.demo} />
        <Contact view={view.contact} />
        <Audience view={view.audience} />
        <Engagement view={view.engagement} />
        <Process view={view.process} />
        <Services view={view.services} />
        <Ledger view={view.ledger} />
        <Faq view={view.faq} />
        <Closing view={view.closing} />
      </main>
      <Footer view={view.footer} />
      <RevealObserver />
    </>
  );
}
