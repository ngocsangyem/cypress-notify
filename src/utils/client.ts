import { context } from '@actions/github';
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
  customBlocks?: Appendable<BlockBuilder>,
) => {
  const { status, headingText, channel } = opts;
  const { getActor, getPrBranch } = Utils;
  const { getRepository } = ContextHelper;
  

  const userAvatar = await ghAvatar(getActor());
  const repoUrl = `https://github.com/${getRepository(context)}`;
  

  return await client.chat
    .postMessage(
        messageConstructor({
          channel,
          headingText,
          status,
          customBlocks,
          branchName: getPrBranch(context),
          userAvatar: `${userAvatar}&size=32`,
          userName: getActor(),
          actionUrl: `<${repoUrl}/actions/runs/${context.runId} | #${context.runId}>`,
          prUrl: context.issue.number
            ? `<${repoUrl}/pull/${context.issue.number} | #${context.issue.number}>`
            : '',
        }) as Readonly<SlackMessageDto>
    )
    .then((response) => response)
    .catch((err) => err);
};