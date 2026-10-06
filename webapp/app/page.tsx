import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function LandingPage() {
  return (
    <div className="flex flex-col gap-16">
      <section className="flex flex-col gap-6 py-6 text-center sm:py-10">
        <span className="mx-auto rounded-full bg-secondary px-4 py-1 text-xs font-medium uppercase tracking-wide text-secondary-foreground">
          Hackathon reduccion de desperdicio de alimentos
        </span>
        <h1 className="mx-auto max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
          Conectamos excedente apto para consumo con quien lo necesita.
        </h1>
        <p className="mx-auto max-w-2xl text-balance text-muted-foreground sm:text-lg">
          Sobra+ es un portal de redistribucion que centraliza la oferta de
          restaurantes, universidades, grandes cocinas y comercio con la
          demanda de bancos de alimentos y ESAL aliadas, y entrega al
          establecimiento donante un certificado de donacion respaldado por la
          ley.
        </p>
        <div className="mx-auto flex flex-wrap items-center justify-center gap-3">
          <Link href="/excedentes/nuevo">
            <Button size="lg">Publicar excedente</Button>
          </Link>
          <Link href="/panel">
            <Button size="lg" variant="outline">
              Ver panel
            </Button>
          </Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl text-primary">34%</CardTitle>
            <CardDescription>
              de los alimentos producidos en Colombia se pierden o
              desperdician cada ano.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl text-primary">9,76M</CardTitle>
            <CardDescription>
              toneladas de alimentos perdidas o desperdiciadas al ano en el
              pais (dato DNP, citado en la Ley 1990 de 2019).
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl text-primary">37%</CardTitle>
            <CardDescription>
              de descuento tributario, mas exclusion de IVA, para quien dona
              alimentos a bancos de alimentos (Ley 2380 de 2024).
            </CardDescription>
          </CardHeader>
        </Card>
      </section>

      <section className="grid gap-8 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-semibold">El problema</h2>
          <p className="text-muted-foreground">
            En universidades, restaurantes, eventos, zonas comerciales y
            grandes cocinas se generan diariamente excedentes de alimentos
            aptos para consumo que terminan convertidos en residuos. No es
            falta de mecanismos de donacion: es friccion de proceso, falta de
            visibilidad entre quien tiene el excedente y quien lo necesita, y
            falta de un incentivo economico claro para quien dona.
          </p>
          <p className="text-muted-foreground">
            Segun datos del Departamento Nacional de Planeacion (DNP),
            Colombia pierde el 34% de los alimentos producidos, equivalente a
            9,76 millones de toneladas cada ano, mientras mas de 7,8 millones
            de personas enfrentan inseguridad alimentaria aguda.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-semibold">Marco legal</h2>
          <div className="flex flex-col gap-3">
            <Card>
              <CardContent className="pt-5">
                <p className="font-medium text-foreground">Ley 1990 de 2019</p>
                <p className="text-sm text-muted-foreground">
                  Crea la politica nacional contra la perdida y el desperdicio
                  de alimentos, fija el orden de prioridad legal (reduccion y
                  consumo humano antes que otros usos) y asigna la medicion
                  oficial al DANE.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-5">
                <p className="font-medium text-foreground">Ley 2380 de 2024</p>
                <p className="text-sm text-muted-foreground">
                  Otorga un descuento tributario del 37% y exclusion de IVA
                  por donar alimentos a bancos de alimentos constituidos como
                  entidades sin animo de lucro de regimen tributario especial.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-5">
                <p className="font-medium text-foreground">Ley 2536 de 2025</p>
                <p className="text-sm text-muted-foreground">
                  Habilita la donacion de alimentos incautados o decomisados
                  aptos para consumo, elimina la barrera para donar alimentos
                  vencidos pero seguros, crea un fondo nacional y habilita
                  sanciones por desperdicio injustificado.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold">El modelo</h2>
        <p className="max-w-3xl text-muted-foreground">
          Sobra+ opera como portal intermediario: visibiliza y centraliza el
          excedente apto para consumo humano de establecimientos generadores,
          y lo conecta con puntos receptores (bancos de alimentos, ESAL
          aliadas). Mientras la entidad propia tramita su reconocimiento como
          ESAL con regimen tributario especial ante la DIAN, el flujo de
          certificacion se demuestra en alianza con ESAL ya reconocidas, en
          particular ABACO (Asociacion de Bancos de Alimentos de Colombia) y
          la red de Bancos de Alimentos de Colombia.
        </p>
        <p className="max-w-3xl text-sm text-muted-foreground">
          Para volumenes grandes, el modelo contempla alianzas con
          distribuidores logisticos que apoyen la recoleccion cuando el punto
          receptor no da abasto operativamente.
        </p>
      </section>

      <section className="flex flex-col items-center gap-4 rounded-lg border border-border bg-secondary/40 p-8 text-center">
        <h2 className="text-2xl font-semibold">Ver el portal en accion</h2>
        <p className="max-w-xl text-muted-foreground">
          Publica un excedente como establecimiento, cambia tu rol a punto
          receptor para reclamarlo, confirma la recepcion y revisa el
          certificado de donacion generado.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href="/excedentes/nuevo">
            <Button>Publicar excedente</Button>
          </Link>
          <Link href="/excedentes">
            <Button variant="outline">Ver disponibles</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
