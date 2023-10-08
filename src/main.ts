import { createReadStream } from 'fs';
import { setFailed, getInput, debug, setOutput } from '@actions/core';
import { WebClient } from '@slack/web-api';
import { globby } from 'globby';
import { Blocks } from 'slack-block-builder';
import { cypressRunStatus } from './types/Slack';
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

  debug('Checking for videos and/or screenshots from cypress');
  const getScreenshots = async() => {
    const paths = await globby(
      workdir,
      {
        expandDirectories: {
          files: ['*'],
          extensions: ['png']
        }
      }
    );
  
    return paths;
  };

  const screenshots = await getScreenshots();

  if (screenshots.length <= 0) {
    debug('No screenshots found. Exiting!');
    setOutput('result', 'No videos or screenshots found!');
    return;
  }

  debug(
    `${screenshots.length} screenshots`
  );

  debug('Sending initial slack message');
  const result = await sendViaBot(
    { status: cypressRunStatus['test:failed'], channel: 'github-test' },
    slack,
    [
      Blocks.Section({
        text: '<http://sometesturl.com$/pnggrad16rgb.png|Screenshot:- pnggrad16rgb.png>'
      })
    ]
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
