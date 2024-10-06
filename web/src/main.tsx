import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import 'src/styles/reset.css'
import 'src/styles/app.css'
import { configureCognito } from "src/pages/auth/fetchConfigs.ts";
import "./i18n/config.ts";

configureCognito().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <React.Suspense fallback={<div>Loading...</div>}>
          <App/>
      </React.Suspense>
    </React.StrictMode>,
  )
});
