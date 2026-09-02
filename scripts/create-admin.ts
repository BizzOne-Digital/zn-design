import bcrypt from "bcryptjs";
import { loadEnv } from "./load-env";

loadEnv();

const SALT_ROUNDS = 12;

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

async function main(): Promise<void> {
  const email = requireEnv("ADMIN_EMAIL").toLowerCase();
  const password = requireEnv("ADMIN_INITIAL_PASSWORD");

  if (password.length < 8) {
    throw new Error("ADMIN_INITIAL_PASSWORD must be at least 8 characters.");
  }

  const { connectDB } = await import("../src/lib/db");
  const AdminUser = (await import("../src/models/AdminUser")).default;

  await connectDB();

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const admin = await AdminUser.findOneAndUpdate(
    { email },
    {
      $set: {
        email,
        passwordHash,
        name: "Zafreen Nihmathullah",
      },
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
      runValidators: true,
    },
  );

  console.log(`Admin user ready: ${admin.email}`);
  console.log("Password was set from ADMIN_INITIAL_PASSWORD and was not logged.");
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((error: unknown) => {
    console.error("create-admin failed:", error);
    process.exit(1);
  });
