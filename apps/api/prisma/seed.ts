import { PrismaClient } from "@prisma/client";
import { STARTER_VEHICLES } from "@morphdrive/shared";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding MorphDrive database...");

  // 1. Seed Vehicle Bases
  for (const v of STARTER_VEHICLES) {
    await prisma.vehicleBase.upsert({
      where: { id: v.id },
      update: {
        name: v.name,
        description: v.description,
        glbAssetUrl: v.glbAssetUrl,
        defaultMorphSettings: v.defaultMorphSettings,
        defaultColors: v.defaultColors,
        baseTuning: v.baseTuning,
      },
      create: {
        id: v.id,
        name: v.name,
        description: v.description,
        glbAssetUrl: v.glbAssetUrl,
        defaultMorphSettings: v.defaultMorphSettings,
        defaultColors: v.defaultColors,
        baseTuning: v.baseTuning,
      },
    });
    console.log(`  ✓ Seeded vehicle base: ${v.name}`);
  }

  // 2. Seed Default Tracks
  const tracks = [
    {
      id: "neon-canyon",
      name: "Neon Canyon GP",
      description: "High-speed sweeping canyon with vertical drop ramps and booster pads.",
      glbTrackUrl: "/models/track_neon_canyon.glb",
      lengthMeters: 4200.0,
      checkpointCount: 6,
    },
    {
      id: "cyber-grid",
      name: "Cyber Grid Testbed",
      description: "Modular proving ground with dirt humps, slalom gates, and flight launch-rails.",
      glbTrackUrl: "/models/track_cyber_grid.glb",
      lengthMeters: 2500.0,
      checkpointCount: 4,
    },
  ];

  for (const t of tracks) {
    await prisma.track.upsert({
      where: { id: t.id },
      update: t,
      create: t,
    });
    console.log(`  ✓ Seeded track: ${t.name}`);
  }

  console.log("✅ Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
