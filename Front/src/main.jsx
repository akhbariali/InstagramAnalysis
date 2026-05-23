import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import MySweetToast from "./Components/Notifications/MySweetToast.jsx";

ReactDOM.createRoot(document.getElementById('root')).render(
    // <React.StrictMode>'
    <>
        <MySweetToast />
        <App/>
    </>

    // </React.StrictMode>
)
