import React, { useContext, createContext, useState } from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import { l, nl, sprintf } from './jed';
import Localization from './Localization';
import LocalizationObserver from './LocalizationObserver';

const WrapperContext = createContext(null);

let ctx;
let wrapper;

const localeData = {
  domain: 'messages',
  // eslint-disable-next-line @typescript-eslint/camelcase
  locale_data: {
    messages: {
      '': {
        domain: 'messages',
        // eslint-disable-next-line @typescript-eslint/camelcase
        plural_forms: 'nplurals=3; plural=(n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2);',
        lang: 'ru'
      },
      'Alarm!': ['Ахтунг!'],
      'Hello world': ['Привет мир'],
      '%d click': ['%d клик', '%d кликов', '%d кликов'],
      'Sort By': ['Сортировать по'],
      Latest: ['По последнему'],
      'Most Popular': ['Самый популярный'],
      'Most Viewed': ['Самый просматриваемый'],
      'Most Commented': ['Самый комментируемый'],
      'USER\u0004Your name is %s and surname is %s': ['Ваше имя %s ваша фамилия %s']
    }
  }
};

beforeAll(() => {
  const Wrapper = ({ children }): JSX.Element => {
    const [name, setName] = useState('Ivan');
    const [activeLang, setActiveLang] = useState('en');
    const [count, setCount] = useState(0);

    const increment = (): void => {
      setCount(count + 1);
    };

    const resetCounter = (): void => {
      setCount(0);
    };

    const resetName = (): void => {
      setName('Ivan');
    };

    return (
      <WrapperContext.Provider value={{
        setActiveLang,
        setName,
        increment,
        resetCounter,
        resetName
      }}
      >
        {children(activeLang, name, count)}
      </WrapperContext.Provider>
    );
  };

  const App = ({ name, count }): JSX.Element => {
    ctx = useContext(WrapperContext);

    return (
      <div>
        <p className="test-case-1">
          <Localization>{l('Hello world')}</Localization>
        </p>
        <p className="test-case-2">
          <Localization>
            {
              sprintf(
                nl(
                  '%d click',
                  '%d clicks',
                  count
                ),
                count
              )
            }
          </Localization>
        </p>
        <p className="test-case-3">
          <Localization>
            {
              sprintf(
                l('Your name is %s and surname is %s', 'USER'),
                <span style={{ textDecoration: 'underline' }}>
                  <b>{name}</b>
                </span>,
                <span style={{ textDecoration: 'underline' }}>
                  <b>Pupkin</b>
                </span>
              )
            }
          </Localization>
        </p>
      </div>
    );
  };

  wrapper = mount(
    <Wrapper>
      {(activeLang, name, count): JSX.Element => (
        <LocalizationObserver currentLanguage={activeLang} languages={{ ru: localeData }}>
          <App name={name} count={count} />
        </LocalizationObserver>
      )}
    </Wrapper>
  );
});

describe('Test default language (English)', () => {
  test('Basic l - Hello world example', async () => {
    expect(
      wrapper.find('.test-case-1')
        .text()
    )
      .toBe('Hello world');
  });

  test('nl singular test with zero count', async () => {
    expect(
      wrapper.find('.test-case-2')
        .text()
    )
      .toBe('0 clicks');
  });

  test('nl singular test with incremented count', async () => {
    await act(async () => {
      ctx.increment();
    });
    expect(
      wrapper.find('.test-case-2')
        .text()
    )
      .toBe('1 click');
  });

  test('nl plural test with one more incrementation', async () => {
    await act(async () => {
      ctx.increment();
    });
    expect(
      wrapper.find('.test-case-2')
        .text()
    )
      .toBe('2 clicks');
  });

  test('sprintf test with react components', async () => {
    expect(
      wrapper.find('.test-case-3')
        .find('.localization-node')
        .html()
    )
      .toBe('<span class="localization-node ">Your name is <span style="text-decoration:underline"><b>Ivan</b></span> and surname is <span style="text-decoration:underline"><b>Pupkin</b></span></span>');
  });

  test('sprintf change name in the sentence', async () => {
    await act(async () => {
      ctx.setName('Sergey');
    });

    expect(
      wrapper.find('.test-case-3')
        .find('.localization-node')
        .html()
    )
      .toBe('<span class="localization-node ">Your name is <span style="text-decoration:underline"><b>Sergey</b></span> and surname is <span style="text-decoration:underline"><b>Pupkin</b></span></span>');
  });
});

describe('Test Russian language', () => {
  test('Basic l - Привет мир example', async () => {
    await act(async () => {
      ctx.setActiveLang('ru');
    });
  });
  test('Basic l - Привет мир example', async () => {
    expect(
      wrapper.find('.test-case-1')
        .text()
    )
      .toBe('Привет мир');
  });

  test('nl singular test with zero count', async () => {
    await act(async () => {
      ctx.resetCounter();
    });
    expect(
      wrapper.find('.test-case-2')
        .text()
    )
      .toBe('0 кликов');
  });

  test('nl singular test with incremented count', async () => {
    await act(async () => {
      ctx.increment();
    });
    expect(
      wrapper.find('.test-case-2')
        .text()
    )
      .toBe('1 клик');
  });

  test('nl plural test with one more incrementation', async () => {
    await act(async () => {
      ctx.increment();
    });
    expect(
      wrapper.find('.test-case-2')
        .text()
    )
      .toBe('2 кликов');
  });

  test('sprintf test with react components', async () => {
    await act(async () => {
      ctx.resetName();
    });
    expect(
      wrapper.find('.test-case-3')
        .find('.localization-node')
        .html()
    )
      .toBe('<span class="localization-node ">Ваше имя <span style="text-decoration:underline"><b>Ivan</b></span> ваша фамилия <span style="text-decoration:underline"><b>Pupkin</b></span></span>');
  });

  test('sprintf change name in the sentence', async () => {
    await act(async () => {
      ctx.setName('Sergey');
    });

    expect(
      wrapper.find('.test-case-3')
        .find('.localization-node')
        .html()
    )
      .toBe('<span class="localization-node ">Ваше имя <span style="text-decoration:underline"><b>Sergey</b></span> ваша фамилия <span style="text-decoration:underline"><b>Pupkin</b></span></span>');
  });
});
