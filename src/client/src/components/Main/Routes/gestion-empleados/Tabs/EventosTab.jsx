import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import esLocale from '@fullcalendar/core/locales/es';
import axios from 'axios';
import dayjs from 'dayjs';
import { Modal, Box, DataGrid, esES, Button } from '../../../../';
import { server } from '../../../../../helpers/constants';
import { stylesModal } from '../../../../../styles/customStyles';

const EventosTab = ({userData}) => {
    const [loading,setLoading] = useState(false);
    const [eventos,setEventos] = useState([]);
    const [eventosDia,setEventosDia] = useState([]);
    const [selectedDay,setSelectedDay] = useState(null);
    const [openView,setOpenView] = useState(false);
    const columnas = [
        {field: 'hora', headerName: 'Hora', width: 150},
        {field: 'dispositivo', headerName: 'Dispositivo', width: 200},
    ]
    const handleCloseView = async () => {
        setOpenView(false);
        setSelectedDay(null);
        await getEventos();
    }

    const getEventos = async () => {
        try{
            const result = await axios.get(`${server}/api/marcaciones/${userData.empleado_id}`);
            setEventos(result.data);
        }catch(e){
            console.log(e.message);
        }
    }
    const getDayEvents = async (day) => {
        setLoading(true);
        try{
            const result = await axios.get(`${server}/api/marcaciones/dia/${userData.empleado_id}/${day}`);
            setEventosDia(result.data);
            setLoading(false);
        }catch(e){
            console.log(e.message);
            setLoading(false);
        }
    }
    const onClickEvent = (info) => {
        const date = info.event._instance.range.end;
        const formatted = dayjs(date).format('DD-MM-YYYY');
        getDayEvents(date);
        setSelectedDay(formatted);
        setOpenView(true);
    }
    useEffect(()=>{
        getEventos();
        const interval = setInterval(()=>{
            getEventos();
        },2000);
        return ()=>{
            clearInterval(interval);
        }
    },[])
    return(
        <>
            <Modal open={openView} onClose={handleCloseView}>
                <Box sx={{...stylesModal, width: '25%', height: '60%'}}>
                    <h4 className='info-title'>Marcaciones del día: <span style={{fontSize: '20px', marginLeft: '10px'}}>{selectedDay}</span></h4>
                    <DataGrid
                        initialState={{
                            sorting: {
                                sortModel: [{field: 'hora', sort: 'desc'}]
                            }
                        }}
                        disableRowSelectionOnClick
                        localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                        autoPageSize
                        columns={columnas}
                        rows={eventosDia}
                        loading={loading}
                        height={'100%'}
                        sx={{width: '80%'}}
                    />
                    <Button sx={{marginTop: '20px'}} onClick={handleCloseView} variant='outlined' color='error'>Salir</Button>
                </Box>
            </Modal>
            <Box sx={{width:'90%',margin:'0 auto', height: '530px'}}>
                <FullCalendar
                    locale={esLocale}
                    height='100%'
                    weekends={true}
                    eventClick={onClickEvent}
                    plugins={[ dayGridPlugin ]}
                    initialView='dayGridMonth'
                    events={eventos}
                />
            </Box>
        </>
    )
}

export default EventosTab;