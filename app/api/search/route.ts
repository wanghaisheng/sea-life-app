import { searchSpecies } from "@/utils/actions"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const results = await searchSpecies(searchParams.get("q") || "")

  return Response.json(results)
}
