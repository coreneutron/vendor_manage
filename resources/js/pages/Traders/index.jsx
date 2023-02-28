import React, { useState, useEffect, useRef } from "react";
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { IMaskInput } from 'react-imask';
import { Button, FormControl, Input, InputLabel, TextField, MenuItem, Select }  from '@mui/material';
import { GridActionsCellItem } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import FileUploadIcon from '@mui/icons-material/FileUpload';

import { useLaravelReactI18n } from 'laravel-react-i18n'
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'
import {BsExclamationCircle} from "react-icons/bs"

import { startAction, endAction, showToast } from '../../actions/common'
import agent from '../../api/'
import { logout } from "../../actions/auth";

import PaginationDataTable from "../../components/PaginationDataTable";
import Create from './create';
import { prefecturesList } from '../../utils/prefectures';

const Traders = () => {
  const { t, tChoice } = useLaravelReactI18n();
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [pageType, setPageType] = useState('list');
  const [cardTitle, setCardTitle] = useState(t('Trader List'));
  const [routing, setRouting] = useState([]);
  const [traders, setTraders] = useState([]);
  const fileInputField = useRef(null);
  const [eidtTrader, setEditTrader] = useState({
    date: '',
    company_name: '',
    routing_id: 0,
    telephone_number: '123-456-7890',
    prefecture_id: 0
  });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalCount, setTotalCount]=useState(0);
  // search params
  const [searchParams, setSearchParams] = useState({
    site_type : '',
    company_name : '',
    routing_id : 0,
    prefecture : '',
    mobilephone_number : '',
    telephone_number : ''
  });

  const traderColumns = [
    {
      field: 'id',
      headerName: 'ID',
      maxWidth: 150,
    },
    {
      field: 'company_name',
      headerName: t('Company Name'),
      editable: false,
      flex: 1,
    },
    {
      field: 'date',
      headerName: t('Date'),
      maxWidth: 200,
      editable: false,
      type: 'date',
      flex: 1,
    }, 
    {
      field: 'routing_id',
      headerName: t('Routing'),
      flex: 1,
      renderCell: (params) => {
        return <FormControl variant="standard" fullWidth>
          <Select
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            name="routing_id"
            value={params.row.routing_id}
            disabled
          >
            <MenuItem value={0} key={'none'}>None</MenuItem>
          {
            routing.length > 0 && routing.map((item, index) => 
              <MenuItem value={item.id} key={index}>{item.path_name}</MenuItem>
            )
          }
          </Select>
        </FormControl>
      },
    },
    {
      field: 'telephone_number',
      headerName: t('Phone Number'),
      flex: 1,
    },
    {
      field: 'prefecture',
      headerName: t('Prefecture'),
      flex: 1,
      renderCell: (params) => (
        <FormControl variant="standard" fullWidth>
          <Select
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            name="prefecture"
            value={params.row.prefecture}
            disabled
          >
          {
            prefecturesList.length > 0 && prefecturesList.map((item, index) => 
              <MenuItem value={item.value} key={index}>{item.value}</MenuItem>
            )
          }
          </Select>
        </FormControl>
      ),
    }, 
    {
      field: 'actions',
      type: 'actions',
      headerName: '操作',
      minWidth: 100,
      cellClassName: 'actions',
      getActions: ( params ) => {
        return [
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={()=>handleDeleteClick(params.row.id)}
            color="inherit"
          />
        ];
      },
    },
  ]

  useEffect(() => {
    getRouting();
    getTraders()
  }, [])

  useEffect(() => {
    getTraders()
  }, [searchParams, page, rowsPerPage])

  const handleUploadCsv = () => {
    fileInputField.current.click();
  };

  const handleChangeCsv = async(e) => {
    let file = e.target.files[0];
    if(file){
      const formData = new FormData();
      formData.append("file", e.target.files[0]);
      dispatch(startAction())
      try {
        const res = await agent.common.uploadCsv(formData)
        if (res.data.success) {
          dispatch(showToast('success', t('Successfully updated!')))
          // getTraders()
          window.location.href="/traders";

        }
        dispatch(endAction())
      } catch (error) {
        if (error.response.status >= 400 && error.response.status <= 500) {
          dispatch(endAction())
          dispatch(showToast('error', error.response.data.message))
          window.location.href="/traders";
          if (error.response.data.message == 'Unauthorized') {
            localStorage.removeItem('token')
            dispatch(logout())
            navigate('/')
          }
        }
      }
    }
  };

  const getRouting = async() => {
    dispatch(startAction())
    try {
      const res = await agent.common.getRouting()
      if (res.data.success) {
        setRouting([...res.data.data])
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

  const getTraders = async() => {
    searchParams.page = Number(page) + 1;
    searchParams.rowsPerPage = rowsPerPage;
   
    dispatch(startAction())
    try {
      const res = await agent.common.getTraders(searchParams);
      if (res.data.success) {
        setTraders([...res.data.data.data])
        setTotalCount(res.data.data.total)
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

  const createTrader = () => {
    setPageType('add')
    setCardTitle(t('Trader Create'))
  }

  const handleDeleteClick= (id) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className='custom_alert'>
            <h1><BsExclamationCircle /></h1>
            <p>本当に削除しますか？</p>
            <div className="btn_group">
              <button type="button" className="btn btn-secondary" onClick={onClose}>いいえ</button>
              <button type="button" className="btn btn-success" onClick={() => {onClose(); handleTraderDelete(id);}}>はい</button>
            </div>
          </div>
        );
      }
    });
  }

  const handleTraderDelete = async(id) => {
    dispatch(startAction())
    try {
      const res = await agent.common.deleteTrader(id);
      if (res.data.success) {
        getTraders();
        dispatch(showToast('success', 'Successfully deleted!'))
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

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };
  
  const handlePageSizeChange = (value) => {
    setRowsPerPage(value);
  };

  const handleChange = (event) => {
    setSearchParams({...searchParams, [event.target.name]: event.target.value});
  };

  const clickCancelBtn = () => {
    setPageType('list')
    setCardTitle(t('Trader List'))
  }
  return (
    <>
      <div className="main-body">
        <div className="page-wrapper">
          <div className="row">
            <div className="col">
              <div className="card">
                <div className="card-header" style={{display: 'flex', justifyContent:'space-between'}}>
                  <h5 className="card-title">{cardTitle}</h5>
                  <div style={{display: 'flex'}}>
                    <div style={{cursor: 'pointer', marginRight: '20px'}} onClick={()=>handleUploadCsv()}>
                      <FileUploadIcon />{t('Csv Add')}
                      <input type="file" accept=".csv" ref={fileInputField} onChange={handleChangeCsv} style={{display: 'none'}}/>
                    </div>
                  </div>
                </div>

                <div className="card-body">

                  <div className="row">
                    <div className="col-md-12">
                      {
                        pageType == 'list' && 
                          <>
                            <div className="page-header-title">
                              <FormControl sx={{ m: 1, minWidth: 250 }}>
                                <TextField id="outlined-basic" label={t('Site Type')} name="site_type" variant="outlined" value={searchParams.site_type} onChange={handleChange} />
                              </FormControl>
                              <FormControl sx={{ m: 1, minWidth: 250 }}>
                                <TextField id="outlined-basic" label={t('Company Name')} name="company_name" variant="outlined" value={searchParams.company_name} onChange={handleChange} />
                              </FormControl>
                              <FormControl sx={{ m: 1, minWidth: 250 }}>
                                <InputLabel id="demo-simple-select-label">{t('Routing')}</InputLabel>
                                <Select
                                  labelId="demo-simple-select-label"
                                  id="demo-simple-select"
                                  name="routing_id"
                                  value={searchParams.routing_id}
                                  label={t('Routing')}
                                  onChange={handleChange}
                                >
                                  <MenuItem value={0} key={'all'}>{t('All')}</MenuItem>
                                  {routing && routing.map((item, index )=> {
                                      return (
                                        <MenuItem value={item.id} key={index}>{item.path_name}</MenuItem>
                                      )
                                    })
                                  }
                                </Select>
                              </FormControl>
                              <FormControl sx={{ m: 1, minWidth: 250 }}>
                                <InputLabel id="demo-simple-select-label">{t('Prefecture')}</InputLabel>
                                <Select
                                  labelId="demo-simple-select-label"
                                  id="demo-simple-select"
                                  name="prefecture"
                                  value={searchParams.prefecture}
                                  label={t('Prefecture')}
                                  onChange={handleChange}
                                >
                                  {prefecturesList.map((item, index )=> {
                                      return (
                                        <MenuItem value={item.value} key={index}>{item.value}</MenuItem>
                                      )
                                    })
                                  }
                                </Select>
                              </FormControl>
                              <FormControl sx={{ m: 1, minWidth: 250 }}>
                                <TextField id="outlined-basic" label={t('Mobilephone Number')} name="mobilephone_number" variant="outlined" value={searchParams.mobilephone_number} onChange={handleChange} />
                              </FormControl>
                              <FormControl sx={{ m: 1, minWidth: 250 }}>
                                <TextField id="outlined-basic" label={t('Telephone Number')} name="telephone_number" variant="outlined" value={searchParams.telephone_number} onChange={handleChange} />
                              </FormControl>
                            </div>
                            <div className="table_container">
                              <PaginationDataTable 
                                data={traders}
                                columns={traderColumns}
                                paginationMode='server'
                                pageSize={rowsPerPage}
                                rowsPerPageOptions={[5, 10, 25, 100]}
                                totalCount={totalCount}
                                onPageSizeChange={handlePageSizeChange}
                                onPageChange={handleChangePage}
                                />
                              <Button color="primary" startIcon={<AddIcon />} onClick={() => createTrader()}>
                                レコードを追加
                              </Button>
                            </div>
                          </>
                      }
                      {
                        pageType == 'add' && <Create clickCancelBtn={()=>clickCancelBtn()} />
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Traders;