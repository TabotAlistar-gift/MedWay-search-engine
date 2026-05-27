import { getItemById } from "./lib/services/search";

async function run() {
  const fdaRes = await getItemById("fda-0-22d94fd9-9488-a812-e063-6394a90a7ffc");
  console.log("FDA", JSON.stringify(fdaRes, null, 2));

  const pubmedRes = await getItemById("pubmed-42032125");
  console.log("PubMed", JSON.stringify(pubmedRes, null, 2));
}

run();
