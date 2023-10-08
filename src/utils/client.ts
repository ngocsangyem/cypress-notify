import { getOctokit, context } from '@actions/github';
import { type WebClient } from '@slack/web-api';
import { BlockBuilder, SlackMessageDto } from 'slack-block-builder';
import { Appendable } from 'slack-block-builder/dist/internal/index';
import {
  CypressSlackReporterChatBotOpts,
} from '../types/Slack';
import { messageConstructor } from './messageConstructor';

export const sendViaBot = async(
  opts: CypressSlackReporterChatBotOpts,
  client: WebClient,
  token: string,
  customBlocks?: Appendable<BlockBuilder>,
) => {
  const { status, headingText, channel } = opts;
  const octokit = getOctokit(token);

  const branchName = await octokit.rest.repos.getBranch({
    ...context.repo,
    branch: context.ref.replace('refs/heads/', ''),
  });

  const pullRequest = await octokit.rest.repos.getCommitComment({
    ...context.repo,
    // eslint-disable-next-line camelcase
    comment_id: context.issue.number,
  });

  return await client.chat
    .postMessage(
        messageConstructor({
          channel,
          headingText,
          status,
          customBlocks,
          branchName: branchName.data.name,
          userAvatar: pullRequest.data.user?.avatar_url ?? '',
          userName: pullRequest.data.user?.name ?? '',
        }) as Readonly<SlackMessageDto>
    )
    .then((response) => response)
    .catch((err) => err);
};