export default () => {
  return {
    env: process.env.NODE_ENV || 'development',
    currencyLayer: {
      accessKey: process.env.CURRENCY_LAYER_API_KEY,
      endpoint: process.env.CURRENCY_LAYER_API_ENDPOINT,
    },
  };
};
