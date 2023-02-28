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

const Create = (props) => {
  const { t, tChoice } = useLaravelReactI18n();

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [checkStatus, setCheckStatus] = useState(0); // 0:check, 1:checking, 2:error, 3:create, 4:creating, 5:error, 6:complete 
  const [createStatus, setCreateStatus] = useState(0); // 0: default, 1: created
  const [copyStatus, setCopyStatus] = useState(false);
  const [routing, setRouting] = useState([]);
  const [copyContent, setCopyContent] = useState([]);
  const [trader, setTrader] = useState({
    id: '',
    date: '',
    company_name: '',
    routing_id: 0,
    telephone_number: '1234567890',
    prefecture: 'なし',
    site_type:''
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
      renderCell: () => (
        <FormControl variant="standard" fullWidth>
          <Select
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            name="route"
            value={trader.routing_id}
          >
          {
            routing.length > 0 && routing.map((item, index) => 
              <MenuItem value={item.id} key={index}>{item.path_name}</MenuItem>
            )
          }
          </Select>
        </FormControl>
      ),
    },
    {
      field: 'telephone_number',
      headerName: t('Telephone Number'),
      editable: false,
      flex: 1,
    },
    {
      field: 'prefecture',
      headerName: t('Prefectures'),
      renderCell: () => (
        <FormControl variant="standard" fullWidth>
          <Select
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            name="prefecture"
            value={trader.prefecture}
          >
          {
            prefecturesList.length > 0 && prefecturesList.map((item, index) => 
              <MenuItem value={item.value} key={index}>{item.value}</MenuItem>
            )
          }
          </Select>
        </FormControl>
      ),
    }
  ]


  const [traders, setTraders] = useState([]);
  const [clipboard, setClipboard] = useState([]);

  useEffect(() => {
    getRouting();
    getClipboardSetting();
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
  const steps = [t('Duplicate Check'), t('Trader Create')];
  
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setCheckStatus(0);
    setActiveStep(0);
    setCreateStatus(0);
  };

  const handleChange = (event) => {
    setTrader({
      ...trader,
      [event.target.name]: event.target.value,
    });
  }

  const handleDuplicateCheck = async() => {
    if(trader.date === '' || trader.company_name === '' || trader.routing_id === 0 || trader.prefecture === 'なし' || trader.telephone_number == ''){
      dispatch(showToast('error', t('All values must be entered!')))
    } else {
      setCheckStatus(1);
      dispatch(startAction())
      try {
        const res = await agent.common.checkTrader(trader)
        if (res.data.success) {
          setCheckStatus(3);
          setActiveStep((prevActiveStep) => prevActiveStep + 1);
        } else {
          setCheckStatus(2);
          setTraders(res.data.data)
        } 
        dispatch(endAction())
      } catch (error) {
        setCheckStatus(0);
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
  }

  const handleTraderCreate = async() => {
    setCheckStatus(4);
    dispatch(startAction())
    try {
      const res = await agent.common.createTrader(trader)
      if (res.data.success) {
        setCheckStatus(6);
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setCreateStatus(1);
        calcCopyTXT(res.data.data.id);
      } else {
        setCheckStatus(5);
      } 
      dispatch(endAction())
    } catch (error) {
      setCheckStatus(3);
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

  const isStepFailed = (step) => {
    if(step === 0 && checkStatus === 2)
      return true;
    if(step === 1 && checkStatus === 5)
      return true;
  };

  const clickCancelBtn = () => {
    setCreateStatus(0);
    props.clickCancelBtn();
  }

  const calcCopyTXT = (primary_id) => {
    var selectedRouting = routing.find(element => element.id == trader.routing_id);
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
        content += primary_id;
      }
      if(clipboard[i].column_name == '日付'){
        content += trader.date;
      }
      if(clipboard[i].column_name == 'サイト種別'){
        content += trader.site_type;
      }
      if(clipboard[i].column_name == '経路'){
        content += selectedRouting.path_name;
      }
      if(clipboard[i].column_name == '社名'){
        content += trader.company_name;
      } 
      if(clipboard[i].column_name == '電話番号'){
        content += trader.telephone_number;
      }
      if(clipboard[i].column_name == '都道府県'){
        content += trader.prefecture;
      }
    }
    setCopyContent(content);
  }

  return (
    <>
      <div className="row">                            
        <div className="col-md-6">
          {
            createStatus == 1 ?
            <TextField 
            id="id" 
            type="text"
            name="id" 
            label={ t('ID') }
            InputLabelProps={{
              shrink: true,
            }}
            value={trader.id}
            onChange={handleChange}
            margin="normal"
            fullWidth
            disabled
            />
            :
            null
          }
          <TextField 
            id="date" 
            type="date"
            name="date" 
            label={ t('Date') }
            InputLabelProps={{
              shrink: true,
            }}
            onChange={handleChange}
            margin="normal"
            fullWidth
            disabled={createStatus == 1 ? true : false}
            />

          <FormControl fullWidth margin="normal">
            <InputLabel id="demo-simple-select-label">{ t('Routing') }</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              name="routing_id"
              label={ t('Routing') }
              value={trader.routing_id}
              onChange={handleChange}
              disabled={createStatus == 1 ? true : false}
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
            value={trader.company_name}
            onChange={handleChange}
            margin="normal"
            fullWidth 
            disabled={createStatus == 1 ? true : false}
            />

          <TextField 
            id="fullWidth" 
            name="telephone_number"
            label={ t('Phone Number') } 
            value={trader.telephone_number}
            onChange={handleChange}
            margin="normal"
            fullWidth 
            disabled={createStatus == 1 ? true : false}
            />
          
          <FormControl fullWidth margin="normal">
            <InputLabel id="demo-simple-select-label">{ t('Prefecture') }</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              name="prefecture"
              label={ t('Prefecture') }
              value={trader.prefecture}
              onChange={handleChange}
              disabled={createStatus == 1 ? true : false}
            >
              {
                prefecturesList.length > 0 && prefecturesList.map((item, index) => 
                  <MenuItem value={item.value} key={index}>{item.value}</MenuItem>
                )
              }
            </Select>
          </FormControl>
        </div>
        <div className="col-md-6">
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((label, index) => {
            const labelProps = {};
            if (isStepFailed(index)) {
              labelProps.optional = (
                <Typography variant="caption" color="error">
                {
                  checkStatus === 2 ? 'Duplicated' : null
                }
                </Typography>
              );

              labelProps.error = true;
            }

            return (
              <Step key={label}>
                <StepLabel {...labelProps}>{label}</StepLabel>
                <StepContent>
                  <Box sx={{ mb: 2 }}>
                    <div>
                      {
                        index == 0 && checkStatus == 0 &&
                        <>
                          <Button
                            variant="contained"
                            onClick={handleDuplicateCheck}
                            sx={{ mt: 1, mr: 1 }}
                          >
                            {t('Duplicate Check')}
                          </Button>
                        </>
                      }
                      {
                        index == 0 && checkStatus == 1 &&
                        <Button
                          variant="contained"
                          sx={{ mt: 1, mr: 1 }}
                        >
                          <CircularProgress color="secondary" size={20}/>  &nbsp;
                          { t('Checking') }
                        </Button> 
                      }
                      {
                        index == 0 && checkStatus == 2 &&  
                        <Button
                          variant="contained"
                          onClick={handleDuplicateCheck}
                          sx={{ mt: 1, mr: 1 }}
                        >
                          { t('Try') }
                        </Button>
                      }
                      {
                        index == 1 && checkStatus == 3 &&  
                        <Button
                          variant="contained"
                          onClick={handleTraderCreate}
                          sx={{ mt: 1, mr: 1 }}
                        >
                          { t('Create') }
                        </Button>
                      }
                      {
                        index == 1 && checkStatus == 4 &&  
                        <Button
                          variant="contained"
                          sx={{ mt: 1, mr: 1 }}
                        >
                          <CircularProgress color="secondary" size={20}/>  &nbsp;
                          {t('Creating')}
                        </Button>
                      }
                      {
                        index == 1 && checkStatus == 5 &&  
                        <Button
                          variant="contained"
                          onClick={handleTraderCreate}
                          sx={{ mt: 1, mr: 1 }}
                        >
                          { t('Try') }
                        </Button>
                      }
                    </div>
                  </Box>
                </StepContent>
              </Step>
            );
          })}
        </Stepper>
        {activeStep === steps.length && (
          <Paper square elevation={0} sx={{ p: 3 }}>
            <Typography>{t('Trader Created')}</Typography>
            <CopyToClipboard 
              options={{format: "text/plain"}}
              text={copyContent}
              onCopy={() => setCopyStatus(true)}>
              <Button variant="contained" sx={{ mt: 1, mr: 1 }}>
                <ContentCopyIcon />{ t('Copy') }
              </Button>
            </CopyToClipboard>
            {copyStatus ? <span style={{color: 'red'}}>{ t('Copied') }</span> : null}
            <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
              {t('Create')}
            </Button>
          </Paper>
        )}
        </div>
      </div>
      {
        checkStatus === 2 && traders.length > 0 &&
        <DataTable 
          data={traders}
          columns={traderColumns} />
      }
      <hr />
      <div className="action_btn_group">
        <Button color="primary" startIcon={<ArrowBackIcon />} onClick={() => clickCancelBtn()}>
          { t('Back') }
        </Button>
      </div>
    </>
                 
  )
}

export default Create