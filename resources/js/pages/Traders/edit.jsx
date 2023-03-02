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
  const [editStatus, setEditStatus] = useState(false);
  const [data, setData] = useState({
    routing_id : 0,
    prefecture : ''
  });

  useEffect(() => {
    getRouting();
    getClipboardSetting();
    getTrader(detailData.id);
  }, [])

  // useEffect(() => {
  //   calcCopyTXT();
  // }, [routing, clipboard, data])

  useEffect(() => {
    calcCopyTXT();
  }, [data, routing])

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

  const getTrader = async(id) => {
    dispatch(startAction())
    try {
      const res = await agent.common.getTrader(id)
      if (res.data.success) {   
        setData(res.data.data)
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

  const clickEditBtn = () => {
    setEditStatus(true);
  }
  const clickSaveBtn = async() => {
    dispatch(startAction())
    try {
      const res = await agent.common.updateTrader(data.id, data)
      if (res.data.success) {   
        setData(res.data.data)
        dispatch(showToast('success', t('Successfully updated!')))
        getTrader(detailData.id);
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
  const clickEditCancelBtn = () => {
    setEditStatus(false);
    getTrader(detailData.id);

  }
  const handleChange = (event) => {
    setData({...data, [event.target.name]:event.target.value})
  }

  const calcCopyTXT = () => {
    var selectedRouting = routing.find(element => element.id == data.routing_id);
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
        content += data.id;
      }
      if(clipboard[i].column_name == '日付'){
        content += data.date;
      }
      if(clipboard[i].column_name == 'サイト種別'){
        if(data.site_type == null || undefined)
          content += '';
        else
          content += data.site_type;

      }
      if(clipboard[i].column_name == '経路'){
        console.log(selectedRouting);
        if(selectedRouting)
          content += selectedRouting.path_name;
        else
          content += '';
      }
      if(clipboard[i].column_name == '社名'){
        content += data.company_name;
      } 
      if(clipboard[i].column_name == '電話番号'){
        content += data.telephone_number;
      }
      if(clipboard[i].column_name == '都道府県'){
        content += data.prefecture;
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
            value={data.id}
            margin="normal"
            onChange={handleChange}
            fullWidth
            disabled
            />

          <TextField 
            id="date" 
            type="date"
            name="date" 
            label={ t('Date') }
            value = {data.date}
            InputLabelProps={{
              shrink: true,
            }}
            margin="normal"
            onChange={handleChange}
            
            fullWidth
            disabled = {!editStatus}
            />

          <FormControl fullWidth margin="normal">
            <InputLabel id="demo-simple-select-label">{ t('Routing') }</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              name="routing_id"
              label={ t('Routing') }
              value={data.routing_id}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
              disabled = {!editStatus}
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
            name="site_type"
            label={ t('Site Type') } 
            value={data.site_type}
            margin="normal"
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth 
            disabled = {!editStatus}
            />

          <TextField 
            id="fullWidth" 
            name="membership_type"
            label={ t('Membership Type') } 
            value={data.membership_type}
            margin="normal"
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth 
            disabled = {!editStatus}
            />

          <TextField 
            id="fullWidth"
            name="company_name"
            label={ t('Company Name') } 
            value={data.company_name}
            margin="normal"
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth 
            disabled = {!editStatus}
            />

          <FormControl fullWidth margin="normal">
            <InputLabel id="demo-simple-select-label">{ t('Prefecture') }</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              name="prefecture"
              label={ t('Prefecture') }
              value={data.prefecture}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
              disabled = {!editStatus}
            >
              {
                prefecturesList.length > 0 && prefecturesList.map((item, index) => 
                  <MenuItem value={item.value} key={index}>{item.value}</MenuItem>
                )
              }
            </Select>
          </FormControl>

          <TextField 
            id="fullWidth" 
            name="cell_content"
            label={ t('Cell Content') } 
            value={data.cell_content}
            margin="normal"
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth 
            disabled = {!editStatus}
            />

          <TextField 
            id="fullWidth" 
            name="first_representative"
            label={ t('First Representative') } 
            value={data.first_representative}
            margin="normal"
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth 
            disabled = {!editStatus}
            />

          <TextField 
            id="fullWidth" 
            name="correspondence_situation"
            label={ t('Correspondence Situation') } 
            value={data.correspondence_situation}
            margin="normal"
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth 
            disabled = {!editStatus}
            />

          <TextField 
            id="fullWidth" 
            name="mobilephone_number"
            label={ t('Mobilephone Number') } 
            value={data.mobilephone_number}
            margin="normal"
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth 
            disabled = {!editStatus}
            />

          <TextField 
            id="fullWidth" 
            name="telephone_number"
            label={ t('Telephone Number') } 
            value={data.telephone_number}
            margin="normal"
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth 
            disabled = {!editStatus}
            />

        </div>
      </div>
      <div style={{ textAlign: 'center'}}>
        {
          editStatus == false ?
          <>
            <Button variant="contained" sx={{ mt: 1, mr: 1 }} onClick={()=> clickEditBtn()}>
              {t('Edit')}
            </Button>
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
          </>
          :
          <>
          <Button variant="contained" sx={{ mt: 1, mr: 1 }} onClick={()=> clickSaveBtn()}>
            {t('Save')}
          </Button>
          <Button variant="contained" sx={{ mt: 1, mr: 1 }} onClick={()=> clickEditCancelBtn()}>
            {t('Cancel')}
          </Button>
        </>
        }

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