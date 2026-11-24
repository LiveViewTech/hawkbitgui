'use client';

import styles from './styles.module.scss';
import { useForm } from 'react-hook-form';
import Button from '@/app/components/button';
import Input from '../input';
import TextArea from '@/app/components/text-area';
import Checkbox from '@/app/components/checkbox';
import Text from '../text';

export interface FormData {
  key: string;
  value: string;
  targetVisible?: boolean;
}

interface CreateMetadataFormProps {
  onSubmit: (data: FormData) => void;
  onCancel?: () => void;
  defaultValues?: Partial<FormData>;
  mode?: 'create' | 'edit';
  /** Shows the "Target visible" checkbox (only software module metadata supports it). */
  showTargetVisible?: boolean;
}

export default function CreateMetadataForm({ onSubmit, onCancel, defaultValues, mode = 'create', showTargetVisible = false }: CreateMetadataFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      key: defaultValues?.key ?? '',
      value: defaultValues?.value ?? '',
      targetVisible: defaultValues?.targetVisible ?? false,
    },
  });

  const isEditMode = mode === 'edit';

  return (
    <div className={styles.container}>
      <Text variant='heading-2'>{isEditMode ? 'Edit Metadata' : 'Create Metadata'}</Text>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.inputContainer}>
          <label className={styles.label}>
            Key <b className={styles.error}>*</b>
          </label>
          <Input
            className={styles.input}
            type='text'
            placeholder='Key'
            {...register('key', { required: true })}
            error={errors.key && 'This field is required'}
            disabled={isEditMode} // Optional: lock key on edit
          />
        </div>
        <div className={styles.inputContainer}>
          <label className={styles.label}>Value</label>
          <TextArea placeholder='Value' {...register('value')} className={styles.textarea} error={errors.value && 'This field is required'} />
        </div>
        {showTargetVisible && (
          <div className={styles.checkboxContainer}>
            <Checkbox id='targetVisible' description='Target visible' {...register('targetVisible')} />
            <Text variant='paragraph-sm' color='text-secondary'>
              The key and value are sent to the device together with the deployment of this software module.
            </Text>
          </div>
        )}

        <div className={styles.buttonContainer}>
          <Button type='submit'>{isEditMode ? 'Update' : 'Save'}</Button>
          <Button variant='outline' onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
