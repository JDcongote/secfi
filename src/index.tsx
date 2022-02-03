import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import App from './app/app';
import Header from '@components/header/header';
import GlobalStyle from '@styles/globalStyles';
import FontStyle from '@styles/fonts';

ReactDOM.render(
  <React.Fragment>
    <GlobalStyle></GlobalStyle>
    <FontStyle></FontStyle>
    <BrowserRouter>
      <Header title="Currency Exchange" />
      <App />
    </BrowserRouter>
  </React.Fragment>,
  document.getElementById('root')
);
