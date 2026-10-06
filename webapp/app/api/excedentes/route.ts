import { NextRequest, NextResponse } from "next/server";
import { crearExcedente, listarExcedentes } from "@/lib/store";
import { EstadoExcedente, NuevoExcedenteInput } from "@/lib/types";

const ESTADOS_VALIDOS: EstadoExcedente[] = [
  "disponible",
  "reclamado",
  "confirmado",
  "certificado",
];

export async function GET(request: NextRequest) {
  const estadoParam = request.nextUrl.searchParams.get("estado");

  if (estadoParam && !ESTADOS_VALIDOS.includes(estadoParam as EstadoExcedente)) {
    return NextResponse.json(
      { error: `Estado invalido: ${estadoParam}` },
      { status: 400 }
    );
  }

  const excedentes = listarExcedentes(estadoParam as EstadoExcedente | undefined);
  return NextResponse.json({ excedentes });
}

export async function POST(request: NextRequest) {
  let body: NuevoExcedenteInput;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Cuerpo de la solicitud invalido." },
      { status: 400 }
    );
  }

  const resultado = crearExcedente(body);

  if (!resultado.ok) {
    return NextResponse.json({ error: resultado.error }, { status: 400 });
  }

  return NextResponse.json({ excedente: resultado.excedente }, { status: 201 });
}
