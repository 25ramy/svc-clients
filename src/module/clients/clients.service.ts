import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { Client } from 'src/database/entities/client.entity';
import { EntityManager } from 'typeorm';
import {
  ApiClient,
  ApiClientStats,
  ApiClientWithDeathDate,
  ApiCreateClient,
} from './clients.payload';

@Injectable()
export class ClientsService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}
  ping(): { response: string } {
    return { response: 'pong from svc-clients!' };
  }
  getHello(): string {
    return 'Hello World!';
  }

  async createClient(payload: ApiCreateClient): Promise<ApiClient> {
    const { name, lastName, age, birthDate } = payload;

    // Validations
    if (!name || !lastName) {
      throw new BadRequestException('Name and lastName are required');
    }

    if (age && (age < 0 || age > 120 || !Number.isInteger(age))) {
      throw new BadRequestException(
        'Age must be a valid number between 0 and 120',
      );
    }

    if (birthDate) {
      const date = new Date(birthDate);
      if (isNaN(date.getTime())) {
        throw new BadRequestException('Invalid birth date format');
      }

      if (date > new Date()) {
        throw new BadRequestException('Birth date cannot be in the future');
      }
    }

    /*     const existingUser = await this.entityManager.findOne(Client, {
      where: { name },
    });

    if (existingUser) {
      throw new BadRequestException('Client already exists');
    } */

    try {
      const user = this.entityManager.create(Client, {
        name,
        lastName,
        age,
        birthDate: new Date(birthDate),
      });
      const client = await this.entityManager.save(user);
      return this.mapEntityToDTO(client);
    } catch (error) {
      throw new BadRequestException('Error creating client: ' + error);
    }
  }

  async getClientStats(): Promise<ApiClientStats> {
    const stats = await this.entityManager
      .createQueryBuilder(Client, 'client')
      .select([
        'ROUND(AVG(CAST(client.age as FLOAT)), 2) as "averageAge"',
        'ROUND(SQRT(AVG(POWER(CAST(client.age as FLOAT) - (SELECT AVG(CAST(age as FLOAT)) FROM client), 2))), 2) as "standardDeviation"',
      ])
      .getRawOne<{ averageAge: string; standardDeviation: string }>();

    return {
      averageAge: Number(stats?.averageAge ?? 0),
      standardDeviation: Number(stats?.standardDeviation ?? 0),
    };
  }

  async getClientsWithDeathDate(): Promise<ApiClientWithDeathDate[]> {
    const LIFE_EXPECTANCY = 80;

    const clients = await this.entityManager
      .createQueryBuilder(Client, 'client')
      .select([
        'client.id as "id"',
        'client.name as "name"',
        'client.lastName as "lastName"',
        'client.age as "age"',
        'client.birthDate as "birthDate"',
        `date('now', '+' || (${LIFE_EXPECTANCY} - COALESCE(client.age, 0)) || ' years') as "expectedDeathDate"`,
      ])
      .getRawMany<
        Omit<ApiClient, 'birthDate'> & {
          birthDate: string | null;
          expectedDeathDate: string;
        }
      >();

    return clients.map((client) => ({
      ...client,
      birthDate: client.birthDate ? new Date(client.birthDate) : new Date(),
      expectedDeathDate: new Date(client.expectedDeathDate),
    }));
  }

  private mapEntityToDTO(user: Client): ApiClient {
    return {
      id: user.id,
      name: user.name,
      lastName: user.lastName,
      age: user.age,
      birthDate: user.birthDate,
    };
  }
}
