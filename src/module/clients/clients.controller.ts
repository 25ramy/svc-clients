import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import {
  ApiClient,
  ApiClientStats,
  ApiClientWithDeathDate,
  ApiCreateClient,
} from './clients.payload';
import { ClientsService } from './clients.service';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @MessagePattern({ cmd: 'ping' })
  ping(): { response: string } {
    return this.clientsService.ping();
  }

  @MessagePattern({ cmd: 'create_client' })
  createClient(payload: ApiCreateClient): Promise<ApiClient> {
    return this.clientsService.createClient(payload);
  }

  @MessagePattern({ cmd: 'get_client_stats' })
  getClientStats(): Promise<ApiClientStats> {
    return this.clientsService.getClientStats();
  }

  @MessagePattern({ cmd: 'get_clients_with_death_date' })
  getClientsWithDeathDate(): Promise<ApiClientWithDeathDate[]> {
    return this.clientsService.getClientsWithDeathDate();
  }
}
