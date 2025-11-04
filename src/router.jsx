import React from 'react'
import { Router, Routes } from 'react-router-dom';

function Approuter(){
    return(
        <>
        <Router>
            <Navbar/>
            <div className=''>
            <Routes></Routes>
            </div>
        </Router>
        </>
    );
}
export default Approuter
