import Jed from 'jed';
import { isValidElement, ReactElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

export interface I18N {
  options: {};
  pgettext: (context: string, text: string) => string;
  gettext: (text: string) => string;
  npgettext: (context: string, singular: string, plural: string, amount: number) => string;
  ngettext: (singular: string, plural: string, amount: number) => string;
  sprintf: (...args: string[]) => string;
}

type CB = () => string;

export const i18n = new Jed({ domain: 'messages' });

const l = (text: string, context?: string) => (): string => (
  context ?
    i18n.pgettext(context, text) :
    i18n.gettext(text)
);

const nl = (singular: string, plural: string, amount: number, context?: string) => (): string => (
  context ?
    i18n.npgettext(context, singular, plural, amount) :
    i18n.ngettext(singular, plural, amount)
);

const sprintf = (...args: Array<ReactElement<unknown> | string | number | undefined | CB>) => (): string => (
  i18n.sprintf.apply(
    i18n, args.map(item => {
      if (isValidElement(item)) {
        return renderToStaticMarkup(item);
      } else if (typeof item === 'function') {
        return item();
      }
      return item;
    })
  )
);

export { l, nl, sprintf };
