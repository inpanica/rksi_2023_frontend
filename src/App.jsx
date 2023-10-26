import { useEffect, useState } from 'react'
import './App.css'
import Registration from './components/registration/Registration.jsx'
import Authorization from './components/authorization/Authorization.jsx'
import CreateTask from './components/createTask/CreateTask.jsx'
import UserPage from './components/userpage/UserPage.jsx'
import Header from './components/header/Header'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { getUser } from './actions.js'
import AllTasks from './components/alltasks/AllTasks.jsx'

function App() {

    const [user, setUser] = useState({ 'name': '', 'email': '', isAdmin: false })

    useEffect(() => {
        const onPageLoad = async () => {
            if (localStorage.getItem('access')) {
                const response = await getUser()
                if (response.status === 200) {
                    setUser({ name: response.data.name, email: response.data.email, isAdmin: response.data.is_admin })
                }
            }
        }
        onPageLoad();
    }, [])

    return (
        <>
            <BrowserRouter>
                <Header user={user} />
                {
                    (user.name !== '') &&
                    <Routes>
                        {user.isAdmin &&
                            <>
                                <Route path='/add-user' element={<Registration user={user}/>} />
                            </>
                        }
                        <Route path='/add-task' element={<CreateTask />} />
                        <Route path='/all-tasks' element={<AllTasks />} />
                        <Route path='/me' exact element={<UserPage user={user} setUser={setUser} />} />
                        <Route path='/*' element={<Navigate to='/me' />} />
                    </Routes>
                }
                {
                    !(user.name !== '') &&
                    <Routes>
                        <Route path='/login' exact element={<Authorization setUser={setUser} />} />
                        <Route path='/*' element={<Navigate to='/login' />} />
                    </Routes>
                }
                <footer className='footer'></footer>
            </BrowserRouter>
        </>
    )
}

export default App
