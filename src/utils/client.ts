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

  console.log('octokit', octokit);
  

  const branchName = context.ref.split('/').slice(2).join('/');

  return await client.chat
    .postMessage(
        messageConstructor({
          channel,
          headingText,
          status,
          customBlocks,
          branchName: branchName,
          userAvatar: '',
          userName: '',
        }) as Readonly<SlackMessageDto>
    )
    .then((response) => response)
    .catch((err) => err);
};