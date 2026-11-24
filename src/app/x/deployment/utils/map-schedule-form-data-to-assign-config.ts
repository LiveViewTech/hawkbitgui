import { FormData as ScheduleFormData } from '@/app/x/deployment/components/schedule-form';
import { AssignConfig } from '@/services/targets-service.types';

export const mapScheduleFormDataToAssignConfig = (id: string | number, data?: ScheduleFormData): AssignConfig => {
  if (!data) {
    return { id };
  }

  const assignConfig: AssignConfig = {
    id,
    type: data.mode,
    maintenanceWindow: data.maintenanceWindow
      ? {
          schedule: data.schedule,
          duration: data.duration,
          timezone: data.timeZone,
        }
      : undefined,
  };

  if (data.mode === 'timeforced' && data.forcedDate) {
    assignConfig.forcetime = new Date(data.forcedDate).getTime();
  }

  return assignConfig;
};
