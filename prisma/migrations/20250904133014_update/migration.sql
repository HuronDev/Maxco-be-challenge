-- DropForeignKey
ALTER TABLE "public"."DetalleVenta" DROP CONSTRAINT "DetalleVenta_ventaId_fkey";

-- AlterTable
ALTER TABLE "public"."Cliente" ADD COLUMN     "activo" BOOLEAN NOT NULL DEFAULT true;

-- AddForeignKey
ALTER TABLE "public"."DetalleVenta" ADD CONSTRAINT "DetalleVenta_ventaId_fkey" FOREIGN KEY ("ventaId") REFERENCES "public"."Venta"("id") ON DELETE CASCADE ON UPDATE CASCADE;
