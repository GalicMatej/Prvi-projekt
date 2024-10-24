import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Auth0Provider } from '@auth0/auth0-react';

const domain = process.env.REACT_APP_AUTH0_DOMAIN;
const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;
// console.log(domain)
// console.log(clientId)

const root = ReactDOM.createRoot(document.getElementById('root'));
// console.log(window.location)
root.render(
  <React.StrictMode>
    <Auth0Provider domain={domain} clientId={clientId} authorizationParams={{ redirect_uri: window.location.origin + "/user"}}>
      <App />
    </Auth0Provider>
  </React.StrictMode>
);

// 'http://localhost:3001/user'
// window.location.origin + "/user/callback"