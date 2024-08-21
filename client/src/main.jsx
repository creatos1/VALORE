import React from 'react'
import ReactDOM from 'react-dom/client'
import { PointOfSaleApp } from './PointOfSaleApp'
import './assets/css/app.css';

import { Provider } from 'react-redux';
import { store } from './app/store'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <PointOfSaleApp />
    </Provider>
  </React.StrictMode>,
)
