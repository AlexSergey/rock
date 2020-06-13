import { IncorrectAccess } from '../errors';
import { logger } from '../logger';
import { Roles } from '../config';

export const accessRoute = (accessLayer: Roles | Roles[]) => (
  async (ctx, next): Promise<void> => {
    if (!ctx.user) {
      logger.warn('Must be used with protectedRoute middleware');
      throw new IncorrectAccess();
    }

    const { role } = ctx.user.get('Role');

    if (Array.isArray(accessLayer) && !accessLayer.includes(role)) {
      throw new IncorrectAccess();
    }

    if (!Array.isArray(accessLayer) && role !== accessLayer) {
      throw new IncorrectAccess();
    }

    await next();
  }
);
