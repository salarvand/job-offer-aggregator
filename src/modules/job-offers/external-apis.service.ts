import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Api1Response, Api2Response, Api1JobOffer, Api2JobOffer } from '../../interfaces/external-api.interface';
import axios from 'axios';

@Injectable()
export class ExternalApisService {
  private readonly logger = new Logger(ExternalApisService.name);

  constructor(private configService: ConfigService) {}

  async fetchFromApi1(): Promise<Api1JobOffer[]> {
    try {
      const apiUrl = this.configService.get<string>('API1_URL');

      if (!apiUrl) {
        throw new Error('API1 URL is missing');
      }

      const response = await axios.get<Api1Response>(apiUrl);
      
      if (response.data?.jobs && Array.isArray(response.data.jobs)) {
        return response.data.jobs;
      }

      this.logger.error('API1 response structure is invalid:', response.data);
      return [];
    } catch (error) {
      this.logger.error('Failed to fetch data from API1:', error);
      return [];
    }
  }

  async fetchFromApi2(): Promise<Array<Api2JobOffer & { jobId: string }>> {
    try {
      const apiUrl = this.configService.get<string>('API2_URL');

      if (!apiUrl) {
        throw new Error('API2 URL is missing');
      }

      const response = await axios.get<Api2Response>(apiUrl);

      if (response.data?.status === 'success' && response.data.data?.jobsList) {
        // Convert the object of jobs into an array with jobId included
        return Object.entries(response.data.data.jobsList).map(([jobId, job]) => ({
          ...job,
          jobId: jobId,
        }));
      }

      this.logger.error('API2 response structure is invalid:', response.data);
      return [];
    } catch (error) {
      this.logger.error('Failed to fetch data from API2:', error);
      return [];
    }
  }
} 