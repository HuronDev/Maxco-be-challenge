import { Controller, Get, Post, Param, Body, ParseIntPipe,Patch, Delete} from '@nestjs/common';
import { VentasService } from './ventas.service';
import { CreateVentaDto } from './dto/create-venta.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

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
  @ApiOperation({ summary: 'Listar todas las ventas con detalles, cliente, vendedor y zona' })
  findAll() {
    return this.ventasService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una venta específica por ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ventasService.findOne(id);
  }
}

