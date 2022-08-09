import { EggPlugin } from 'egg';

const plugin: EggPlugin = {
  static: true,
  nunjucks: {
    enable: true,
    // package: 'egg-view-nunjucks',
    // package: 'egg-alinode',
  },
};

export default plugin;
