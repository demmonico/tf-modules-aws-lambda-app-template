const config = {
  ctxMetadata: {
    account: 'services',
    platform: 'ww',
  },
  logger: {
    defaults: {
      level: 'info', // used (from less to more verbose): error, warn, info, debug, silly
      labels: {
        account: 'services',
        platform: 'ww',
      },
    },
  },
};

export default config;

export const get = (path, defaultValue = null) => {
  const value = path.split('.').reduce((o, i) => o[i], config);
  return value || defaultValue;
};
