// https://github.com/YOU54F/cypress-plugins/blob/master/cypress-slack-reporter/src/messageConstructor.ts
import { Message, Attachment, Blocks, Md, Elements } from 'slack-block-builder';
import { Appendable, BlockBuilder } from 'slack-block-builder/dist/internal/index';
import { cypressRunStatus } from '../types/Slack';

export const messageConstructor = ({
  channel,
  customBlocks,
  branchName,
}: {
  headingText?: string;
  channel?: string;
  status?: cypressRunStatus;
  customBlocks?: Appendable<BlockBuilder>;
  branchName: string;
  userName: string;
  userAvatar: string;
}) => {
  
  const messageBuilder = Message({ channel })
    .attachments(
      Attachment({
        color: '#ee5253',
      }).blocks(
        Blocks.Section({
          text: `${Md.bold('Ref')}
          ${Md.codeInline(branchName)}`,
        }),
      ),
    );
  return customBlocks
    ? messageBuilder.blocks(...customBlocks).buildToObject()
    : messageBuilder.buildToObject();
};
