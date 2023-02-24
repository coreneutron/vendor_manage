import React, { useState, useEffect } from "react";
import DataGridTable from "../../components/DataGridTable";
import { useLaravelReactI18n } from 'laravel-react-i18n';

const Clipboard = (props) => {
  const { t, tChoice } = useLaravelReactI18n();

  const clipboardListColumns = [
    {
      field: 'id',
      headerName: t('ID'),
      maxWidth: 200,
      editable: false
    }
  ]

  const [clipboard, setClipboard] = useState([]);

  return (
    <>
      <DataGridTable
        data={clipboard}
        title={t('Clipboard List')}
        column={clipboardListColumns}
      />
    </>
  )
}

export default Clipboard;