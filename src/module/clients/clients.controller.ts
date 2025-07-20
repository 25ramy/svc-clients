import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ApiClient, ApiCreateClient } from './clients.payload';
import { ClientsService } from './clients.service';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @MessagePattern({ cmd: 'ping' })
  ping(): string {
    return this.clientsService.ping();
  }

  @MessagePattern({ cmd: 'create_client' })
  createClient(payload: ApiCreateClient): Promise<ApiClient> {
    return this.clientsService.createClient(payload);
  }
}
