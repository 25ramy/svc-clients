import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  ping(): string {
    return 'pong from svc-clients!';
  }
  getHello(): string {
    return 'Hello World!';
  }
}
