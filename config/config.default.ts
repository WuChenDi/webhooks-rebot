import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>;

  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1648542822632_9050';
  config.security = {
    csrf: {
      enable: false,
    },
  };

  // add your egg config in here
  config.middleware = [];

  config.alinode = {
    server: 'wss://agentserver.node.aliyun.com:8080',
    appid: '',
    secret: '',
  };

  // add your special config in here
  const bizConfig = {
    sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`,
  };

  // the return config will combines to EggAppConfig
  return {
    ...config,
    ...bizConfig,
  };
};
