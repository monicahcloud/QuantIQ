import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

type PublicMetadata = {
  role?: string;
};

export async function requireAdmin() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const metadata = user.publicMetadata as PublicMetadata;

  if (metadata.role !== "admin") {
    redirect("/educator-studio/dashboard");
  }

  return user;
}
