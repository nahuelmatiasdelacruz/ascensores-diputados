const docsQueries = {
  ADD_DOCUMENT: `call sgp.sp_adjunto_ins(:empleado_id,:observaciones,:originalname,1,null)`,
  DELETE_DOCUMENT: `call sgp.sp_adjunto_del(:p_adjunto_id,1)`,
};

module.exports = {docsQueries};