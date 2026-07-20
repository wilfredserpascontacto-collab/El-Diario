import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL no está configurado");
}

const adapter = new PrismaPg(process.env.DATABASE_URL);
const prisma = new PrismaClient({ adapter });

const categories = [
  { name: "Deportes", slug: "deportes" },
  { name: "Tecnología", slug: "tecnologia" },
  { name: "Economía", slug: "economia" },
  { name: "Cultura", slug: "cultura" },
  { name: "Internacional", slug: "internacional" },
  { name: "Salud", slug: "salud" },
];

async function main() {
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }

  const tecnologia = await prisma.category.findUniqueOrThrow({
    where: { slug: "tecnologia" },
  });
  const deportes = await prisma.category.findUniqueOrThrow({
    where: { slug: "deportes" },
  });
  const economia = await prisma.category.findUniqueOrThrow({
    where: { slug: "economia" },
  });

  const articles = [
    {
      title: "Nueva inteligencia artificial promete transformar la industria",
      slug: "nueva-ia-transforma-industria",
      excerpt:
        "Una startup local presenta un modelo capaz de automatizar tareas complejas en tiempo récord.",
      content:
        "La compañía anunció hoy el lanzamiento de su nuevo modelo de inteligencia artificial, diseñado para automatizar procesos que antes tomaban horas de trabajo manual. Según sus desarrolladores, la herramienta ya está siendo probada por varias empresas del sector.\n\nLos primeros resultados muestran una reducción significativa en los tiempos de producción, aunque los expertos piden cautela y advierten sobre la necesidad de regulación.",
      coverImageUrl:
        "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200",
      published: true,
      publishedAt: new Date(),
      categoryId: tecnologia.id,
    },
    {
      title: "El equipo local clasifica a la final tras un partido histórico",
      slug: "equipo-local-clasifica-final",
      excerpt:
        "Con un gol en el último minuto, el equipo aseguró su lugar en la gran final del torneo.",
      content:
        "En un partido cargado de emoción, el equipo local logró remontar el marcador en los minutos finales para asegurar su clasificación a la final del torneo. Los hinchas celebraron en las calles tras el pitido final.\n\nEl técnico destacó el esfuerzo colectivo del plantel y adelantó que el equipo llega en su mejor momento de la temporada.",
      coverImageUrl:
        "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1200",
      published: true,
      publishedAt: new Date(),
      categoryId: deportes.id,
    },
    {
      title: "La inflación muestra signos de desaceleración este trimestre",
      slug: "inflacion-desaceleracion-trimestre",
      excerpt:
        "Analistas señalan una ligera baja en los precios de productos básicos durante los últimos meses.",
      content:
        "Los últimos datos oficiales indican una desaceleración en el ritmo de crecimiento de los precios, especialmente en alimentos y combustibles. Economistas consultados coinciden en que la tendencia podría mantenerse si continúan las políticas actuales.\n\nSin embargo, advierten que persisten riesgos externos que podrían revertir esta mejora en los próximos meses.",
      coverImageUrl:
        "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200",
      published: true,
      publishedAt: new Date(),
      categoryId: economia.id,
    },
  ];

  for (const article of articles) {
    await prisma.article.upsert({
      where: { slug: article.slug },
      update: {},
      create: article,
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
