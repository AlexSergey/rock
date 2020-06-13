import { message } from 'antd';
import { isNotProduction } from './mode';

export const notify = (level, text, isImportant): void => {
  if (isNotProduction() && ['log', 'warn', 'info', 'error'].includes(level)) {
    //eslint-disable-next-line
    console[level](text);
  }
  if (isImportant) {
    switch (level) {
      case 'log':
        message.success(text);
        break;
      case 'info':
        message.info(text);
        break;
      case 'warn':
        message.warn(text);
        break;
      case 'error':
        message.error(text);
        break;
    }
  }
};
