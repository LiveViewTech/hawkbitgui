import { SoftwareModuleMetadata } from '@/entities';
import { SoftwareModulesService } from '@/services/software-modules-service';
import { ApiError } from '@/types/hawkbit-api/error';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';

type UseGetSoftwareModuleMetadataParams = {
  queryOptions?: Omit<UseQueryOptions<SoftwareModuleMetadata[], ApiError, SoftwareModuleMetadata[]>, 'queryKey' | 'queryFn'>;
};

export const useGetSoftwareModuleMetadata = (softwareModuleId: number, params?: UseGetSoftwareModuleMetadataParams) => {
  const { queryOptions } = params ?? {};
  const queryKey = ['software-module-metadata', softwareModuleId];

  const { data, isLoading, error, refetch } = useQuery<SoftwareModuleMetadata[], ApiError>({
    queryKey,
    queryFn: () => SoftwareModulesService.getMetadata(softwareModuleId),
    ...queryOptions,
  });

  return { data, isLoading, error, refetch };
};
