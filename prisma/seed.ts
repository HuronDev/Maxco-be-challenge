import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seeder...');

  // Crear Zonas
  const zonaCentro = await prisma.zona.create({
    data: { nombre: 'Centro', descripcion: 'Zona central de la ciudad' },
  });
  const zonaNorte = await prisma.zona.create({
    data: { nombre: 'Norte', descripcion: 'Zona norte de la ciudad' },
  });

  // Crear Vendedores
  const vendedorJuan = await prisma.vendedor.create({
    data: { nombre: 'Juan Pérez', email: 'juan@empresa.com', telefono: '0991111111' },
  });
  const vendedorMaria = await prisma.vendedor.create({
    data: { nombre: 'María López', email: 'maria@empresa.com', telefono: '0992222222' },
  });

  // Crear Clientes
  const clienteAna = await prisma.cliente.create({
    data: {
      nombre: 'Ana Torres',
      email: 'ana@gmail.com',
      telefono: '0981111111',
      direccion: 'Av. Siempre Viva 123',
    },
  });

  const clienteLuis = await prisma.cliente.create({
    data: {
      nombre: 'Luis Martínez',
      email: 'luis@gmail.com',
      telefono: '0982222222',
      direccion: 'Calle Falsa 456',
    },
  });

  // Crear Productos
  const productoLaptop = await prisma.producto.create({
    data: {
      nombre: 'Laptop Lenovo',
      descripcion: 'Laptop de 15 pulgadas',
      precio: 850.50,
      stock: 10,
      categoria: 'Electrónica',
    },
  });

  const productoMouse = await prisma.producto.create({
    data: {
      nombre: 'Mouse Logitech',
      descripcion: 'Mouse inalámbrico',
      precio: 25.99,
      stock: 50,
      categoria: 'Accesorios',
    },
  });

  // Crear Ventas con Detalles
  const venta1 = await prisma.venta.create({
    data: {
      clienteId: clienteAna.id,
      vendedorId: vendedorJuan.id,
      zonaId: zonaCentro.id,
      fecha: new Date('2023-06-15'),
      monto_total: 876.49,
      detalles: {
        create: [
          {
            productoId: productoLaptop.id,
            cantidad: 1,
            precio_unitario: 850.50,
            subtotal: 850.50,
          },
          {
            productoId: productoMouse.id,
            cantidad: 1,
            precio_unitario: 25.99,
            subtotal: 25.99,
          },
        ],
      },
    },
  });

  const venta2 = await prisma.venta.create({
    data: {
      clienteId: clienteLuis.id,
      vendedorId: vendedorMaria.id,
      zonaId: zonaNorte.id,
      fecha: new Date('2023-07-20'),
      monto_total: 25.99,
      detalles: {
        create: [
          {
            productoId: productoMouse.id,
            cantidad: 1,
            precio_unitario: 25.99,
            subtotal: 25.99,
          },
        ],
      },
    },
  });

  console.log('✅ Seeder ejecutado con éxito');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
