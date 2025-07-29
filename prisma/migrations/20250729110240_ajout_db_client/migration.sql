-- CreateTable
CREATE TABLE "Client" (
    "id" SERIAL NOT NULL,
    "nomEntreprise" TEXT NOT NULL,
    "urlEntreprise" TEXT NOT NULL,
    "urlMyBusiness" TEXT NOT NULL,
    "telEntreprise" TEXT NOT NULL,
    "motsCles" TEXT NOT NULL,
    "adresseDepart" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
