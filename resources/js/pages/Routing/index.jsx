import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux'
import DataGridTable from "../../components/DataGridTable";

import { startAction, endAction, showToast } from '../../actions/common';
import agent from '../../api/';

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'

import {BsExclamationCircle} from "react-icons/bs"

import { useLaravelReactI18n } from 'laravel-react-i18n';

const Routing = (props) => {
  const { t, tChoice } = useLaravelReactI18n();
  const dispatch = useDispatch();
  const [routing, setRouting] = useState([]);
  const [type, setType] = useState('create');

  const routingListColumns = [
    {
      field: 'path_name',
      headerName: t('Path Name'),
      maxWidth: 200,
      editable: true,
      flex: 1,
    }, 
    {
      field: 'display_order',
      headerName: t('Display Order'),
      maxWidth: 100,
      type: 'number',
      editable: true,
      flex: 1,
    },
  ]

  useEffect(() => {
    getRouting()
  }, [])

  const handleSaveClick = async(data) => {
    if(!data.path_name || !data.display_order ){
      dispatch(showToast('error', t('All values must be entered!')));
      getRouting()
      return ;
    }
    if(type == 'create') {
      dispatch(startAction())
      try {
        const res = await agent.common.addRouting(data)
        if (res.data.success) {
          setRouting([...routing, res.data.data])
          getRouting()
          dispatch(showToast('success', res.data.message))
        }
        else {
          dispatch(showToast('error', res.data.message))
        }
      } catch (error) {
        if (error.response.status >= 400 && error.response.status <= 500) {
          dispatch(showToast('error', error.response.data.message))
          if (error.response.data.message == 'Unauthorized') {
            localStorage.removeItem('token')
            dispatch(logout())
            navigate('/')
          }
        }
      }
      dispatch(endAction())
    } else if(type == 'update') {
      dispatch(startAction())
      try {
        const res = await agent.common.editRouting(data.id, data)
        console.log(res);
        if (res.data.success) {
          dispatch(showToast('success', res.data.message))
          getRouting()
        }
        else dispatch(showToast('error', res.data.message))
        dispatch(endAction())
      } catch (error) {
        console.log(error);
        if (error.response.status >= 400 && error.response.status <= 500) {
          dispatch(showToast('error', error.response.data.message))
          if (error.response.data.message == 'Unauthorized') {
            localStorage.removeItem('token')
            dispatch(logout())
            navigate('/')
          }
        }
      }
      dispatch(endAction())
    }
    setType('create');
  }
  
  const handleEditClick = () => {
    setType('update');
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
              <button type="button" className="btn btn-success" onClick={() => {onClose(); handleDeleteSbumit(id);}}>はい</button>
            </div>
          </div>
        );
      }
    });
  }

  const handleDeleteSbumit = async(id) => {
    dispatch(startAction())
    const res = await agent.common.deleteRouting(id);
    if (res.data.success) {
      getRouting();
      dispatch(showToast('success', res.data.message));
    }
    else dispatch(showToast('error', res.data.message));
    dispatch(endAction());
  }
  
  const handleCancelClick= () => {
    console.log('cancel');
  }

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

  return (
    <>
      <DataGridTable
        data={routing}
        title={t('Routing List')}
        column={routingListColumns}
        clickEditBtn={() => handleEditClick()}
        clickDeleteBtn={(id) => handleDeleteClick(id)}
        clickCancelBtn={() => handleCancelClick()}
        clickSaveBtn={(data, type) => handleSaveClick(data, type)}
      />
    </>
  )
}

export default Routing;