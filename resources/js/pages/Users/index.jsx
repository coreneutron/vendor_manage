import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'

import DataTable from "../../components/DataTable";

import './Users.scss';

import {
  startAction,
  endAction,
  showToast
} from '../../actions/common'
import { logout } from "../../actions/auth";
import agent from '../../api/'

import { useLaravelReactI18n } from 'laravel-react-i18n'

const Users = () => {
  const { t, tChoice } = useLaravelReactI18n();

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [page, setPage] = useState('list')
  const [users, setUsers] = useState([])

  useEffect(() => {
    getUsersData()
  }, [])

  const userColumns = [
    {
      field: 'id',
      headerName: 'ID',
      maxWidth: 100,
      editable: false
    }, {
      field: 'first_name',
      headerName: t('User Name'),
      editable: false,
      flex: 1,
      renderCell: (params) => {
        return params.row.first_name;
      },
    }, 
    // {
    //   field: 'uid',
    //   headerName: t('User ID'),
    //   editable: false,
    //   flex: 1,
    // },
    {
      field: 'email',
      headerName: t('Email'),
      editable: false,
      flex: 1,
    }, {
      field: 'role',
      headerName: t('Role'),
      editable: false,
      flex: 1,
      valueFormatter: (params) => {
        if (params.value == null) {
          return '';
        }

        const valueFormatted = params.value == 1 ? '管理者' : 'ユーザー';
        return valueFormatted;
      },
    }, {
      field: 'disabled',
      headerName: t('Status'),
      flex: 1,
      renderCell: (params) => {
        console.log(params)
        if(params.row.role != 1){
          if(params.row.disabled == 1) {
            return <a className="table_user_disable_edit_btn" onClick={() => updateAccountStatus(params.row.id, 0)}>{ t('Disabled') }</a>
          } else {
            return <a className="table_user_enable_edit_btn" onClick={() => updateAccountStatus(params.row.id, 1)}>{ t('Enabled') }</a>
          }
        } else return <div></div>;
      },
    }
  ]
  

  async function getUsersData() {
      dispatch(startAction())
      try {
        const resUsers = await agent.common.getUsers()
        console.log('resUsers data=', resUsers.data.data)
        if (resUsers.data.success) {
          setUsers([...resUsers.data.data])
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

  const updateAccountStatus = async(user_id, disabled) => {
    dispatch(startAction())
		const res = await agent.common.updateAccountStatus(
      user_id, 
      disabled
    )
		if (res.data.success) {
      dispatch(showToast('success', res.data.message))
      getUsersData()
      setPage('list')
    } else dispatch(showToast('error', res.data.message))
		dispatch(endAction())
  }

  return (
    <>
      <div className="page-header">
        <div className="page-block">
          <div className="row align-items-center">
            {/* <div className="col-md-12">
              <div className="page-header-title">
                <h5 className="m-b-10">{ t('User List') } </h5>
              </div>
              <ul className="breadcrumb">
                <li className="breadcrumb-item">
                  <a href="/"><i className="feather icon-home"></i></a>
                </li>
                <li className="breadcrumb-item">
                  <a href="/users">{ t('User Management') }</a>
                </li>
              </ul>
            </div> */}
          </div>
        </div>
      </div>
      <div className="main-body">
        <div className="page-wrapper">
          <div className="row">
            <div className="col">
              {
                page == 'list' &&
                  <div className="card">
                    <div className="card-header">
                      <h5 className="card-title">{ t('List') }</h5>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-12">
                          <div className="table_container">
                            <DataTable 
                              data={users}
                              columns={userColumns}
                            />
                            {/* <button type="button" className="btn btn-primary table_btn" onClick={() => goCompanyAdd()}>{ t('Add') }</button> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
              }
              {
                page == 'add' &&
                  <></>
              }
              
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Users