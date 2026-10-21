import { PrismaClient, CompanyType, VerificationStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Starting Steelsetu Burrabazar Master Seed...");

  const foundingCompany = await prisma.company.upsert({
    where: { gstin: "19AAAAA0000A1Z5" },
    update: {},
    create: {
      legalName: "Singhi Enterprises",
      brandName: "Singhi Steel & Coils",
      companyType: CompanyType.PROPRIETORSHIP,
      gstin: "19AAAAA0000A1Z5",
      verificationStatus: VerificationStatus.VERIFIED,
      isFeatured: true,
      yearsInBusiness: 18,
      registeredAddress: "Lohapati, Burrabazar",
      city: "Kolkata",
      state: "West Bengal",
      pincode: "700007",
      areaMarket: "Burrabazar - Lohapati",
      profileCompleteness: 100,
    },
  });

  console.log("✓ Seeded Founding Company Successfully:", foundingCompany.legalName);
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });