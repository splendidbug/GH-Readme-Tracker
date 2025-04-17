export default async function handler(req, res) {
  const ua = req.headers["user-agent"] || "unknown";
  const ip = (req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "").split(",")[0].trim();
  const id = req.query.id || "not-provided";

  let location = {
    city: "",
    region: "",
    country: "",
  };

  try {
    const locRes = await fetch(`https://ipapi.co/${ip}/json/`);
    const locData = await locRes.json();
    location = {
      city: locData.city || "",
      region: locData.region || "",
      country: locData.country_name || "",
    };
  } catch (e) {
    console.error("Geo lookup failed:", e);
  }

  // Send to Google Sheets
  await fetch("https://script.google.com/macros/s/AKfycbzS3TvN2nKIV4h1-Z7jd_5Uzd5WNuXCH7feOveanyVf6oEE9cCNjsOlWE-OltCW9xHO/exec", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ip,
      ua,
      id,
      city: location.city,
      region: location.region,
      country: location.country,
    }),
  });

  // Return 1x1 pixel
  const pixel = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==", "base64");

  res.setHeader("Content-Type", "image/png");
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");

  res.status(200).send(pixel);
}
