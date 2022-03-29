import { Controller } from 'egg';

const HEADER_KEY = 'x-gitlab-event';

const HEADER_KEY_V2 = 'X-Gitlab-Event';

enum EVENTSEnum {
  PUSH_HOOK = 'Push Hook',
  PIPELINE_HOOK = 'Pipeline Hook',
  MERGE_REQUEST_HOOK = 'Merge Request Hook',
  ISSUE_HOOK = 'Issue Hook',
  RELEASE_HOOK = 'Release Hook',
  NOTE_HOOK = 'Note Hook',
  JOB_HOOK = 'Job Hook',
  TAG_PUSH_HOOK = 'Tag Push Hook',
  ACTION_UPDATE = 'update',
}

export default class GitlabController extends Controller {
  public async index() {
    // const { ctx, app } = this;
    const { ctx } = this;

    const event = (ctx.request.header[HEADER_KEY] ||
      ctx.request.header[HEADER_KEY_V2]) as string;

    if (!event) {
      ctx.body = 'Sorry, 这可能不是一个 gitlab 的 webhook 请求';
      return;
    }
    if (!ctx.params.id) {
      ctx.body = '请输入 webhooks 地址';
      return;
    }

    switch (event) {
      case EVENTSEnum.PUSH_HOOK:
      case EVENTSEnum.PIPELINE_HOOK:
      case EVENTSEnum.MERGE_REQUEST_HOOK:
      case EVENTSEnum.ISSUE_HOOK:
      case EVENTSEnum.RELEASE_HOOK:
      case EVENTSEnum.NOTE_HOOK:
      case EVENTSEnum.JOB_HOOK:
      case EVENTSEnum.TAG_PUSH_HOOK:
      case EVENTSEnum.ACTION_UPDATE:
      default:
    }

    // const res = await app.curl(
    //   `https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=${ctx.params.id}`,
    //   {
    //     headers: {
    //       'Content-Type': 'application/json;charset=utf-8',
    //     },
    //     method: 'POST',
    //     data: JSON.stringify({
    //       msgtype: 'markdown',
    //       markdown: { content: '123' },
    //     }),
    //   },
    // );

    // console.log(res);

    console.log(event);
    console.log(ctx);
    ctx.body = 'gitlab';
    // ctx.body = await ctx.service.gitlab.sayHi('egg');
  }
}
