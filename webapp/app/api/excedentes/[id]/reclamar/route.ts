import { NextRequest, NextResponse } from "next/server";
import { reclamarExcedente } from "@/lib/store";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  let body: { reclamadoPor?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Cuerpo de la solicitud invalido." },
      { status: 400 }
    );
  }

  const resultado = reclamarExcedente(id, body.reclamadoPor ?? "");

  if (!resultado.ok) {
    return NextResponse.json({ error: resultado.error }, { status: 400 });
  }

  return NextResponse.json({ excedente: resultado.excedente });
}
