import axiosInstance from '@/lib/axios';
import { SoftwareModule } from '@/entities/software-module';
import { SoftwareModuleMetadata } from '@/entities/metadata';
import {
  CreateSoftwareModuleInput,
  CreateSoftwareModuleResponse,
  FetchSoftwareModulesInput,
  FetchSoftwareModulesOutput,
  GetSoftwareModuleMetadataOutput,
  GetSoftwareModuleMetadataResponse,
  GetSoftwareModulesResponse,
} from './software-modules-service.types';

export class SoftwareModulesService {
  static async fetchSoftwareModules(input?: FetchSoftwareModulesInput): Promise<FetchSoftwareModulesOutput> {
    const { queryParams } = input ?? {};
    const response = await axiosInstance.get<GetSoftwareModulesResponse>(`/softwaremodules`, { params: queryParams });
    return {
      softwareModules: response.data.content,
      totalSoftwareModules: response.data.total,
    };
  }

  static async createSoftwareModule(data: CreateSoftwareModuleInput[]): Promise<SoftwareModule[]> {
    const response = await axiosInstance.post<CreateSoftwareModuleResponse>(`/softwaremodules`, data);
    return response.data;
  }

  static async updateSoftwareModule(softwareModuleId: number, data: Partial<CreateSoftwareModuleInput>): Promise<SoftwareModule[]> {
    const response = await axiosInstance.put<CreateSoftwareModuleResponse>(`/softwaremodules/${softwareModuleId}`, data);
    return response.data;
  }

  static async deleteSoftwareModule(softwareModuleId: number): Promise<void> {
    await axiosInstance.delete(`/softwaremodules/${softwareModuleId}`);
  }

  static async getMetadata(softwareModuleId: number | string): Promise<GetSoftwareModuleMetadataOutput> {
    try {
      const response = await axiosInstance.get<GetSoftwareModuleMetadataResponse>(`/softwaremodules/${softwareModuleId}/metadata`);
      return response.data.content;
    } catch (error) {
      console.error('Failed to get Metadata', error);
      throw error;
    }
  }

  static async createMetadata(softwareModuleId: number | string, metadata: SoftwareModuleMetadata): Promise<void> {
    try {
      const { key, value, targetVisible = false } = metadata;
      await axiosInstance.post(`/softwaremodules/${softwareModuleId}/metadata`, [{ key, value, targetVisible }]);
    } catch (error) {
      console.error('Failed to create Metadata', error);
      throw error;
    }
  }

  static async updateMetadata(softwareModuleId: number | string, metadata: SoftwareModuleMetadata): Promise<void> {
    try {
      const { key, value, targetVisible = false } = metadata;
      await axiosInstance.put(`/softwaremodules/${softwareModuleId}/metadata/${key}`, { value, targetVisible });
    } catch (error) {
      console.error('Failed to update Metadata', error);
      throw error;
    }
  }

  static async deleteMetadata(softwareModuleId: number | string, key: string): Promise<void> {
    try {
      await axiosInstance.delete(`/softwaremodules/${softwareModuleId}/metadata/${key}`);
    } catch (error) {
      console.error('Failed to delete Metadata', error);
      throw error;
    }
  }
}
