import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { jsonSuccess } from "@/lib/api-helpers";

export const runtime = "nodejs";

function getDatabaseStatus(): "connected" | "connecting" | "disconnected" {
  const state = mongoose.connection.readyState;

  if (state === 1) {
    return "connected";
  }

  if (state === 2) {
    return "connecting";
  }

  return "disconnected";
}

export async function GET() {
  try {
    await connectDB();
    const database = getDatabaseStatus();
    const status = database === "connected" ? "ok" : "degraded";

    return jsonSuccess({
      status,
      database,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("GET /api/health error:", error);

    return jsonSuccess({
      status: "degraded",
      database: "disconnected",
      timestamp: new Date().toISOString(),
    });
  }
}
