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

  const branchName = context.ref.split('/').slice(2).join('/');
  
  const listPullRequests = await octokit.rest.repos.listPullRequestsAssociatedWithCommit({
    owner: context.repo.owner,
    repo: context.repo.repo,
    // eslint-disable-next-line camelcase
    commit_sha: context.sha,
  });
  const prs = listPullRequests.data.filter((el) => el.state === 'open');
  const pr =
        prs.find((el) => {
          return context.payload.ref === `refs/heads/${el.head.ref}`;
        }) || prs[0];
  const repoUrl = `https://github.com/${context.repo.repo}`;

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
          actionUrl: `${repoUrl}/actions/runs/${context.runId}`,
          prUrl: pr?.url || '',
        }) as Readonly<SlackMessageDto>
    )
    .then((response) => response)
    .catch((err) => err);
};