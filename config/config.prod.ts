import { EggAppConfig, PowerPartial } from 'egg';

export default () => {
  const config: PowerPartial<EggAppConfig> = {
    listen: {
      hostname: '0.0.0.0',
    },
  };
  return config;
};
