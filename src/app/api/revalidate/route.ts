import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
  const { path } = await req.json().catch(() => ({ path: "/" }));
  revalidatePath(path || "/");
  revalidatePath("/stone-vault");
  revalidatePath("/limited-editions");
  revalidatePath("/products");
  return NextResponse.json({ revalidated: true });
}
