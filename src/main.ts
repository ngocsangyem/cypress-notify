import { createReadStream } from 'fs';
import { setFailed, getInput, debug, setOutput } from '@actions/core';
import { WebClient } from '@slack/web-api';
import walkSync from 'walk-sync';
import { sendViaBot } from './utils/client';

(async(): Promise<void> => {
  const token = getInput('token');
  const channels = getInput('channels');
  const workdir = getInput('workdir') || 'cypress';
  const messageText =
      getInput('message-text') ||
      "A Cypress test just finished. I've placed the screenshots and videos in this thread. Good pie!";

  debug(`Channels: ${channels}`);

  debug('Initializing slack SDK');
  const slack = new WebClient(token);
  debug('Slack SDK initialized successfully');

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
    { channel: channels, headingText: messageText },
    slack,
  );

  const threadID = result.ts;
  const channelId = result.channel;

  if (screenshots.length > 0) {
    debug('Uploading screenshots...');

    await Promise.all(
      screenshots.map(async screenshot => {
        debug(`Uploading ${screenshot}`);

        await slack.files.uploadV2({
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
