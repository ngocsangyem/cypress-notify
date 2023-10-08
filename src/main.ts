import { createReadStream } from 'fs';
import { setFailed, getInput, debug, setOutput } from '@actions/core';
import { getOctokit, context } from '@actions/github';
import { WebClient } from '@slack/web-api';
import walkSync from 'walk-sync';
import { sendViaBot } from './utils/client';

(async(): Promise<void> => {
  const token = getInput('token');
  const channels = getInput('channels');
  const workdir = getInput('workdir') || 'cypress';
  

  debug(`Token: ${token}`);
  debug(`Channels: ${channels}`);

  debug('Initializing slack SDK');
  const slack = new WebClient(getInput('token'));
  debug('Slack SDK initialized successfully');

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

  debug(`Branch name: ${branchName}`);
  debug(`PR: ${pr}`);
  debug(`repoUrl: ${repoUrl}`);

  debug('Checking for screenshots from cypress');

  const screenshots = walkSync(workdir, { globs: ['**/*.png'] });

  if (screenshots.length <= 0) {
    debug('No screenshots found. Exiting!');
    setOutput('result', 'No videos or screenshots found!');
    return;
  }

  debug(`Found ${screenshots.length} screenshots`);

  debug('Sending initial slack message');
  const result = await sendViaBot(
    { channel: channels },
    slack,
  );

  const threadID = result.ts;
  const channelId = result.channel;

  if (screenshots.length > 0) {
    debug('Uploading screenshots...');

    await Promise.all(
      screenshots.map(async screenshot => {
        debug(`Uploading ${screenshot}`);

        await slack.files.upload({
          filename: screenshot,
          file: createReadStream(`${workdir}/${screenshot}`),
          // eslint-disable-next-line camelcase
          thread_ts: threadID,
          channels: channelId
        });
      })
    );

    debug('...done!');
  }

  debug('Updating message to indicate a successful upload');

  setOutput('result', 'Bingo bango bongo!');

})().catch(error => {
  console.log(error);
  setFailed(error.message);
});
