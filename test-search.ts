import { unifiedSearch, getSearchOverview } from "./lib/services/search";

async function run() {
  const query = "Who is the father of medicine?";
  console.log(`Searching for: ${query}`);
  const [results, overview] = await Promise.all([
    unifiedSearch(query),
    getSearchOverview(query)
  ]);
  
  console.log("--- Results ---");
  console.log(JSON.stringify(results.slice(0, 2), null, 2));
  console.log("\n--- Overview ---");
  console.log(JSON.stringify(overview, null, 2));
}

run();
