import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { url } = req.query;

  if (!url || typeof url !== "string") {
    return res.status(400).json({});
  }

  let parsed: URL;
  try {
    parsed = new URL(url);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") throw new Error();
  } catch {
    return res.status(400).json({});
  }

  try {
    const response = await fetch(parsed.href, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; Mangerine-Preview/1.0)",
        Accept: "text/html",
      },
      signal: AbortSignal.timeout(5000),
    });

    const html = await response.text();

    const getMeta = (prop: string): string | null => {
      const patterns = [
        new RegExp(`<meta[^>]+property=["']${prop}["'][^>]+content=["']([^"']+)["']`, "i"),
        new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${prop}["']`, "i"),
        new RegExp(`<meta[^>]+name=["']${prop}["'][^>]+content=["']([^"']+)["']`, "i"),
        new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+name=["']${prop}["']`, "i"),
      ];
      for (const p of patterns) {
        const m = html.match(p);
        if (m?.[1]) return m[1].trim();
      }
      return null;
    };

    const title =
      getMeta("og:title") ||
      getMeta("twitter:title") ||
      html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]?.trim() ||
      null;

    const description =
      getMeta("og:description") ||
      getMeta("twitter:description") ||
      getMeta("description") ||
      null;

    const image =
      getMeta("og:image") ||
      getMeta("twitter:image") ||
      null;

    // Cache for 24 hours
    res.setHeader("Cache-Control", "s-maxage=86400, stale-while-revalidate");
    return res.json({ title, description, image });
  } catch {
    return res.status(200).json({});
  }
}
