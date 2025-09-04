import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seeder de repuestos de autos...');

  // Crear Zonas
  const zonaCentro = await prisma.zona.create({
    data: { nombre: 'Centro', descripcion: 'Zona central de la ciudad' },
  });
  const zonaNorte = await prisma.zona.create({
    data: { nombre: 'Norte', descripcion: 'Zona norte de la ciudad' },
  });

  // Crear Vendedores
  const vendedorCarlos = await prisma.vendedor.create({
    data: { nombre: 'Carlos Ramírez', email: 'carlos@empresa.com', telefono: '0993333333' },
  });
  const vendedorLucia = await prisma.vendedor.create({
    data: { nombre: 'Lucía Fernández', email: 'lucia@empresa.com', telefono: '0994444444' },
  });

  // Crear Clientes
  const clientePedro = await prisma.cliente.create({
    data: {
      nombre: 'Pedro Gómez',
      email: 'pedro@gmail.com',
      telefono: '0983333333',
      direccion: 'Av. Principal 789',
    },
  });

  const clienteSofia = await prisma.cliente.create({
    data: {
      nombre: 'Sofía Herrera',
      email: 'sofia@gmail.com',
      telefono: '0984444444',
      direccion: 'Calle Secundaria 321',
    },
  });

  // Crear Productos (Repuestos de autos)
  const productoAceite = await prisma.producto.create({
    data: {
      nombre: 'Aceite de Motor Castrol 5W-30',
      descripcion: 'Aceite sintético para motores a gasolina',
      precio: 35.99,
      stock: 100,
      categoria: 'Lubricantes',
    },
  });

  const productoFiltro = await prisma.producto.create({
    data: {
      nombre: 'Filtro de Aire Toyota Corolla',
      descripcion: 'Filtro de aire original para Toyota Corolla 2015-2020',
      precio: 15.5,
      stock: 40,
      categoria: 'Filtros',
    },
  });

  const productoPastillas = await prisma.producto.create({
    data: {
      nombre: 'Pastillas de Freno Brembo',
      descripcion: 'Juego de pastillas de freno delanteras',
      precio: 60.0,
      stock: 25,
      categoria: 'Frenos',
    },
  });

  // Crear Ventas con Detalles
  const venta1 = await prisma.venta.create({
    data: {
      clienteId: clientePedro.id,
      vendedorId: vendedorCarlos.id,
      zonaId: zonaCentro.id,
      fecha: new Date('2024-08-10'),
      monto_total: 95.49,
      detalles: {
        create: [
          {
            productoId: productoAceite.id,
            cantidad: 1,
            precio_unitario: 35.99,
            subtotal: 35.99,
          },
          {
            productoId: productoFiltro.id,
            cantidad: 1,
            precio_unitario: 15.5,
            subtotal: 15.5,
          },
          {
            productoId: productoPastillas.id,
            cantidad: 1,
            precio_unitario: 60.0,
            subtotal: 60.0,
          },
        ],
      },
    },
  });

  const venta2 = await prisma.venta.create({
    data: {
      clienteId: clienteSofia.id,
      vendedorId: vendedorLucia.id,
      zonaId: zonaNorte.id,
      fecha: new Date('2024-09-05'),
      monto_total: 35.99,
      detalles: {
        create: [
          {
            productoId: productoAceite.id,
            cantidad: 1,
            precio_unitario: 35.99,
            subtotal: 35.99,
          },
        ],
      },
    },
  });

  console.log('✅ Seeder ejecutado con éxito (repuestos de autos)');
}

main()
  .catch((e) => {
    console.error('❌ Error ejecutando el seeder:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
