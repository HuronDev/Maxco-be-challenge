import { PartialType } from '@nestjs/swagger';
import { CreateClienteDto } from './create-client.dto';

export class UpdateClienteDto extends PartialType(CreateClienteDto) {}
