// Mengembalikan file icon biner (favicon.ico, apple-icon.png) dari
// payload base64 di scripts/icons.json. File biner tidak bisa di-push
// lewat GitHub API berbasis teks, jadi keduanya digenerate di sini
// setiap build (vercel.json menjalankan script ini sebelum next build).
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

const payload = JSON.parse(
  readFileSync(new URL("./icons.json", import.meta.url), "utf8")
);
for (const [path, b64] of Object.entries(payload)) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, Buffer.from(b64, "base64"));
  console.log("icon digenerate:", path);
}
