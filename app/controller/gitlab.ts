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
    try {
      const { ctx, app } = this;

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
      const {
        request: {
          body: {
            object_kind = '',
            user_name,
            commits,
            user,
            project: { path_with_namespace, web_url },
            object_attributes,
          },
        },
      } = ctx;
      let mdMsg = '';

      switch (event) {
        case EVENTSEnum.PUSH_HOOK: {
          const { id, message } = commits[0];

          mdMsg = `项目 [${path_with_namespace}](${web_url}) 收到一次push提交\n>提交者:  ${user_name}\n>commitID:  ${id}\n>最新提交信息:  ${message}`;
          break;
        }
        case EVENTSEnum.PIPELINE_HOOK:
          break;
        case EVENTSEnum.MERGE_REQUEST_HOOK: {
          const { name = '', avatar_url = '' } = user;
          const {
            title = '',
            state,
            url,
            target_branch,
            source_branch,
          } = object_attributes;
          mdMsg = `[${name}](${avatar_url})在 [${path_with_namespace}](${web_url}) 中${state}了一次${object_kind}\n>标题: ${title}\n>源分支: ${source_branch}\n>目标分支: ${target_branch}\n>[查看PR详情](${url})`;
          break;
        }
        case EVENTSEnum.ISSUE_HOOK: {
          const { name = '', avatar_url = '' } = user;
          const { title = '', url, action } = object_attributes;
          mdMsg = `[${name}](${avatar_url}) 在 [${path_with_namespace}](${web_url}) 中 ${action} 了一个issue\n>标题: ${title}\n>发起人: [${name}](${avatar_url})\n>[查看详情](${url})`;
          break;
        }
        case EVENTSEnum.RELEASE_HOOK:
          break;
        case EVENTSEnum.NOTE_HOOK:
          break;
        case EVENTSEnum.JOB_HOOK:
          break;
        case EVENTSEnum.TAG_PUSH_HOOK:
          break;
        case EVENTSEnum.ACTION_UPDATE:
          break;
        default:
      }

      await app.curl(
        `https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=${ctx.params.id}`,
        {
          headers: {
            'Content-Type': 'application/json;charset=utf-8',
          },
          method: 'POST',
          data: JSON.stringify({
            msgtype: 'markdown',
            markdown: { content: mdMsg },
          }),
        },
      );

      // console.log(event);
      // console.log(ctx.request.body);
      // console.log(ctx.res);
      // console.log(ctx.req);
      ctx.body = 'gitlab';
      // ctx.body = await ctx.service.gitlab.sayHi('egg');
    } catch (error) {
      console.log(error);
    }
  }
}
