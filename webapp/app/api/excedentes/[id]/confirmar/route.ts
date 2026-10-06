import { NextRequest, NextResponse } from "next/server";
import { confirmarExcedente } from "@/lib/store";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const resultado = confirmarExcedente(id);

  if (!resultado.ok) {
    return NextResponse.json({ error: resultado.error }, { status: 400 });
  }

  return NextResponse.json({ excedente: resultado.excedente });
}
