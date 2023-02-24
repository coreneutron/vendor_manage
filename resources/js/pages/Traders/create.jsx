import React, { useState, useEffect, useRef } from "react";
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { IMaskInput } from 'react-imask';
import {Button, Box, Stepper, Step, StepLabel, StepContent, Paper, Typography, FormControl, Input, InputLabel, MenuItem, Select, TextField, CircularProgress }  from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { startAction, endAction, showToast } from '../../actions/common'
import agent from '../../api/'
import { logout } from "../../actions/auth";
import { useLaravelReactI18n } from 'laravel-react-i18n'
import { prefecturesList } from '../../utils/prefectures';
import { Check } from "@mui/icons-material";

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

const Create = (props) => {
  const { t, tChoice } = useLaravelReactI18n();

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [checkStatus, setCheckStatus] = useState(0); // 0:check, 1:checking, 2:error, 3:create, 4:creating, 5:error, 6:complete 
  const [routing, setRouting] = useState([]);
  const [trader, setTrader] = useState({
    date: '',
    company_name: '',
    routing_id: 0,
    telephone_number: '(123) 456-7890',
    prefecture_id: 0
  });

  useEffect(() => {
    getRouting();
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

  const steps = ['Duplicate Check', 'Trader Create'];
  
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const handleChange = (event) => {
    setTrader({
      ...trader,
      [event.target.name]: event.target.value,
    });
  }

  const handleDuplicateCheck = async() => {
    console.log(trader);
    if(trader.date === '' || trader.company_name === '' || trader.routing_id === 0 || trader.prefecture_id === 0){
      dispatch(showToast('error', 'All value must be entered!'))
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
    props.clickCancelBtn();
  }
  return (
    <>
      <div className="row">                            
        <div className="col-md-6">
          <TextField 
            id="date" 
            type="date"
            name="date" 
            label={ t('Date') } 
            defaultValue="1990-01-01"
            InputLabelProps={{
              shrink: true,
            }}
            onChange={handleChange}
            fullWidth
            margin="normal"
            />

          <FormControl fullWidth margin="normal">
            <InputLabel id="demo-simple-select-label">{ t('Routing') }</InputLabel>
            <Select
              id="demo-simple-select"
              name="routing_id"
              labelId="demo-simple-select-label"
              value={trader.routing_id}
              label={ t('Routing') }
              onChange={handleChange}
            >
              <MenuItem value={0} key="none">None</MenuItem>
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
            fullWidth 
            label={ t('Company Name') } 
            margin="normal"
            onChange={handleChange}
            />

          <div style={{display:'flex', justifyContent: 'space-around', alignItems: 'center', marginTop: '10px', marginBottom: '10px'}}>
            <div>{ t('Telephone Number') } :</div>
            <Input
              id="formatted-text-mask-input"
              name="telephone_number"
              variant="filled"
              inputComponent={TextMaskCustom}
              value={trader.telephone_number}
              onChange={handleChange}
            />
          </div>
          
          <FormControl fullWidth margin="normal">
            <InputLabel id="demo-simple-select-label">{ t('Prefectures') }</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={trader.prefecture_id}
              label="Prefecture"
              name="prefecture_id"
              onChange={handleChange}
            >
              {
                prefecturesList.length > 0 && prefecturesList.map((item, index) => 
                  <MenuItem value={item.id} key={index}>{item.value}</MenuItem>
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
                  Alert message
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
                        <Button
                          variant="contained"
                          onClick={handleDuplicateCheck}
                          sx={{ mt: 1, mr: 1 }}
                        >
                          Check
                        </Button> 
                      }
                      {
                        index == 0 && checkStatus == 1 &&
                        <Button
                          variant="contained"
                          sx={{ mt: 1, mr: 1 }}
                        >
                          <CircularProgress color="secondary" size={20}/>  &nbsp;
                          Checking...
                        </Button> 
                      }
                      {
                        index == 0 && checkStatus == 2 &&  
                        <Button
                          variant="contained"
                          onClick={handleDuplicateCheck}
                          sx={{ mt: 1, mr: 1 }}
                        >
                          try
                        </Button>
                      }
                      {
                        index == 1 && checkStatus == 3 &&  
                        <Button
                          variant="contained"
                          onClick={handleTraderCreate}
                          sx={{ mt: 1, mr: 1 }}
                        >
                          Create
                        </Button>
                      }
                      {
                        index == 1 && checkStatus == 4 &&  
                        <Button
                          variant="contained"
                          sx={{ mt: 1, mr: 1 }}
                        >
                          <CircularProgress color="secondary" size={20}/>  &nbsp;
                          Creating...
                        </Button>
                      }
                      {
                        index == 1 && checkStatus == 5 &&  
                        <Button
                          variant="contained"
                          onClick={handleTraderCreate}
                          sx={{ mt: 1, mr: 1 }}
                        >
                          Try
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
            <Typography>Trader Created</Typography>
            <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
              New Create
            </Button>
          </Paper>
        )}
        </div>
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

export default Create