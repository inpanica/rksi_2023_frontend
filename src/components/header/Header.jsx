import { useEffect, useState } from 'react'
import '../../App.css'
import './Header.css'
import { Link } from 'react-router-dom';
import { useContext } from 'react';

function Header({ user, ...props }) {

    return (
        <div className="ctn header-ctn">
            <header className="header">
                {
                    !(user.name === '') &&
                    <>
                        <Link to='/add-task' className="main-text header-link">Добавить задачу</Link>
                        <Link to='/me' className="main-text header-link">Личный кабинет</Link>
                        <Link to='/' className="main-text header-link">Главная</Link>
                    </>
                }
                {
                    (user.name === '') && 
                    <>
                    </>
                }
                {user.isAdmin &&
                    <Link to='/add-user' className="main-text header-link">Добавить пользователей</Link>
                }
            </header>
        </div>
    )
}

export default Header