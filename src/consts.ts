import type { IconMap, SocialLink, Site } from "@/types";

export const SITE: Site = {
  title: "x4132.dev",
  description: "Hacker, Builder, Engineer.",
  href: "https://x4132.dev",
  author: "Alex S.",
  locale: "en-US",
  featuredPostCount: 2,
  postsPerPage: 5,
  twitterHandle: "@0x4132",
};

export const NAV_LINKS: SocialLink[] = [
  { href: "/blog", label: "blog" },
  { href: "/tools", label: "tools" },
  { href: "/about", label: "about" },
];

export const SOCIAL_LINKS: SocialLink[] = [
  { href: "https://x4132.dev", label: "Website" },
  { href: "https://x.com/0x4132", label: "Twitter" },
  { href: "https://github.com/x4132", label: "GitHub" },
  { href: "/rss.xml", label: "RSS" },
];

export const ICON_MAP: IconMap = {
  Website: "lucide:globe",
  GitHub: "lucide:github",
  LinkedIn: "lucide:linkedin",
  Twitter: "lucide:twitter",
  Email: "lucide:mail",
  RSS: "lucide:rss",
};
