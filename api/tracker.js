export default async function handler(req, res) {
  const timestamp = new Date().toISOString();
  const ua = req.headers["user-agent"] || "unknown";
  const ip = req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "unknown";

  console.log(`[TRACK] ${timestamp} | IP: ${ip} | UA: ${ua}`);

  const pixel = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==", "base64");

  res.setHeader("Content-Type", "image/png");
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");

  res.status(200).send(pixel);
}
