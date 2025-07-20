import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { Client } from 'src/database/entities/client.entity';
import { EntityManager } from 'typeorm';
import {
  ApiClient,
  ApiCreateClient,
  ClientStats,
  ClientWithDeathDate,
} from './clients.payload';

@Injectable()
export class ClientsService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}
  ping(): string {
    return 'pong from svc-clients!';
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

    const existingUser = await this.entityManager.findOne(Client, {
      where: { name },
    });

    if (existingUser) {
      throw new BadRequestException('Client already exists');
    }

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

  async getClientStats(): Promise<ClientStats> {
    const clients = await this.entityManager.find(Client);

    if (!clients.length) {
      return { averageAge: 0, standardDeviation: 0 };
    }

    const ages = clients.map((client) => client.age);
    const average = ages.reduce((acc, age) => acc + age, 0) / ages.length;

    const squareDiffs = ages.map((age) => {
      const diff = age - average;
      return diff * diff;
    });
    const avgSquareDiff =
      squareDiffs.reduce((acc, val) => acc + val, 0) / ages.length;
    const standardDeviation = Math.sqrt(avgSquareDiff);

    return {
      averageAge: Number(average.toFixed(2)),
      standardDeviation: Number(standardDeviation.toFixed(2)),
    };
  }

  async getClientsWithDeathDate(): Promise<ClientWithDeathDate[]> {
    const clients = await this.entityManager.find(Client);
    const LIFE_EXPECTANCY = 80;

    return clients.map((client) => {
      const yearsLeft = LIFE_EXPECTANCY - (client.age || 0);
      const expectedDeathDate = new Date();
      expectedDeathDate.setFullYear(
        expectedDeathDate.getFullYear() + yearsLeft,
      );

      return {
        ...this.mapEntityToDTO(client),
        expectedDeathDate,
      };
    });
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
