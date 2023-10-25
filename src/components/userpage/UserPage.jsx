import { useEffect, useState } from 'react'
import '../../App.css'
import './UserPage.css'
import { Link } from 'react-router-dom'

function UserPage({user, setUser, ...props}) {

    const logout = () => {
        localStorage.clear()
        setUser({name: '', email: '', isAdmin: ''})
    }

    return (
        <>
            <div className="ctn">
                <section className='block-section'>
                    <h2 className="h2-title title">{user.name}</h2>
                    <h3 className="h3-title">{user.email}</h3>
                </section>
                <Link to='/' onClick={logout} className='main-text logout-btn'>Выйти</Link>
            </div>
        </>
    )
}

export default UserPage