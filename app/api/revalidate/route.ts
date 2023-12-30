import { REVALIDATE_TAGS } from "@/lib/revalidate";
import { revalidateTag } from "next/cache";

export async function POST(request: Request) {
  const secret = request.headers.get("authorization")?.split(" ")[1];
  if (secret !== process.env.REVALIDATE_SECRET) {
    return Response.json({ message: "Invalid token" }, { status: 401 });
  }

  const body = await request.json();
  const tag = body.tag;
  if (typeof tag !== "string" || !REVALIDATE_TAGS.includes(tag)) {
    return Response.json({ message: "Invalid tag" }, { status: 400 });
  }

  revalidateTag(tag);
  return Response.json({ revalidated: true, now: Date.now() });
}
