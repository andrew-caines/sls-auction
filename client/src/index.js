import { Auth0Provider } from "@auth0/auth0-react";
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import './index.css';
import 'react-toastify/dist/ReactToastify.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import axios from 'axios';
import { GlobalStateProvider } from './GlobalState';

axios.defaults.baseURL = "https://59ri3t8ope.execute-api.ca-central-1.amazonaws.com/dev/"; //Hard coded for 'dev mode' which will be ok, as this is never going produciton.
/*
axios.interceptors.response.use((response) => {
  console.log(JSON.stringify(response));
  return response;
});
*/
const root = ReactDOM.createRoot(document.getElementById('root'));
//Remvoing for now.<React.StrictMode>  </React.StrictMode>
root.render(

  <Auth0Provider
    domain="sls-acaines.us.auth0.com"
    clientId="YSyHOYckB4xjbo6uxyqopWK8I16GdFFh"
    redirectUri={window.location.origin}
  >
    <GlobalStateProvider>
      <BrowserRouter>
          <App />

      </BrowserRouter>
    </GlobalStateProvider>
  </Auth0Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
