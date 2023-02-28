import React, {useState} from 'react';
import { DataGrid } from '@mui/x-data-grid';

import './PaginationDataTable.scss'

export default function PaginationDataTable(props) {
  const { columns, data, pageSize, rowsPerPageOptions, totalCount, paginationMode } = props;

  const onPageChange = (newPage) => {
    props.onPageChange(newPage);
  };

  const onPageSizeChange = (newPageSize) => {
    props.onPageSizeChange(newPageSize);
  }
   return (
    <div style={{ height: 500, width: '100%' }}>
      <DataGrid
        rows={data}
        columns={columns}
        pageSize={pageSize}
        onPageSizeChange={onPageSizeChange}
        rowsPerPageOptions={rowsPerPageOptions}
        paginationMode = {paginationMode}
        onPageChange={onPageChange}
        rowCount={totalCount}
      />
    </div>
  );
}