import React from 'react';
import express from 'express';
import serialize from 'serialize-javascript';
import { App } from './App';
import { serverRender } from '../../../src';

const app = express();

app.use(express.static('public'));

app.get('/*', async (req, res) => {
  const { html, state } = await serverRender({
    render: () => <App />
  });
  res.send(`
  <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <script>
      window.USSR_DATA = ${serialize(state, { isJSON: true })}
    </script>
</head>
<body>
    <div id="root">${html}</div>
    <script src="/index.js"></script>
</body>
</html>

`);
});

app.listen(4000, () => {
  console.log('Example app listening on port 3000!');
});