import React from 'react';
// eslint-disable-next-line import/no-webpack-loader-syntax,import/order
import codeActionsExample from 'raw-loader!./code/code-actions.example';
// eslint-disable-next-line import/no-webpack-loader-syntax,import/order
import codeReducerExample from 'raw-loader!./code/code-reducer.example';
// eslint-disable-next-line import/no-webpack-loader-syntax,import/order
import codeSagaExample from 'raw-loader!./code/code-saga.example';
// eslint-disable-next-line import/no-webpack-loader-syntax,import/order
import codeContainerExample from 'raw-loader!./code/code-container.example';
// eslint-disable-next-line import/no-webpack-loader-syntax,import/order
import codeStoreExample from 'raw-loader!./code/code-store.example';
// eslint-disable-next-line import/no-webpack-loader-syntax,import/order
import codeIndexExample from 'raw-loader!./code/code-index.example';
// eslint-disable-next-line import/no-webpack-loader-syntax,import/order
import codeInstallationExample from 'raw-loader!./code/code-installation.example';
// eslint-disable-next-line import/no-webpack-loader-syntax,import/order
import codeBuildExample from 'raw-loader!./code/code-build.example';
// eslint-disable-next-line import/no-webpack-loader-syntax,import/order
import codeRunExample from 'raw-loader!./code/code-run.example';
// eslint-disable-next-line import/no-webpack-loader-syntax,import/order
import codeServerExample from 'raw-loader!./code/code-server.example';
// eslint-disable-next-line import/no-webpack-loader-syntax,import/order
import codeContainerChangingExample from 'raw-loader!./code/code-container-changing.example';
// eslint-disable-next-line import/no-webpack-loader-syntax,import/order
import codeStoreStateExample from 'raw-loader!./code/code-store-state.example';
// eslint-disable-next-line import/no-webpack-loader-syntax,import/order
import codeServerSSRExample from 'raw-loader!./code/code-server-ssr.example';
// eslint-disable-next-line import/no-webpack-loader-syntax,import/order
import codeEmptyStoreExample from 'raw-loader!./code/code-empty-store.example';
// eslint-disable-next-line import/no-webpack-loader-syntax,import/order
import codeServerRenderExample from 'raw-loader!./code/code-server-render.example';
// eslint-disable-next-line import/no-webpack-loader-syntax,import/order
import codeUseUssrExample from 'raw-loader!./code/code-use-ussr.example';
// eslint-disable-next-line import/no-webpack-loader-syntax,import/order
import codeSagaSolveExample from 'raw-loader!./code/code-saga-solve.example';
// eslint-disable-next-line import/no-webpack-loader-syntax,import/order
import codeStateToClientExample from 'raw-loader!./code/code-state-to-client.example';
// eslint-disable-next-line import/no-webpack-loader-syntax,import/order
import codeClientStateExample from 'raw-loader!./code/code-client-state.example';
import Code from '../../components/Code';

