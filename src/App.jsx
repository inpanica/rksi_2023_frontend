import { useEffect, useState } from 'react'
import './App.css'
import Registration from './components/registration/Registration.jsx'
import Authorization from './components/authorization/Authorization.jsx'
import CreateTask from './components/createTask/CreateTask.jsx'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

function App() {

    return (
        <BrowserRouter>
                <Routes>
                    <Route path='/add-user' element={<Registration />} />
                    <Route path='/login' element={<Authorization />} />
                    <Route path='/add-task' element={<CreateTask />} />
                    <Route path='/' exact />
                    <Route path='/*' element={<Navigate to='/' />} />
                </Routes>
        </BrowserRouter>
    )
}

export default App
