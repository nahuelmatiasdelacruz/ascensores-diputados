import React, { useState } from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import DashboardIcon from '@mui/icons-material/Dashboard';
import '../../../../styles/styles.css';
import EdgesensorLowIcon from '@mui/icons-material/EdgesensorLow';
import PersonIcon from '@mui/icons-material/Person';
import TourIcon from '@mui/icons-material/Tour';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SecurityIcon from '@mui/icons-material/Security';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import TagFacesIcon from '@mui/icons-material/TagFaces';
import CreditCardIcon from '@mui/icons-material/CreditCard';

export const IndexPage = () => {
    const [tipoRegistros,setTipoRegistros] = useState('mensual');
    const handleChangeTipo = (e) => {
        setTipoRegistros(e.target.value)
    }
    const data = [
        {
          name: '1',
          mupd: 4000,
          mt: 2400,
          amt: 2400,
        },
        {
          name: '2',
          mupd: 3000,
          mt: 1398,
          amt: 2210,
        },
        {
          name: '3',
          mupd: 2000,
          mt: 9800,
          amt: 2290,
        },
        {
          name: '4',
          mupd: 2780,
          mt: 3908,
          amt: 2000,
        },
        {
          name: '5',
          mupd: 1890,
          mt: 4800,
          amt: 2181,
        },
        {
          name: '6',
          mupd: 2390,
          mt: 3800,
          amt: 2500,
        },
        {
          name: '7',
          mupd: 3490,
          mt: 4300,
          amt: 2100,
        },
        {
            name: '8',
            mupd: 3490,
            mt: 4300,
            amt: 2100,
        },
        {
          name: '9',
          mupd: 2333,
          mt: 3500,
          amt: 2100,
        },
        {
          name: '10',
          mupd: 3490,
          mt: 4300,
          amt: 2100,
        },
        {
          name: '11',
          mupd: 3499,
          mt: 5600,
          amt: 2100,
        },
        {
          name: '12',
          mupd: 2100,
          mt: 3244,
          amt: 2100,
        },
        {
          name: '13',
          mupd: 4119,
          mt: 7600,
          amt: 2100,
        },
        {
          name: '14',
          mupd: 1346,
          mt: 5472,
          amt: 2100,
        },
        {
          name: '15',
          mupd: 1543,
          mt: 4314,
          amt: 2100,
        },
        {
          name: '16',
          mupd: 3156,
          mt: 3467,
          amt: 2100,
        },
        {
          name: '17',
          mupd: 1233,
          mt: 3543,
          amt: 2100,
        },
        {
          name: '18',
          mupd: 2680,
          mt: 2344,
          amt: 2100,
        },
        {
          name: '19',
          mupd: 4189,
          mt: 1233,
          amt: 2100,
        },
    ];
    return(
        <div className='index-container'>
            <div className='index-header'>
                <DashboardIcon/>
                <h4>Dashboard</h4>
            </div>
            <div className='main-data'>
                <div className='dashboard-values'>
                    <div className='value'>
                        <div className='icon-image'>
                            <PersonIcon sx={{fontSize: 50}}/>
                        </div>
                        <p className='icon-title'>Usuarios</p>
                        <p className='icon-values'>232</p>
                    </div>
                    <div className='value'>
                        <div className='icon-image'>
                            <TagFacesIcon sx={{fontSize: 50}}/>
                        </div>
                        <p className='icon-title'>Visual Face</p>
                        <p className='icon-values'>0</p>
                    </div>
                    <div className='value'>
                        <div className='icon-image'>
                            <FingerprintIcon sx={{fontSize: 50}}/>
                        </div>
                        <p className='icon-title'>Huellas</p>
                        <p className='icon-values'>411</p>
                    </div>
                    <div className='value'>
                        <div className='icon-image'>
                            <CreditCardIcon sx={{fontSize: 50}}/>
                        </div>
                        <p className='icon-title'>Tarjetas</p>
                        <p className='icon-values'>12346</p>
                    </div>
                    <div className='value'>
                        <div className='icon-image'>
                            <EdgesensorLowIcon sx={{fontSize: 50}}/>
                        </div>
                        <p className='icon-title'>Dispositivos</p>
                        <p className='icon-values'>1233</p>
                    </div>
                    <div className='value'>
                        <div className='icon-image'>
                            <LocationOnIcon sx={{fontSize: 50}}/>
                        </div>
                        <p className='icon-title'>Área</p>
                        <p className='icon-values'>0</p>
                    </div>
                    <div className='value'>
                        <div className='icon-image'>
                            <SecurityIcon sx={{fontSize: 50}}/>
                        </div>
                        <p className='icon-title'>Grupos</p>
                        <p className='icon-values'>5</p>
                    </div>
                </div>
                <div className='visits'>
                    <div className='visits-header'>
                        <TourIcon color='primary' />
                        <h4>Visitas hoy</h4>
                    </div>
                    <div className='visits-value'>
                        <h3>32</h3>
                    </div>
                </div>
            </div>
            <div className='registros-diarios'>
                <div className='registros-header'>
                    <h4>Registros diarios</h4>
                    <Box>
                      <FormControl sx={{width: 160}}>
                        <InputLabel id='demo-simple-select-label'>Tipo</InputLabel>
                        <Select labelId='demo-simple-select-label' id='demo-simple-select' value={tipoRegistros} label='Age' onChange={handleChangeTipo}>
                          <MenuItem value='mensual'>Mensual</MenuItem>
                          <MenuItem value='semanal'>Semanal</MenuItem>
                          <MenuItem value='diario'>Diario</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                </div>
                <div style={{width:'100%', height:'70%'}}>
                    <LineChart width={1500} height={300} data={data} margin={{top: 5,right: 30,left: 20,bottom: 5,}}>
                      <CartesianGrid strokeDasharray='3 3' />
                      <XAxis dataKey='name' />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type='monotone' dataKey='mupd' stroke='#0a1128ff' activeDot={{ r: 8 }} />
                      <Line type='monotone' dataKey='mt' stroke='#1282a2ff' />
                    </LineChart>
                </div>
            </div>
            <div className='real-time-register'>
            </div>
        </div>
    )
};