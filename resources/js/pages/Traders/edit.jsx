import React, { useState, useEffect, useRef } from "react";
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import {Button, Box, Stepper, Step, StepLabel, StepContent, Paper, Typography, FormControl, Input, InputLabel, MenuItem, Select, TextField, CircularProgress }  from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { startAction, endAction, showToast } from '../../actions/common'
import agent from '../../api/'
import { logout } from "../../actions/auth";
import { useLaravelReactI18n } from 'laravel-react-i18n'
import { prefecturesList } from '../../utils/prefectures';
import { Check } from "@mui/icons-material";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import DataTable from "../../components/DataTable";

const Edit = (props) => {
  const { detailData } = props;
  const { t, tChoice } = useLaravelReactI18n();

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [routing, setRouting] = useState([]);
  const [clipboard, setClipboard] = useState([]);
  const [copyContent, setCopyContent] = useState([]);
  const [copyStatus, setCopyStatus] = useState(false);

  useEffect(() => {
    getRouting();
    getClipboardSetting();
  }, [])

  useEffect(() => {
    calcCopyTXT();
  }, [routing, clipboard])

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

  const getClipboardSetting = async() => {
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

  const clickCancelBtn = () => {
    props.clickCancelBtn();
  }

  const calcCopyTXT = () => {
    var selectedRouting = routing.find(element => element.id == detailData.routing_id);
    clipboard.sort((a, b) => a.column_number !== b.column_number ? a.column_number < b.column_number ? -1 : 1 : 0);
    var content = '';
    for(let i = 0; i < clipboard.length ; i ++){
      if( i == 0){
        if(clipboard[i].column_number > 0){
          let tabCount = clipboard[i].column_number;
          let j = 0;
          for(j = 0;  j < tabCount; j ++ ){
            content += "\t";
          }
        }
      }
      else{
        let tabCount = clipboard[i].column_number - clipboard[i-1].column_number;
        let j = 0;
        for(j = 0;  j < tabCount; j ++ ){
          content += "\t";
        }
      }

      if(clipboard[i].column_name == 'ID'){
        content += detailData.id;
      }
      if(clipboard[i].column_name == '日付'){
        content += detailData.date;
      }
      if(clipboard[i].column_name == 'サイト種別'){
        if(detailData.site_type == null || undefined)
          content += '';
        else
          content += detailData.site_type;

      }
      if(clipboard[i].column_name == '経路'){
        content += selectedRouting.path_name;
      }
      if(clipboard[i].column_name == '社名'){
        content += detailData.company_name;
      } 
      if(clipboard[i].column_name == '電話番号'){
        content += detailData.telephone_number;
      }
      if(clipboard[i].column_name == '都道府県'){
        content += detailData.prefecture;
      }
    }
    setCopyContent(content);
  }

  return (
    <>
      <div className="row">                            
        <div className="col-md-12">
            <TextField 
            id="id" 
            type="text"
            name="id" 
            label={ t('ID') }
            InputLabelProps={{
              shrink: true,
            }}
            value={detailData && detailData.id}
            margin="normal"
            fullWidth
            disabled
            />
          <TextField 
            id="date" 
            type="date"
            name="date" 
            label={ t('Date') }
            value = {detailData && detailData.date}
            InputLabelProps={{
              shrink: true,
            }}
            margin="normal"
            fullWidth
            disabled
            />

          <FormControl fullWidth margin="normal">
            <InputLabel id="demo-simple-select-label">{ t('Routing') }</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              name="routing_id"
              label={ t('Routing') }
              value={detailData && detailData.routing_id}
              disabled
            >
              <MenuItem value={0} key="none">{t('None')}</MenuItem>
              {
                routing.length > 0 && routing.map((item, index) => 
                  <MenuItem value={item.id} key={index}>{item.path_name}</MenuItem>
                )
              }
            </Select>
          </FormControl>
          
          <TextField 
            id="fullWidth"
            name="company_name"
            label={ t('Company Name') } 
            value={detailData && detailData.company_name}
            margin="normal"
            fullWidth 
            disabled
            />

          <TextField 
            id="fullWidth" 
            name="telephone_number"
            label={ t('Phone Number') } 
            value={detailData && detailData.telephone_number}
            margin="normal"
            fullWidth 
            disabled
            />
          
          <FormControl fullWidth margin="normal">
            <InputLabel id="demo-simple-select-label">{ t('Prefecture') }</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              name="prefecture"
              label={ t('Prefecture') }
              value={detailData && detailData.prefecture}
              disabled
            >
              {
                prefecturesList.length > 0 && prefecturesList.map((item, index) => 
                  <MenuItem value={item.value} key={index}>{item.value}</MenuItem>
                )
              }
            </Select>
          </FormControl>
        </div>
      </div>
      <div style={{ textAlign: 'center'}}>
        <CopyToClipboard 
          options={{format: "text/plain"}}
          text={copyContent}
          onCopy={() => setCopyStatus(true)}>
          <Button variant="contained" sx={{ mt: 1, mr: 1 }}>
            { copyStatus ? 
              <><ContentCopyIcon />{ t('Copied') }</>
              : 
              <><ContentCopyIcon />{ t('Copy') }</>
            }
            
          </Button>
        </CopyToClipboard>
      </div>
      <hr />
      <div className="action_btn_group">
        <Button color="primary" startIcon={<ArrowBackIcon />} onClick={() => clickCancelBtn()}>
          { t('Back') }
        </Button>
      </div>
    </>
                 
  )
}

export default Edit