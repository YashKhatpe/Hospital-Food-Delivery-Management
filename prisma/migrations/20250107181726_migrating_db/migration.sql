-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'PANTRY_STAFF', 'DELIVERY_STAFF');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "MealType" AS ENUM ('MORNING', 'EVENING', 'NIGHT');

-- CreateEnum
CREATE TYPE "MealStatus" AS ENUM ('PENDING', 'PREPARING', 'READY', 'DELIVERING', 'DELIVERED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "contactNumber" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Patient" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "gender" "Gender" NOT NULL,
    "roomNumber" TEXT NOT NULL,
    "bedNumber" TEXT NOT NULL,
    "floorNumber" TEXT NOT NULL,
    "contactNumber" TEXT NOT NULL,
    "emergencyContact" TEXT NOT NULL,
    "diseases" TEXT[],
    "allergies" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DietChart" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "mealType" "MealType" NOT NULL,
    "items" TEXT[],
    "instructions" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DietChart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PantryStaff" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "location" TEXT NOT NULL,

    CONSTRAINT "PantryStaff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeliveryStaff" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "DeliveryStaff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MealBox" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "dietChartId" TEXT NOT NULL,
    "pantryStaffId" TEXT,
    "deliveryStaffId" TEXT,
    "status" "MealStatus" NOT NULL DEFAULT 'PENDING',
    "deliveryNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MealBox_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "PantryStaff_userId_key" ON "PantryStaff"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "DeliveryStaff_userId_key" ON "DeliveryStaff"("userId");

-- AddForeignKey
ALTER TABLE "DietChart" ADD CONSTRAINT "DietChart_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PantryStaff" ADD CONSTRAINT "PantryStaff_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeliveryStaff" ADD CONSTRAINT "DeliveryStaff_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealBox" ADD CONSTRAINT "MealBox_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealBox" ADD CONSTRAINT "MealBox_dietChartId_fkey" FOREIGN KEY ("dietChartId") REFERENCES "DietChart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealBox" ADD CONSTRAINT "MealBox_pantryStaffId_fkey" FOREIGN KEY ("pantryStaffId") REFERENCES "PantryStaff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealBox" ADD CONSTRAINT "MealBox_deliveryStaffId_fkey" FOREIGN KEY ("deliveryStaffId") REFERENCES "DeliveryStaff"("id") ON DELETE SET NULL ON UPDATE CASCADE;
