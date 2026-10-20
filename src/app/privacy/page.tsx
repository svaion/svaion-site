import { getPrivacyNotice } from "@/application/privacy/privacy";
import { getSiteChrome, routes } from "@/application/site/site";
import { SiteFrame } from "@/ui/SiteFrame";
import { PrivacyNotice } from "@/ui/sections/PrivacyNotice";
import "@/ui/styles/prose.css";
import { pageMetadata } from "../page-metadata";

const view = getPrivacyNotice();

export const metadata = pageMetadata({ ...view.meta, path: routes.privacy });

export default function PrivacyPage() {
  return (
    <SiteFrame chrome={getSiteChrome("subpage")}>
      <PrivacyNotice view={view} />
    </SiteFrame>
  );
}
