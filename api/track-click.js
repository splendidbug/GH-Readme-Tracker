const REDIRECTS = {
  docscraper: "https://github.com/JuliaGenAI/DocsScraper.jl",
  pullnplot: "https://github.com/splendidbug/Pull-n-Plot",
  rcnn: "https://github.com/splendidbug/RCNN-Object-Detection",
};

export default async function handler(req, res) {
  const ip = (req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "").split(",")[0].trim();
  const ua = req.headers["user-agent"] || "";
  const id = req.query.id || "unknown";
  const redirectUrl = REDIRECTS[id] || "https://github.com/splendidbug"; // fallback if ID is missing

  // Optional: fetch geolocation
  let country = "",
    region = "",
    city = "";
  try {
    const geo = await fetch(`https://ipapi.co/${ip}/json/`);
    const data = await geo.json();
    country = data.country_name || "";
    region = data.region || "";
    city = data.city || "";
  } catch (e) {
    console.error("Geo lookup failed", e);
  }

  // Log to Google Sheet
  await fetch("https://script.google.com/macros/s/AKfycbzS3TvN2nKIV4h1-Z7jd_5Uzd5WNuXCH7feOveanyVf6oEE9cCNjsOlWE-OltCW9xHO/exec", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ip, ua, id, country, region, city }),
  });

  // Redirect to the actual GitHub repo
  res.writeHead(302, { Location: redirectUrl });
  res.end();
}
