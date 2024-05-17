import Periodos from '../components/Main/Routes/Configuracion/Periodos';
import Acreditaciones from '../components/Main/Routes/acreditaciones/Acreditaciones';
import EmpresasOrganismos from '../components/Main/Routes/acreditaciones/EmpresasOrganismos';
import TiposBien from '../components/Main/Routes/acreditaciones/TiposBien';
import TiposHabilitacion from '../components/Main/Routes/acreditaciones/TiposHabilitacion';
import Errores from '../components/Main/Routes/administracion/Errores';
import Permisos from '../components/Main/Routes/administracion/Permisos';
import Roles from '../components/Main/Routes/administracion/Roles';
import Usuarios from '../components/Main/Routes/administracion/Usuarios';
import Dispositivos from '../components/Main/Routes/dispositivos/Dispositivos';
import Grupos from '../components/Main/Routes/dispositivos/Grupos';
import Marcaciones from '../components/Main/Routes/dispositivos/Marcaciones';
import Credenciales from '../components/Main/Routes/gestion-empleados/Credenciales';
import Empleados from '../components/Main/Routes/gestion-empleados/Empleados';
import Firmas from '../components/Main/Routes/gestion-empleados/Firmas';
import TiposCredencial from '../components/Main/Routes/gestion-empleados/TiposCredencial';
import Espacios from '../components/Main/Routes/gestion-espacios/Espacios';
import Oficinas from '../components/Main/Routes/gestion-espacios/Oficinas';
import Enroladores from '../components/Main/Routes/molinetes/Enroladores';
import Equipos from '../components/Main/Routes/molinetes/Equipos';
import ReportesVisitas from '../components/Main/Routes/reportes-visitas/ReportesVisitas';
import CargaVisitas from '../components/Main/Routes/visitas/CargaVisitas';
import RegistroVisitas from '../components/Main/Routes/visitas/RegistroVisitas';

export const routesList = [
  /* Acreditaciones */
  {
    path: '/acreditaciones/acreditaciones',
    RouteComponent: <Acreditaciones/>
  },
  {
    path: '/acreditaciones/tipos-habilitacion',
    RouteComponent: <TiposHabilitacion/>
  },
  {
    path: '/acreditaciones/tipos-bien',
    RouteComponent: <TiposBien/>
  },
  {
    path: '/acreditaciones/empresas-organismos',
    RouteComponent: <EmpresasOrganismos/>
  },

  /* Visitas */
  {
    path: '/visitas/carga-visitas',
    RouteComponent: <CargaVisitas/>
  },
  {
    path: '/visitas/registro-visitas',
    RouteComponent: <RegistroVisitas/>
  },
  /* Dispositivos */
  {
    path: '/equipos/grupos',
    RouteComponent: <Grupos/>
  },
  {
    path: '/equipos',
    RouteComponent: <Dispositivos/>
  },
  {
    path: '/equipos/marcaciones',
    RouteComponent: <Marcaciones/>
  },
  /* Empleados */
  {
    path: '/gestion-empleados/empleados',
    RouteComponent: <Empleados/>
  },
  {
    path: '/gestion-empleados/credenciales',
    RouteComponent: <Credenciales/>
  },
  {
    path: '/gestion-empleados/tipos-credencial',
    RouteComponent: <TiposCredencial/>
  },
  {
    path: '/gestion-empleados/firmas',
    RouteComponent: <Firmas/>
  },
  /* Configuración */
  {
    path: '/configuracion/periodos',
    RouteComponent: <Periodos/>
  },
  /* Espacios físicos */
  {
    path: '/gestion-espacios/oficinas',
    RouteComponent: <Oficinas/>
  },
  {
    path: '/gestion-espacios/espacios',
    RouteComponent: <Espacios/>
  },
  /* Dispositivos */
  {
    path: '/molinetes/equipos',
    RouteComponent: <Equipos/>
  },
  {
    path: '/molinetes/enroladores',
    RouteComponent: <Enroladores/>
  },
  /* Visitas */
  {
    path: '/reportes-visitas',
    RouteComponent: <ReportesVisitas/>
  },
  /* Usuarios */
  {
    path: '/administracion/permisos',
    RouteComponent: <Permisos/>
  },
  {
    path: '/administracion/roles',
    RouteComponent: <Roles/>
  },
  {
    path: '/administracion/usuarios',
    RouteComponent: <Usuarios/>
  },
  {
    path: '/administracion/errores',
    RouteComponent: <Errores/>
  },
]