import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';import { esES } from '@mui/x-data-grid/locales';
import MenuItem from '@mui/material/MenuItem';
import Chip from '@mui/material/Chip';
import TouchAppIcon from '@mui/icons-material/TouchApp';
import Modal from '@mui/material/Modal';
import * as XLSX from 'xlsx';
import { GridToolbarContainer,
    GridToolbarExportContainer,
    GridCsvExportMenuItem,
    useGridApiContext,
    gridFilteredSortedRowIdsSelector,
    gridVisibleColumnFieldsSelector } from '@mui/x-data-grid';
import axios from 'axios';
import { server } from '../../../../helpers/constants';
import dayjs from 'dayjs';

const Marcaciones = () => {
    const [loading,setLoading] = useState(false);
    const [marcaciones,setMarcaciones] = useState([]);
    const marcacionesColumns = [
        {field: 'documento', headerName: 'DNI', width: '200'},
        {field: 'apellido', headerName: 'Apellido', width: '150'},
        {field: 'nombre', headerName: 'Nombre', width: '150'},
        {field: 'tipo', headerName: 'Tipo', width: '250'},
        {field: 'sector', headerName: 'Sector', width: '150'},
        {field: 'fecha', headerName: 'Fecha de marcacion', width: '150'},
        {field: 'equipo', headerName: 'Equipo', width: '150'},
        // {field: 'tipo_marcacion', headerName: 'Tipo de marcación', width: '140', renderCell: (params)=>{
        //     return(
        //         <>
        //             {
        //                 params.row.tipo_marcacion === 'ingreso' ? 
        //                 <Chip color='primary' label='Ingreso'/>
        //                 :
        //                 <Chip color='warning' label='Salida'/>
        //             }
        //         </>
        //     )
        // }},
    ];
    const getMarcaciones = async () => {
        //const fechaDesde = dayjs().format('DD-MM-YYYY');
        //const params = {
        //    fechaDesde
        //}
        try{
            //const result = await axios.get(`${server}/api/registros/filtro`,{
            //    params
            //});
            const result = await axios.get(`${server}/api/marcaciones`);
            setMarcaciones(result.data);
        }catch(e){
            console.log(e.messsage);
        }

    }
    const downloadExcel = (marcaciones) => {
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(marcaciones);
        XLSX.utils.book_append_sheet(workbook, worksheet, `Marcaciones`);
        const nombreArchivo = `Marcaciones.xlsx`;
        XLSX.writeFile(workbook, nombreArchivo);
    }
    const getExcel = (apiRef) => {
        const filteredSortedRowIds = gridFilteredSortedRowIdsSelector(apiRef);
        const visibleColumnsField = gridVisibleColumnFieldsSelector(apiRef);
        const data = filteredSortedRowIds.map((id) => {
          const row = {};
          visibleColumnsField.forEach((field) => {
            row[field] = apiRef.current.getCellParams(id, field).value;
          });
          return row;
        });
        const parsedToDownload = data.map((marcacion)=>{
            return {
                DOCUMENTO: marcacion.documento,
                APELLIDO: marcacion.apellido,
                NOMBRE: marcacion.nombre,
                TIPO: marcacion.tipo,
                SECTOR: marcacion.sector,
                FECHA: marcacion.fecha,
                EQUIPO: marcacion.equipo
            }
        });
        downloadExcel(parsedToDownload);
    };
    function ExcelExportMenuItem(props) {
        const apiRef = useGridApiContext();
        const { hideMenu } = props;
        return (
          <MenuItem
            onClick={() => {
              getExcel(apiRef);
              hideMenu?.();
            }}
          >
            Exportar EXCEL
          </MenuItem>
        );
    }
    const csvOptions = { delimiter: ';' };
    function CustomExportButton(props) {
      return (
        <GridToolbarExportContainer {...props}>
          <GridCsvExportMenuItem options={csvOptions} />
          <ExcelExportMenuItem/>
        </GridToolbarExportContainer>
      );
    }
    function CustomToolbar(props) {
      return (
        <GridToolbarContainer {...props}>
          <CustomExportButton />
        </GridToolbarContainer>
      );
    }
    useEffect(()=>{
        getMarcaciones();
        const interval = setInterval(()=>{
            getMarcaciones();
        },3000);
        return ()=>{
            clearInterval(interval);
        }
    },[]);
    return(
        <>
            <div className='content-header'>
                <TouchAppIcon fontSize='large'/>
                <h3>Registro de marcaciones</h3>
            </div>
            {/* Vista principal */}
            <DataGrid
                slots={{toolbar: CustomToolbar}}
                disableRowSelectionOnClick={true}
                autoPageSize
                sx={{margin: '0', height: '80%'}}
                loading={loading}
                rows={marcaciones}
                columns={marcacionesColumns}
                localeText={esES.components.MuiDataGrid.defaultProps.localeText}
            />
        </>
    )
}

export default Marcaciones;