import { SITE } from "@/data/site";

export interface SeoProps {
  title: string;
  description?: string;
  image?: string;
  canonical?: string;
  noindex?: boolean;
}

export function resolveSeo(props: SeoProps): Required<SeoProps> {
  return {
    title: props.title,
    description: props.description ?? SITE.defaultDescription,
    image: props.image ?? SITE.ogImage,
    canonical: props.canonical ?? "",
    noindex: props.noindex ?? false,
  };
}
