import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';import { esES } from '@mui/x-data-grid/locales';

export const EventosTab = () => {
    const [loading,setLoading] = useState(false);
    const [events,setEvents] = useState([]);
    const eventsColumns = [
        {field: 'fecha', headerName: 'Fecha', width: 300},
        {field: 'sentido', headerName: 'Sentido', width: 300},
        {field: 'molinete', headerName: 'Molinete', width: 300},
    ]
    return(
        <>
            <DataGrid
                disableRowSelectionOnClick={true}
                sx={{height: '400px'}}
                loading={loading}
                rows={events}
                columns={eventsColumns}
                autoPageSize
                localeText={esES.components.MuiDataGrid.defaultProps.localeText}
            />
        </>
    )
};