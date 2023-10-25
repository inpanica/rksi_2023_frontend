import { useEffect, useState } from 'react'
import './App.css'
import Registration from './components/registration/Registration.jsx'
import Authorization from './components/authorization/Authorization.jsx'
import CreateTask from './components/createTask/CreateTask.jsx'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { getUser } from './actions.js'

function App() {

    const [user, setUser] = useState({ 'name': '', 'email': '', isAdmin: false })

    useEffect(() => {
        const onPageLoad = async () => {
            if(localStorage.getItem('access')){
                const response = await getUser()
                if(response.status === 200){
                    setUser({name: response.data.name, email: response.data.email, isAdmin: response.data.is_admin})
                }
            }
        }
        onPageLoad();
    }, [])

    return (
        <BrowserRouter>
            {
                !user.name ? <Routes>
                    <Route path='/login' exact element={<Authorization setUser={setUser}/>} />
                    <Route path='/*' element={<Navigate to='/login' />} />
                </Routes> : <Routes>
                    <Route path='/add-task' element={<CreateTask />} />
                    <Route path='/me'exact element={<CreateTask />} />
                    <Route path='/*' element={<Navigate to='/me' />} />
                    {user.isAdmin && <Route path='/add-user' exact element={<Registration />} />}
                </Routes>
            }
        </BrowserRouter>
    )
}

export default App
