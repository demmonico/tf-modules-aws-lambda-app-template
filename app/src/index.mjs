import di from './configs/di.mjs';

export const handler = async (requestEvent, ctx) => {
  /** @type {Logger} */
  const logger = (di.get('logger', {
    eventId: requestEvent.id,
    awsRequestId: ctx.awsRequestId,
  })).child({ caller: 'handler' });

  logger.debug('Incoming event', { _: requestEvent });

  // TODO ADD your code here
};
