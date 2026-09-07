// Busca as publicações mais recentes do Instagram da Melissa e atualiza
// automaticamente as fotos da seção "Instagram" e "Momentos" do site.
// Executado pelo GitHub Actions (.github/workflows/instagram-sync.yml).
//
// Variáveis de ambiente necessárias (configuradas como Secrets no GitHub):
//   IG_ACCESS_TOKEN  - token de acesso da Instagram Graph API
//   IG_USER_ID       - ID da conta profissional do Instagram

const fs = require("fs");
const path = require("path");

const ACCESS_TOKEN = process.env.IG_ACCESS_TOKEN;
const USER_ID = process.env.IG_USER_ID;
const HOW_MANY = 4; // número de posts usados na grade (moments + ig-grid)

async function main() {
  if (!ACCESS_TOKEN || !USER_ID) {
    console.error("IG_ACCESS_TOKEN ou IG_USER_ID não configurados. Abortando.");
    process.exit(1);
  }

  const fields = "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp";
  const url = `https://graph.instagram.com/${USER_ID}/media?fields=${fields}&limit=12&access_token=${ACCESS_TOKEN}`;

  const res = await fetch(url);
  const json = await res.json();

  if (json.error) {
    console.error("Erro na Instagram Graph API:", JSON.stringify(json.error, null, 2));
    process.exit(1);
  }

  const items = (json.data || [])
    .filter((it) => it.media_type === "IMAGE" || it.media_type === "CAROUSEL_ALBUM" || it.media_type === "VIDEO")
    .slice(0, HOW_MANY);

  if (items.length === 0) {
    console.log("Nenhuma publicação encontrada. Nada para atualizar.");
    return;
  }

  const outDir = path.join(__dirname, "..", "assets", "instagram");
  fs.mkdirSync(outDir, { recursive: true });

  const moments = [];
  const permalinks = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const imgUrl = item.media_type === "VIDEO" ? item.thumbnail_url : item.media_url;
    if (!imgUrl) continue;

    const imgRes = await fetch(imgUrl);
    const buffer = Buffer.from(await imgRes.arrayBuffer());
    const fileName = `post-${i}.jpg`;
    fs.writeFileSync(path.join(outDir, fileName), buffer);

    moments.push(`assets/instagram/${fileName}`);
    permalinks.push(item.permalink || "");
  }

  const dataPath = path.join(__dirname, "..", "data.json");
  const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));

  if (moments.length) {
    data.moments = moments;
    data.instagram_permalinks = permalinks;
  }

  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2) + "\n");
  console.log(`Atualizado data.json com ${moments.length} publicações do Instagram.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
