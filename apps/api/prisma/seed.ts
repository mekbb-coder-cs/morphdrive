import { PrismaClient, Role } from "@prisma/client";
import { hash } from "@node-rs/argon2";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding MorphDrive Enterprise Educational Database...");

  // 1. Seed Default Accounts (Student, Instructor, Admin)
  const defaultPasswordHash = await hash("password123");

  const users = [
    { email: "student@morphdrive.io", username: "alex_chen", role: Role.STUDENT },
    { email: "instructor@morphdrive.io", username: "prof_vance", role: Role.INSTRUCTOR },
    { email: "admin@morphdrive.io", username: "sarah_admin", role: Role.ADMIN },
  ];

  for (const u of users) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: { username: u.username, role: u.role },
      create: {
        email: u.email,
        username: u.username,
        passwordHash: defaultPasswordHash,
        role: u.role,
      },
    });
    console.log(`  ✓ Seeded ${u.role} user: ${u.username} (${u.email})`);
  }

  // 2. Seed 4 Educational Machines, Parts, and Steps from Phase 3 JSONs
  const modelsDir = path.resolve("apps/web/public/models");
  const machineFiles = [
    "single_cylinder_engine.json",
    "gearbox.json",
    "landing_gear_strut.json",
    "turbine_stage.json",
  ];

  for (const file of machineFiles) {
    const filePath = path.join(modelsDir, file);
    if (!fs.existsSync(filePath)) {
      console.warn(`  ⚠ Metadata file missing: ${filePath}, skipping`);
      continue;
    }

    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    // Upsert Machine
    const machine = await prisma.machine.upsert({
      where: { id: data.machineId },
      update: {
        slug: data.machineId,
        name: data.name,
        category: data.category,
        description: data.description,
        glbModelUrl: data.glbAssetUrl,
        difficulty: data.difficulty || "INTERMEDIATE",
        baseStats: { totalTriangles: data.totalTriangles },
      },
      create: {
        id: data.machineId,
        slug: data.machineId,
        name: data.name,
        category: data.category,
        description: data.description,
        glbModelUrl: data.glbAssetUrl,
        difficulty: data.difficulty || "INTERMEDIATE",
        baseStats: { totalTriangles: data.totalTriangles },
      },
    });
    console.log(`  ✓ Seeded machine: ${machine.name}`);

    // Upsert Parts
    const partMap = new Map<string, string>(); // meshName -> part.id
    for (const p of data.parts) {
      const part = await prisma.part.upsert({
        where: {
          machineId_meshName: {
            machineId: machine.id,
            meshName: p.meshName,
          },
        },
        update: {
          name: p.displayName,
          material: p.material,
          description: p.function,
          function: p.function,
          massKg: p.massKg || 1.0,
          kinematicType: p.kinematicType || "RIGID",
          boundingVolume: { pivotOrigin: p.pivotOrigin },
        },
        create: {
          machineId: machine.id,
          meshName: p.meshName,
          name: p.displayName,
          material: p.material,
          description: p.function,
          function: p.function,
          massKg: p.massKg || 1.0,
          kinematicType: p.kinematicType || "RIGID",
          boundingVolume: { pivotOrigin: p.pivotOrigin },
        },
      });
      partMap.set(p.meshName, part.id);
    }
    console.log(`    ↳ Seeded ${data.parts.length} parts for ${machine.name}`);

    // Upsert Assembly Steps
    for (const s of data.assemblySteps || []) {
      const partId = partMap.get(s.meshName);
      if (!partId) continue;

      await prisma.assemblyStep.upsert({
        where: {
          machineId_stepOrder: {
            machineId: machine.id,
            stepOrder: s.stepOrder,
          },
        },
        update: {
          partId,
          action: s.action || "DISASSEMBLE",
          targetPosition: s.endTransform.position,
          targetRotation: s.endTransform.rotation,
          tolerance: s.tolerance || 0.05,
          hint: s.hint,
          safetyWarning: s.safetyWarning,
        },
        create: {
          machineId: machine.id,
          partId,
          stepOrder: s.stepOrder,
          action: s.action || "DISASSEMBLE",
          targetPosition: s.endTransform.position,
          targetRotation: s.endTransform.rotation,
          tolerance: s.tolerance || 0.05,
          hint: s.hint,
          safetyWarning: s.safetyWarning,
        },
      });
    }
    console.log(`    ↳ Seeded ${data.assemblySteps?.length || 0} assembly steps for ${machine.name}`);
  }

  console.log("✅ Educational database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
