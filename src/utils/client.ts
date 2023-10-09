import { getOctokit, context } from '@actions/github';
import { type WebClient } from '@slack/web-api';
import { Utils, ContextHelper } from '@technote-space/github-action-helper';
import ghAvatar from 'gh-avatar';
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
  const { getActor } = Utils;
  const { getRepository } = ContextHelper;

  const prIssue = await octokit.rest.issues.get({
    // eslint-disable-next-line camelcase
    issue_number: context.issue.number,
    owner: context.repo.owner,
    repo: context.repo.repo,
  });
  const userAvatar = await ghAvatar(getActor());
  const repoUrl = `https://github.com/${getRepository(context)}`;
  const branchName = context.ref.split('/').slice(2).join('/');

  return await client.chat
    .postMessage(
        messageConstructor({
          channel,
          headingText,
          status,
          customBlocks,
          branchName: branchName,
          userAvatar: `${userAvatar}&size=32`,
          userName: getActor(),
          actionUrl: `<${repoUrl}/actions/runs/${context.runId} | #${context.runId}>`,
          prUrl: prIssue.data.number
            ? `<${repoUrl}/pulls/${prIssue.data.number} | #${prIssue.data.number}>`
            : '',
        }) as Readonly<SlackMessageDto>
    )
    .then((response) => response)
    .catch((err) => err);
};