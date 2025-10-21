import { SafeSearchType, search } from "duck-duck-scrape";

export async function GET() {
  const searchResults = search("gpt codex 5", {
    safeSearch: SafeSearchType.STRICT,
    locale: "en-US",
  }).then((data) => {
    return Response.json(data);
  });
}
