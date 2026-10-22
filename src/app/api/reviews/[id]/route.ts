import { NextResponse } from "next/server";

import { deleteReview } from "@/lib/reviews-store";

export const dynamic = "force-dynamic";

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  try {
    const removed = await deleteReview(id);
    if (!removed) {
      return NextResponse.json({ error: "Review not found." }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[reviews] failed to delete review", error);
    return NextResponse.json({ error: "Could not delete the review." }, { status: 500 });
  }
}
