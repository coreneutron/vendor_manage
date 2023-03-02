import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux'
import DataTable from "../../components/DataTable";
import {Button, Box, Stepper, Step, StepLabel, StepContent, Paper, Typography, FormControl, Input, InputLabel, MenuItem, Select, TextField, CircularProgress }  from '@mui/material';
import { GridActionsCellItem } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';

import { useLaravelReactI18n } from 'laravel-react-i18n';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'
import {BsExclamationCircle} from "react-icons/bs"

import { startAction, endAction, showToast } from '../../actions/common'
import agent from '../../api/'
import { logout } from "../../actions/auth";

import { columnNumberList } from '../../utils/ColumnNumber';
const Clipboard = (props) => {
  const { t, tChoice } = useLaravelReactI18n();
  const dispatch = useDispatch();

  const clipboardColumns = [
    {
      field: 'column_name',
      headerName: t('Column Name'),
      editable: false,
      flex: 1,
    },
    {
      field: 'column_number',
      headerName: t('Column Number'),
      flex: 1,
      renderCell: (params) => (
        <FormControl variant="standard" fullWidth>
          <Select
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            name="prefecture"
            value={params.row.column_number}
            disabled
          >
          {
            columnNumberList.length > 0 && columnNumberList.map((item, index) => 
              <MenuItem value={item.id} key={index}>{item.value}</MenuItem>
            )
          }
          </Select>
        </FormControl>
      ),
    }, 
    {
      field: 'actions',
      headerName: '操作',
      minWidth: 100,
      renderCell: ( params ) => {
        if(params.row.role != 1){
          return  <div>
            <EditIcon onClick={()=>handleClipboardEdit(params.row)} style={{cursor: 'pointer', fontSize: '1.25rem'}} />
          </div>
        } 
        else 
          return <div key={params.row.id}></div>;
      },
    },
  ]

  const [clipboardTitle, setClipboardTitle] = useState(t('Clipboard List'));
  const [page, setPage] = useState('list');
  
  const [clipboard, setClipboard] = useState([]);
  const [editData, setEditData] = useState({
    column_name: '',
    column_number: 0,
  });

  useEffect(() => {
    getClipboardData()
  }, [])

  const getClipboardData = async() => {
    dispatch(startAction())
    try {
      const res = await agent.common.getClipboard()
      if (res.data.success) {
        setClipboard([...res.data.data])
      }
      dispatch(endAction())
    } catch (error) {
      if (error.response.status >= 400 && error.response.status <= 500) {
        dispatch(endAction())
        dispatch(showToast('error', error.response.data.message))
        if (error.response.data.message == 'Unauthorized') {
          localStorage.removeItem('token')
          dispatch(logout())
          navigate('/')
        }
      }
    }
  }

  const handleClipboardEdit = (data) => {
    setEditData({ id: data.id, column_name:data.column_name, column_number: data.column_number })
    setPage('edit')
    setClipboardTitle(t('Clipboard Edit'))
  }

  const submitUpdate = async () => {
    dispatch(startAction())
    try {
      const res = await agent.common.updateClipboard(editData.id, editData);
      if (res.data.success) {
        getClipboardData();
        dispatch(showToast('success', t('Successfully updated!')))
      } else {
        dispatch(showToast('error', res.data.message))
      }
      dispatch(endAction())
    } catch (error) {
      if (error.response.status >= 400 && error.response.status <= 500) {
        dispatch(endAction())
        dispatch(showToast('error', error.response.data.message))
        if (error.response.data.message == 'Unauthorized') {
          localStorage.removeItem('token')
          dispatch(logout())
          navigate('/')
        }
      }
    }
  }
  
  const clickBackBtn = () => {
    setPage('list')
    setClipboardTitle(t('Clipboard List'))
  }

  const handleChange = (event) => {
    setEditData({ ...editData, [event.target.name]: event.target.value });
  }

  return (
    <>
      <div className="main-body">
        <div className="page-wrapper">
          <div className="row">
            <div className="col">
              {
                page == 'list' &&
                  <div className="card">
                    <div className="card-header">
                      <h5 className="card-title">{clipboardTitle}</h5>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-12">
                          <div className="table_container">
                            <DataTable 
                              data={clipboard}
                              columns={clipboardColumns}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
              }
              {
                page == 'edit' &&
                  <>
                    <div className="card">
                      <div className="card-header">
                        <h5 className="card-title">{clipboardTitle}</h5>
                      </div>
                      <div className="card-body text-center">
                        <TextField 
                          id="fullWidth"
                          name="column_name"
                          label={ t('Column Name') } 
                          value={editData.column_name}
                          onChange={handleChange}
                          margin="normal"
                          fullWidth
                          disabled
                          />
                          
                        <FormControl fullWidth margin="normal">
                          <InputLabel id="demo-simple-select-label">{ t('Column Number') }</InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            name="column_number"
                            label={ t('Column Number') }
                            value={editData.column_number}
                            onChange={handleChange}
                          >
                            {
                              columnNumberList.length > 0 && columnNumberList.map((item, index) => 
                                <MenuItem value={item.id} key={index}>{item.value}</MenuItem>
                              )
                            }
                          </Select>
                        </FormControl>
                        <Button variant="outlined" onClick={() => submitUpdate()}>{ t('Save') }</Button>
                      </div>
                      <div>
                        <Button color="primary" startIcon={<ArrowBackIcon />} onClick={() => clickBackBtn()}>{ t('Back') }</Button>
                      </div>
                    </div>
                  </>
              }
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Clipboard;