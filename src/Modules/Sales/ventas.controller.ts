import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  ParseIntPipe,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { VentasService } from './ventas.service';
import { CreateVentaDto } from './dto/create-venta.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { UpdateCantidadDto } from './dto/update-cantidad.dto';

@ApiTags('Ventas')
@Controller('ventas')
export class VentasController {
  constructor(private readonly ventasService: VentasService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva venta' })
  @ApiBody({ type: CreateVentaDto })
  @ApiResponse({ status: 201, description: 'Venta creada correctamente.' })
  @ApiResponse({
    status: 404,
    description: 'Cliente, vendedor, zona o producto no encontrado.',
  })
  async create(@Body() createVentaDto: CreateVentaDto) {
    return this.ventasService.create(createVentaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las ventas con detalles desglosados' })
  @ApiResponse({ status: 200, description: 'Listado de ventas exitoso.' })
  @ApiResponse({ status: 404, description: 'No se encontraron ventas.' })
  findAll() {
    return this.ventasService.findAll();
  }

  @Patch(':ventaId/deta lles/:productoId/cantidad')
  @ApiOperation({
    summary: 'Actualizar la cantidad de un producto en una venta',
  })
  @ApiParam({ name: 'ventaId', description: 'ID de la venta', example: 1 })
  @ApiParam({
    name: 'productoId',
    description: 'ID del producto en la venta',
    example: 3,
  })
  @ApiBody({ type: UpdateCantidadDto })
  @ApiResponse({
    status: 200,
    description: 'Cantidad y subtotal actualizados correctamente.',
  })
  @ApiResponse({ status: 404, description: 'Venta o detalle no encontrado.' })
  @ApiResponse({
    status: 400,
    description: 'Stock insuficiente para el producto.',
  })
  async updateCantidad(
    @Param('ventaId', ParseIntPipe) ventaId: number,
    @Param('productoId', ParseIntPipe) productoId: number,
    @Body() updateCantidadDto: UpdateCantidadDto,
  ) {
    return this.ventasService.updateCantidadDetalle(
      ventaId,
      productoId,
      updateCantidadDto.cantidad,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una venta y todos sus detalles' })
  @ApiParam({ name: 'id', description: 'ID de la venta', example: 1 })
  @ApiResponse({ status: 200, description: 'Venta eliminada correctamente.' })
  @ApiResponse({ status: 404, description: 'Venta no encontrada.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.ventasService.remove(id);
  }

  // specific methods controllers
  @Get('zonas-mas-ventas')
  @ApiOperation({
    summary: 'Listado de zonas con mayor cantidad de ventas por vendedor',
  })
  zonasConMasVentasPorVendedor() {
    return this.ventasService.zonasConMasVentasPorVendedor();
  }

  @Get('zonas-sin-ventas')
  @ApiOperation({
    summary: 'Listado de zonas sin ventas en un rango de fechas',
  })
  @ApiQuery({ name: 'fechaInicio', type: String, example: '2025-01-01' })
  @ApiQuery({ name: 'fechaFin', type: String, example: '2025-12-31' })
  @ApiResponse({
    status: 200,
    description: 'Listado de zonas sin ventas en ese rango de fechas',
  })
  async zonasSinVentas(
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string,
  ) {
    return this.ventasService.zonasSinVentas(fechaInicio, fechaFin);
  }


  
  @Get('vendedores-sin-ventas')
  @ApiOperation({
    summary:
      'Mostrar vendedores que no realizaron ventas en un intervalo de fechas',
  })
  @ApiQuery({
    name: 'fechaInicio',
    type: String,
    example: '2024-01-01',
    required: true,
    description: 'Fecha de inicio en formato YYYY-MM-DD',
  })
  @ApiQuery({
    name: 'fechaFin',
    type: String,
    example: '2024-12-31',
    required: true,
    description: 'Fecha de fin en formato YYYY-MM-DD',
  })
  async vendedoresSinVentas(
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string,
  ) {
    return this.ventasService.vendedoresSinVentas(fechaInicio, fechaFin);
  }

  // 4. Ventas por cliente agrupadas por años
  @Get('ventas-por-cliente')
  @ApiOperation({ summary: 'Mostrar ventas por cliente agrupadas por año' })
  @ApiQuery({
    name: 'anios',
    type: String,
    example: '2020,2021,2022,2023',
    required: true,
    description: 'Lista de años separados por coma',
  })
  async ventasPorClientePorAño(@Query('anios') anios: string) {
    const arrayAnios = anios.split(',').map((a) => parseInt(a.trim(), 10));
    return this.ventasService.ventasPorClientePorAño(arrayAnios);
  }
}
