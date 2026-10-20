import { getNotFound } from "@/application/not-found/notFound";
import { SiteFrame } from "@/ui/SiteFrame";
import { NotFound } from "@/ui/sections/NotFound";
import { pageMetadata } from "./page-metadata";

const view = getNotFound();

export const metadata = pageMetadata(view.meta);

export default function NotFoundPage() {
  return (
    <SiteFrame chrome={view}>
      <NotFound view={view.page} />
    </SiteFrame>
  );
}
