import { NextResponse } from "next/server";
import { getPublishedProjects } from "@/lib/data";
import { isValidProjectCategory } from "@/config/categories";
import type { ProjectCategory } from "@/types";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const categoryParam = searchParams.get("category") ?? "All";
  const page = Number(searchParams.get("page") ?? "1");
  const limit = Number(searchParams.get("limit") ?? "12");

  const category: ProjectCategory | "All" =
    categoryParam === "All" || isValidProjectCategory(categoryParam)
      ? (categoryParam as ProjectCategory | "All")
      : "All";

  const result = await getPublishedProjects({
    category,
    page: Number.isFinite(page) && page > 0 ? page : 1,
    limit: Number.isFinite(limit) && limit > 0 ? Math.min(limit, 24) : 12,
  });

  return NextResponse.json(result);
}
