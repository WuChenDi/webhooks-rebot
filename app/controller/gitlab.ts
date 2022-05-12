import { Controller } from 'egg';

const HEADER_KEY = 'x-gitlab-event';

const HEADER_KEY_V2 = 'X-Gitlab-Event';

// export enum EVENTSEnum {
//   PUSH_HOOK = 'Push Hook',
//   PIPELINE_HOOK = 'Pipeline Hook',
//   MERGE_REQUEST_HOOK = 'Merge Request Hook',
//   ISSUE_HOOK = 'Issue Hook',
//   RELEASE_HOOK = 'Release Hook',
//   NOTE_HOOK = 'Note Hook',
//   JOB_HOOK = 'Job Hook',
//   TAG_PUSH_HOOK = 'Tag Push Hook',
//   ACTION_UPDATE = 'update',
// }

export default class GitlabController extends Controller {
  public async index() {
    try {
      const { ctx, app } = this;
      const { groupKey } = ctx.params;

      const event = (ctx.request.header[HEADER_KEY] || ctx.request.header[HEADER_KEY_V2]) as string;
      if (!event) {
        ctx.body = { msg: 'Sorry, this may not be a gitlab webhook request, suppressed.' };
        return;
      }

      // 微信群的webhookUrl通过群组的webhook的key进行url的拼接
      const webhookUrl = `https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=${groupKey}`;
      const message = await ctx.service.gitlab.translateMsg(ctx.request.body);

      console.log('body', ctx.request.body);

      if (!message || !webhookUrl) {
        ctx.body = { msg: 'message or webhookUrl is empty or not supported, suppressed.' };
        return;
      }

      // 调用微信群的webhook API
      const result = await app.curl(webhookUrl, {
        method: 'POST',
        headers: {
          'content-type': 'application/json; charset=UTF-8',
        },
        // 自动解析 JSON response
        dataType: 'json',
        // 3 秒超时
        timeout: 3000,
        data: message,
      });

      console.log(result);

      ctx.body = {
        webhook_url: webhookUrl,
        webhook_message: message,
        status: result.status,
        headers: result.headers,
        package: result.data,
      };

      // await app.curl(
      //   `https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=${ctx.params.id}`,
      //   {
      //     headers: {
      //       'Content-Type': 'application/json;charset=utf-8',
      //     },
      //     method: 'POST',
      //     data: JSON.stringify({
      //       msgtype: 'markdown',
      //       markdown: { content: mdMsg },
      //     }),
      //   },
      // );
    } catch (error) {
      console.log(error);
    }
  }
}
