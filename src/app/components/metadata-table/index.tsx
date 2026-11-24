'use client';

import React, { useMemo } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import Table from '@/app/components/table';
import styles from '@/app/x/deployment/components/target-table/styles.module.scss';
import IconButton from '@/app/components/icon-button';
import EditIcon from '@/app/components/icons/edit-icon';
import TrashIcon from '@/app/components/icons/trash-icon';
import { SoftwareModuleMetadata } from '@/entities';

export type MetadataTableProps = {
  metadata: SoftwareModuleMetadata[];
  isLoading?: boolean;
  onEditClick: (metadata: SoftwareModuleMetadata) => void;
  onDeleteClick: (metadata: SoftwareModuleMetadata) => void;
  /** Shows the "Target visible" column (only software module metadata supports it). */
  showTargetVisible?: boolean;
};

export default function MetadataTable({ metadata = [], isLoading = false, onEditClick, onDeleteClick, showTargetVisible = false }: MetadataTableProps) {
  const columnHelper = createColumnHelper<SoftwareModuleMetadata>();

  const columns = useMemo(() => {
    return [
      columnHelper.accessor('key', {
        header: 'Key',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('value', {
        header: 'Value',
        cell: (info) => info.getValue(),
      }),
      ...(showTargetVisible
        ? [
            columnHelper.accessor('targetVisible', {
              header: 'Target visible',
              size: 120,
              cell: (info) => (info.getValue() ? 'Yes' : 'No'),
            }),
          ]
        : []),
      columnHelper.display({
        id: 'actions',
        size: 80,
        cell: (info) => (
          <div className={styles.actionButtons}>
            <IconButton height={'30px'} width={'30px'} onClick={() => onEditClick(info.row.original)}>
              <EditIcon />
            </IconButton>
            <IconButton height={'30px'} width={'30px'} onClick={() => onDeleteClick(info.row.original)}>
              <TrashIcon />
            </IconButton>
          </div>
        ),
      }),
    ];
  }, [columnHelper, onDeleteClick, onEditClick, showTargetVisible]);

  return <Table columns={columns} data={metadata} isLoading={isLoading} />;
}
