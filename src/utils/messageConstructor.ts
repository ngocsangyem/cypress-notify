// https://github.com/YOU54F/cypress-plugins/blob/master/cypress-slack-reporter/src/messageConstructor.ts
import { Message, Attachment, Blocks } from 'slack-block-builder';
import { Appendable, BlockBuilder } from 'slack-block-builder/dist/internal/index';
import { cypressRunStatus } from '../types/Slack';

export const messageConstructor = ({
  channel,
  customBlocks
}: {
  headingText?: string;
  channel?: string;
  status?: cypressRunStatus;
  customBlocks?: Appendable<BlockBuilder>;
}) => {
  const messageBuilder = Message({ channel })
    .attachments(
      Attachment({
        color: '#36a64f',
      }),
    )
    .blocks(
      Blocks.Section({
        text: 'Cypress Slack Reporter'
      }),
      Blocks.Divider(),
    );
  return customBlocks
    ? messageBuilder.blocks(...customBlocks).buildToObject()
    : messageBuilder.buildToObject();
};
