import React, { useState, useEffect, useRef } from "react";
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'

import { IMaskInput } from 'react-imask';
import { Button, FormControl, Input, MenuItem, Select }  from '@mui/material';

import { GridActionsCellItem } from '@mui/x-data-grid';

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';

import { startAction, endAction, showToast } from '../../actions/common'
import agent from '../../api/'
import { logout } from "../../actions/auth";
import DataTable from "../../components/DataTable";

import { useLaravelReactI18n } from 'laravel-react-i18n'

import { prefecturesList } from '../../utils/prefectures';
import Create from './create';

const TextMaskCustom = React.forwardRef(function TextMaskCustom(props, ref) {
  const { onChange, ...other } = props;
  return (
    <IMaskInput
      {...other}
      mask="(#00) 000-0000"
      definitions={{
        '#': /[1-9]/,
      }}
      inputRef={ref}
      onAccept={(value) => onChange({ target: { name: props.name, value } })}
      overwrite
    />
  );
});

TextMaskCustom.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

const Traders = () => {
  const { t, tChoice } = useLaravelReactI18n();

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [page, setPage] = useState('list');
  const [cardTitle, setCardTitle] = useState(t('Trader List'));
  const [routing, setRouting] = useState([]);
  
  const [values, setValues] = useState({
    textmask: '(100) 000-0000',
    numberformat: '1320',
  });

  const [age, setAge] = useState('');

  const [companies, setCompanies] = useState([])
  const [companyLog, setCompanyLog] = useState([])
  const [companyRecordLog, setCompanyRecordLog] = useState([])
  const [editCompany, setEditCompany] = useState({})
  const [addCompany, setAddCompany] = useState({
    name: '', 
    bank_account_holder: '', 
    bank_account_number: '', 
    bank_branch_code: '', 
    bank_branch_name: '',
    bank_code: '',
    bank_deposit_type_id: 1,
    bank_name: '',
    transfer_fee_id: 1
  })

  const [filterData, setFilterData] = useState({
    company_id: '',
    company_name: ''
  })

  const companyColumns = [
    {
      field: 'id',
      headerName: 'ID',
      maxWidth: 150,
    },
    {
      field: 'company_name',
      headerName: t('Company Name'),
      editable: true,
      flex: 1,
    },
    {
      field: 'date',
      headerName: t('Date'),
      maxWidth: 200,
      editable: true,
      type: 'date',
      flex: 1,
    }, 
    {
      field: 'route',
      headerName: t('Route'),
      flex: 1,
      renderCell: () => (
        <FormControl variant="standard" fullWidth>
          <Select
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            name="route"
            value={age}
            label="Age"
          >
          {
            routing.length > 0 && routing.map((item, index) => 
              <MenuItem value={item.path_name} key={index}>{item.path_name}</MenuItem>
            )
          }
          </Select>
        </FormControl>
      ),
    },

    {
      field: 'telephone_number',
      headerName: t('Telephone Number'),
      flex: 1,
      renderCell: () => (
        <Input
          value={values.textmask}
          name="textmask"
          id="formatted-text-mask-input"
          inputComponent={TextMaskCustom}
        />
      )
    },
    {
      field: 'prefectures',
      headerName: t('Prefectures'),
      editable: true,
      flex: 1,
    }, 
    {
      field: 'actions',
      type: 'actions',
      headerName: '操作',
      minWidth: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="table_inline_btn"
            onClick={() => goCompanyEdit(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />
        ];
      },
    },
  ]

  useEffect(() => {
    getRouting();
    // getCompanyData()
  }, [])

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

  const getCompanyData = async() => {
    dispatch(startAction())
    try {
      const resCompany = await agent.common.getCompany(filterData.company_id, filterData.company_name)
      if (resCompany.data.success) {
        setCompanies([...resCompany.data.data])
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

  const goCompanyAdd = () => {
    setPage('add')
    setCardTitle(t('Trader Create'))
  }

  const goCompanyEdit = (company_id) => {
    setPage('edit')
    setCardTitle(t('Trader Edit'))
  }

  const clickAddSubmitBtn = async() => {
  }

  const clickCancelBtn = () => {
    setPage('list')
    setCardTitle(t('Trader List'))
  }

  return (
    <>
      <div className="main-body">
        <div className="page-wrapper">
          <div className="row">
            <div className="col">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title">{cardTitle}</h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-12">
                      {
                        page == 'list' && 
                          <>
                            <div className="table_container">
                              <DataTable 
                                data={companies}
                                columns={companyColumns}
                                />
                                <Button color="primary" startIcon={<AddIcon />} onClick={() => goCompanyAdd()}>
                                  レコードを追加
                                </Button>
                            </div>
                          </>
                      }
                      {
                        page == 'add' && <Create clickCancelBtn={()=>clickCancelBtn()} />
                      }
                      {
                        page == 'edit' && <Create clickCancelBtn={()=>clickCancelBtn()} />
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