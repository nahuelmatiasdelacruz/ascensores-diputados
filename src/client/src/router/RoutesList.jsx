import { Acreditaciones, EmpresasOrganismos, TiposBien, TiposHabilitacion } from '../components/Main/Routes/Acreditaciones';
import { Errores,Permisos,Roles,Usuarios } from '../components/Main/Routes/Administracion';
import { Periodos } from '../components/Main/Routes/Configuracion';
import { Dispositivos,Grupos,Marcaciones } from '../components/Main/Routes/Dispositivos';
import { Credenciales,Empleados,Firmas,TiposCredencial } from '../components/Main/Routes/Gestion-empleados';
import { Espacios,Oficinas } from '../components/Main/Routes/Gestion-espacios';
import { Enroladores,Equipos } from '../components/Main/Routes/Molinetes';
import { ReportesVisitas } from '../components/Main/Routes/Reportes-visitas';
import { CargaVisitas,RegistroVisitas } from '../components/Main/Routes/Visitas';


export const routesList = [
  /* Acreditaciones */
  {
    path: '/acreditaciones/acreditaciones',
    RouteComponent: Acreditaciones
  },
  {
    path: '/acreditaciones/tipos-habilitacion',
    RouteComponent: TiposHabilitacion
  },
  {
    path: '/acreditaciones/tipos-bien',
    RouteComponent: TiposBien
  },
  {
    path: '/acreditaciones/empresas-organismos',
    RouteComponent: EmpresasOrganismos
  },

  /* Visitas */
  {
    path: '/visitas/carga-visitas',
    RouteComponent: CargaVisitas
  },
  {
    path: '/visitas/registro-visitas',
    RouteComponent: RegistroVisitas
  },
  /* Dispositivos */
  {
    path: '/equipos/grupos',
    RouteComponent: Grupos
  },
  {
    path: '/equipos',
    RouteComponent: Dispositivos
  },
  {
    path: '/equipos/marcaciones',
    RouteComponent: Marcaciones
  },
  /* Empleados */
  {
    path: '/Gestion-empleados/empleados',
    RouteComponent: Empleados
  },
  {
    path: '/Gestion-empleados/credenciales',
    RouteComponent: Credenciales
  },
  {
    path: '/Gestion-empleados/tipos-credencial',
    RouteComponent: TiposCredencial
  },
  {
    path: '/Gestion-empleados/firmas',
    RouteComponent: Firmas
  },
  /* Configuración */
  {
    path: '/configuracion/periodos',
    RouteComponent: Periodos
  },
  /* Espacios físicos */
  {
    path: '/gestion-espacios/oficinas',
    RouteComponent: Oficinas
  },
  {
    path: '/gestion-espacios/espacios',
    RouteComponent: Espacios
  },
  /* Dispositivos */
  {
    path: '/molinetes/equipos',
    RouteComponent: Equipos
  },
  {
    path: '/molinetes/enroladores',
    RouteComponent: Enroladores
  },
  /* Visitas */
  {
    path: '/reportes-visitas',
    RouteComponent: ReportesVisitas
  },
  /* Usuarios */
  {
    path: '/Administracion/permisos',
    RouteComponent: Permisos
  },
  {
    path: '/Administracion/roles',
    RouteComponent: Roles
  },
  {
    path: '/Administracion/usuarios',
    RouteComponent: Usuarios
  },
  {
    path: '/Administracion/errores',
    RouteComponent: Errores
  },
]