const Page = () => (
  <div>
    <p>
      If you haven't read the <a href="/ssr-1-creating-simple-ssr-application">first part</a> of this article, it covers the basic concepts and ideas. I ask you to read it
      first and only then continue reading.
    </p>

    <p>
      Of course, in real life, none of us will store important state in the local state of the component. For
      these purposes, we use different state management systems, such as Redux, Mobx and others. In this article I will
      consider an example of how to make an application with SSR support from an existing application using Redux,
      Redux-Saga.
    </p>

    <p>
      As an example, we have Redux + Redux-Saga application that works with an API:
    </p>

    <p><strong>actions.js:</strong></p>

    <Code code={codeActionsExample} language="jsx" />

    <p><strong>reducer.js:</strong></p>

    <Code code={codeReducerExample} language="jsx" />

    <p><strong>saga.js:</strong></p>

    <Code code={codeSagaExample} language="jsx" />

    <p><strong>Container.jsx:</strong></p>

    <Code code={codeContainerExample} language="jsx" />

    <p>
      Everything is pretty clear. We make a request. We put the loading state, when the response arrives, we extract the
      data as payload, put it in the reducer, render. If an error occurs, set the error flag.
    </p>

    <p><strong>store.js:</strong></p>

    <Code code={codeStoreExample} language="jsx" />

    <p><strong>index.jsx:</strong></p>

    <Code code={codeIndexExample} language="jsx" />

    <h3>Let's start migration to the SSR!</h3>

    <p>Let's start with the same steps as in the first part of the article:</p>

    <p>1. Installation</p>

    <Code code={codeInstallationExample} language="bash" />

    <p>
      Let's create a build.js file at the root of our project. It will allow us to compile our client and server,
      processing TS, JSX, various resources such as SVG, images, and more.
    </p>

    <Code code={codeBuildExample} language="jsx" />

    <p><i>Launch commands:</i></p>

    <Code code={codeRunExample} language="bash" />

    <p>
      The general logic is not necessary, we will rename our index.jsx to <strong>client.jsx</strong> and create
      <strong>server.jsx</strong>:
    </p>

    <Code code={codeServerExample} language="jsx" />

    <h3>Redux, Saga -> SSR</h3>

    <p>We have finished preparing, now we have gone step by step.</p>

    <p>Change in <strong>Container.jsx</strong></p>

    <Code code={codeContainerChangingExample} language="jsx" />

    <p>
      <i>
        <strong>useUssrEffect</strong> is a method from <a href="https://github.com/AlexSergey/rockpack/blob/master/packages/ussr/README.md">@rockpack/ussr</a>. See the first part of the article.
      </i>
    </p>

    <p>Modify <strong>store.js</strong> to receive synchronized state:</p>

    <Code code={codeStoreStateExample} language="jsx" />

    <p>Modifying <strong>server.jsx</strong></p>

    <Code code={codeServerSSRExample} language="jsx" />

    <p>What's going on here?</p>

    <p>1. We create store with default state as empty object:</p>

    <Code code={codeEmptyStoreExample} language="jsx" />

    <p>
      2. <a href="https://github.com/AlexSergey/rockpack/blob/master/packages/ussr/README.md">@rockpack/ussr</a> - <strong>serverRender</strong> method can take a function as its second argument. It will be called
      when an asynchronous operation is detected in order to execute all side effects from the outside. In solutions
      such as Redux, Apollo and other asynzronic operations we perform not at the React level, but, as in this case, at
      the saga level. In this case. we need a tool to wait for them outside.
    </p>

    <Code code={codeServerRenderExample} language="jsx" />

    <p>
      Specifically in this code, we have - render the application, <a href="https://github.com/AlexSergey/rockpack/blob/master/packages/ussr/README.md">@rockpack/ussr</a> understands that in the depths of our code there
      is a side effect, but in this case, it is not asynchronous
    </p>

    <Code code={codeUseUssrExample} language="jsx" />

    <p>
      Therefore, a callback will be called in which we will perform an asynchronous operation at the sag level, since
      this is not part of the React Components
    </p>

    <Code code={codeSagaSolveExample} language="jsx" />

    <p>3. After that, we transfer the resulting state to the client, but we take it from the redux store</p>

    <Code code={codeStateToClientExample} language="jsx" />

    <p>
      In <strong>client.jsx</strong>, we need to change the creation of the store, setting the state that came from
      the backend for synchronization
    </p>

    <Code code={codeClientStateExample} language="jsx" />

    <h3>Conclusion</h3>

    <p>
      We have ported our Redux Application to SSR. In the same way, we can process any asynchronous operations from the
      outside, for example, an Apollo application can be easily transferred to SSR according to this scenario. A
      collection of examples can be found <a href="https://github.com/AlexSergey/rockpack/tree/master/packages/ussr/examples">here</a>.
    </p>
  </div>
);

const page = {
  title: 'SSR part 2. Migration legacy app to SSR',
  url: '/ssr-2-migration-legacy-app-to-ssr',
  menuClassName: 'small-menu-item',
  share: true,
  meta: [
    <meta name="description" content="Rockpack ..." key="description" />
  ],
  component: Page
};

export default page;
