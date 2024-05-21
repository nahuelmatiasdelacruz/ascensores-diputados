const { default: axios } = require("axios");

const serviceHost = `http://${process.env.SERVICE_HOST}:${process.env.SERVICE_PORT}/`;

const executeServiceFunction = async (object = {},action) => {
  const response = await axios.post(serviceHost,object,{ headers:{'x-action':action} });
  if(response.data.Response === 'ERROR'){
    throw new Error(`Hubo un error en el servicio: ${response.Message}`);
  };
};

module.exports = {executeServiceFunction}