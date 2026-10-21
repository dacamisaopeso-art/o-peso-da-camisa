import React, {useEffect, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {MotionConfig} from 'framer-motion';
import App from './App';
import './styles.css';
const reduced = () => !!(window as Window & {OPC_PREFS?: {reducedMotion: () => boolean}}).OPC_PREFS?.reducedMotion();
function Preferences(){const [reduce,setReduce]=useState(reduced);useEffect(()=>{const update=()=>setReduce(reduced());window.addEventListener('opc-preferences',update);return()=>window.removeEventListener('opc-preferences',update);},[]);return <MotionConfig reducedMotion={reduce?'always':'user'}><App/></MotionConfig>;}
createRoot(document.getElementById('root')!).render(<React.StrictMode><Preferences/></React.StrictMode>);
