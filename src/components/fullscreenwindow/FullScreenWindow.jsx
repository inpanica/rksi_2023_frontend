import { useEffect, useState } from 'react'
import '../../App.css'
import './FullScreenWindow.css'
import Button from '../button/Button.jsx'
import { getAllUsers } from '../../actions.js'
import Input from '../input/Input.jsx'

function FullScreenWindow({setFullScreenWindowActive, fullScreenWindowActive, users, setAcceptedUsers, acceptedUsers, ...props}) {

    const [choosenUsers, setChoosenUsers] = useState([])
    const [searchQuery, setSearchQuery] = useState('')

    const addChoosenUser = (name, email) => {
        const userAdded = choosenUsers.find((u) => {
            if (u['email'] === email) {
                return u
            }
        })
        if (!userAdded) {
            setChoosenUsers([...choosenUsers, { 'name': name, 'email': email }])
        }
    }

    const removeChoosenUser = (email) => {
        const userAdded = choosenUsers.find((u) => {
            if (u['email'] === email) {
                return u
            }
        })
        setChoosenUsers(choosenUsers.filter((u) => {
            if (u !== userAdded) {
                return u
            }
        }))
    }

    const AcceptUsers = () => {
        setFullScreenWindowActive(false);
        setAcceptedUsers(choosenUsers);
    }

    const filteredUsers = users.filter(u => {
        return u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase())
    })

    useEffect(() => {
        setChoosenUsers(acceptedUsers);
    },[acceptedUsers])

    return (
        <>
            <div className={["fullsceen-window", fullScreenWindowActive ? 'fullsceen-window-active' : ''].join(' ')}>
                <div className="ctn">
                    <section className='block-section form-section'>
                        <h2 className="h2-title align-center">Выберите исполнителей</h2>
                        <Input inputValue={searchQuery} changeValueFun={(e) => setSearchQuery(e.target.value)} placeholder='Поиск...'/>
                        <div className="users-choose">
                            {
                                filteredUsers.map(u =>
                                    <div key={u.email} className={['user', 'user-added'].join(' ')} onClick={() => addChoosenUser(u.name, u.email)}>
                                        <p className='main-text user-username'>{u.name}</p>
                                        <p className='main-text user-email'>{u.email}</p>
                                    </div>)
                            }
                            {filteredUsers[0] ? '' : 'Пользователи не найдены...'}
                        </div>
                        <h2 className="h2-title align-center">Выбранные исполнители</h2>
                        <div className="users-choose">
                            {
                                choosenUsers.map(u =>
                                    <div key={u.email} className='user' onClick={() => removeChoosenUser(u.email)}>
                                        <p className='main-text user-username'>{u.name}</p>
                                        <p className='main-text user-email'>{u.email}</p>
                                    </div>)
                            }
                        </div>
                    </section>
                    <div className="users-choose-buttons">
                        <Button onClick={() => setFullScreenWindowActive(false)} className="button-red">Назад</Button>
                        <Button onClick={AcceptUsers} className="button-violet">Подтвердить</Button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default FullScreenWindow