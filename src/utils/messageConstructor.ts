// https://github.com/YOU54F/cypress-plugins/blob/master/cypress-slack-reporter/src/messageConstructor.ts
import { Message, Attachment, Blocks, Md, Elements } from 'slack-block-builder';
import { Appendable, BlockBuilder } from 'slack-block-builder/dist/internal/index';
import { cypressRunStatus } from '../types/Slack';

export const messageConstructor = ({
  channel,
  customBlocks,
  branchName,
  actionUrl,
  prUrl,
  userName,
  userAvatar,
  headingText,
  prTitle,
}: {
  headingText?: string;
  channel?: string;
  status?: cypressRunStatus;
  customBlocks?: Appendable<BlockBuilder>;
  branchName: string;
  userName: string;
  userAvatar: string;
  actionUrl: string;
  prUrl: string;
  prTitle: string;
}) => {
  
  const messageBuilder = Message({ channel, text: headingText })
    .attachments(
      Attachment({
        color: '#ee5253',
      }).blocks(
        userName && userAvatar ? Blocks.Context().elements(
          Elements.Img({ imageUrl: userAvatar, altText: userName }),
          `${userName}`,
        ) : undefined,
        Blocks.Section().fields([
          `${Md.bold('Ref')}`,
          `${Md.codeInline(branchName)}`
        ]),
        prUrl ? Blocks.Section().fields([
          `${Md.bold('Pull request')}`,
          `${prUrl} - ${prTitle}`
        ]) : undefined,
        actionUrl ? Blocks.Section().fields([
          `${Md.bold('Action url')}`,
          `${actionUrl}`
        ]) : undefined,
      ),
    );
  return customBlocks
    ? messageBuilder.blocks(...customBlocks).buildToObject()
    : messageBuilder.buildToObject();
};
