import { NextResponse } from "next/server";

import { runKavachDemo } from "@/lib/kavach-demo";

export async function POST() {
  return NextResponse.json(runKavachDemo());
}
