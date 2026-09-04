import ag2 from "argon2";
import { prisma } from "./../src/lib/prisma";
import { env } from "../src/config/env";
import { Prisma } from "../generated/prisma/client";

async function main() {
  console.log("🌱 Starting database seed...");

  const password = await ag2.hash(env.password ?? "saikat2324");

  await prisma.$transaction(async (tx) => {
    const admin = await tx.user.upsert({
      where: {
        email: "admin@ecommerce.local",
      },
      update: {},
      create: {
        name: "System Admin",
        email: "admin@ecommerce.local",
        password,
        role: "ADMIN",
      },
    });

    const seller = await tx.user.upsert({
      where: {
        email: "seller@ecommerce.local",
      },
      update: {},
      create: {
        name: "Demo Seller",
        email: "seller@ecommerce.local",
        password,
        role: "SELLER",
      },
    });

    await tx.user.upsert({
      where: {
        email: "user@ecommerce.local",
      },
      update: {},
      create: {
        name: "Demo Customer",
        email: "user@gmail.local",
        password,
        role: "USER",
      },
    });

    const electronics = await tx.category.upsert({
      where: {
        name: "Electronics",
      },

      update: {},

      create: {
        name: "Electronics",
        description: "Electronic devices and accessories",
      },
    });

    const books = await tx.category.upsert({
      where: {
        name: "Books",
      },

      update: {},

      create: {
        name: "Books",
        description: "Books and educational materials",
      },
    });

    // -------------------------
    // Products
    // -------------------------
    /**
     * what is a product
     * who owns it
     * what category does it belong to
     *
     */

    const products = [
      {
        productName: "Mechanical Keyboard",
        productDesc: "RGB mechanical keyboard",
        price: "79.99",
        quantity: 100,
        categoryId: electronics.id,
      },

      {
        productName: "Wireless Mouse",
        productDesc: "Ergonomic wireless mouse",
        price: "39.99",
        quantity: 150,
        categoryId: electronics.id,
      },

      {
        productName: "TypeScript Handbook",
        productDesc: "Advanced TypeScript reference",
        price: "29.99",
        quantity: 50,
        categoryId: books.id,
      },
    ];

    for (const item of products) {
      const product = await tx.product.create({
        data: {
          productName: item.productName,
          description: item.productDesc,
          price: new Prisma.Decimal(item.price),
          categoryId: item.categoryId,
          createdById: seller.id,
          inventory: {
            create: {
              quantity: item.quantity,
            },
          },
        },
      });
      console.log(`Created product: ${product.productName}`);
    }

    console.log(`Admin: ${admin.email}`);
  });

  // seed data here

  console.log("🌱 Database seed completed.");
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
