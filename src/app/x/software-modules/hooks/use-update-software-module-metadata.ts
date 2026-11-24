import { SoftwareModuleMetadata } from '@/entities';
import { SoftwareModulesService } from '@/services/software-modules-service';
import { useMutation } from '@tanstack/react-query';

export const useUpdateSoftwareModuleMetadata = () => {
  const { mutateAsync: updateSoftwareModuleMetadata, isPending } = useMutation({
    mutationFn: async (data: { softwareModuleId: number; metadata: SoftwareModuleMetadata }) => {
      return SoftwareModulesService.updateMetadata(data.softwareModuleId, data.metadata);
    },
  });

  return { updateSoftwareModuleMetadata, isPending };
};
