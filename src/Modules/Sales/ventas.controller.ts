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
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

@ApiTags('Ventas')
@Controller('ventas')
export class VentasController {
  constructor(private readonly ventasService: VentasService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva venta con detalles' })
  @ApiResponse({ status: 201, description: 'Venta creada correctamente' })
  create(@Body() data: CreateVentaDto) {
    return this.ventasService.create(data);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar todas las ventas con detalles, cliente, vendedor y zona',
  })
  findAll() {
    return this.ventasService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una venta específica por ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ventasService.findOne(id);
  }

  @Delete(':id')
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

  @Get('sin-ventas')
  @ApiQuery({
    name: 'inicio',
    type: String,
    description: 'Fecha de inicio en formato YYYY-MM-DD',
  })
  @ApiQuery({
    name: 'fin',
    type: String,
    description: 'Fecha de fin en formato YYYY-MM-DD',
  })
  async getZonasSinVentas(
    @Query('inicio') inicio: string,
    @Query('fin') fin: string,
  ) {
    return this.ventasService.zonasSinVentas(inicio, fin);
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
