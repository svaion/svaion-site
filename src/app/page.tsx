import { getHomepage } from "@/application/homepage/homepage";
import { SiteFrame } from "@/ui/SiteFrame";
import { Audience } from "@/ui/sections/Audience";
import { Closing } from "@/ui/sections/Closing";
import { Contact } from "@/ui/sections/Contact";
import { Demo } from "@/ui/sections/Demo";
import { Engagement } from "@/ui/sections/Engagement";
import { Faq } from "@/ui/sections/Faq";
import { Hero } from "@/ui/sections/Hero";
import { Ledger } from "@/ui/sections/Ledger";
import { Process } from "@/ui/sections/Process";
import { Services } from "@/ui/sections/Services";
import { pageMetadata } from "./page-metadata";

const view = getHomepage();

export const metadata = pageMetadata(view.meta);

export default function HomePage() {
  return (
    <SiteFrame chrome={view}>
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
    </SiteFrame>
  );
}
