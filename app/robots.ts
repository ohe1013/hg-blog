import { MetadataRoute } from "next";
import { getSiteBaseUrl } from "@features/notion/data";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getSiteBaseUrl();
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
