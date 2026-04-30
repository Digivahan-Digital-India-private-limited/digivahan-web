import React from "react";
import { Helmet } from "react-helmet";
import { useLocation } from "react-router-dom";
import { getCanonicalUrl, getSeoMeta, seoSiteConfig } from "../../utils/seoConfig";

const SeoHead = () => {
  const { pathname } = useLocation();
  const pageMeta = getSeoMeta(pathname);
  const canonicalUrl = getCanonicalUrl(pathname);
  const ogImage = pageMeta.image.startsWith("http")
    ? pageMeta.image
    : `${seoSiteConfig.siteUrl}${pageMeta.image}`;

  return (
    <Helmet>
      <title>{pageMeta.title}</title>
      <meta name="description" content={pageMeta.description} />
      <meta name="keywords" content={pageMeta.keywords} />
      <meta name="robots" content={pageMeta.robots} />

      <link rel="canonical" href={canonicalUrl} />

      <meta property="og:site_name" content={seoSiteConfig.siteName} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={pageMeta.title} />
      <meta property="og:description" content={pageMeta.description} />
      <meta property="og:image" content={ogImage} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageMeta.title} />
      <meta name="twitter:description" content={pageMeta.description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
};

export default SeoHead;
