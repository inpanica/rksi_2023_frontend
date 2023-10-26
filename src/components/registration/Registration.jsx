import { useEffect, useState } from 'react'
import '../../App.css'
import './Registration.css'
import Button from '../button/Button.jsx'
import Input from '../input/Input.jsx'
import { registration, sendEmail, deleteUser, getAllUsers } from '../../actions.js'

function Registration({ user, ...props }) {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isAdmin, setIsAdmin] = useState(false)

    const [allUsers, setAllUsers] = useState([])

    const [deleteEmail, setDeleteEmail] = useState('')

    const [buttonEnabled, setButtonEnabled] = useState(false)
    const [delButtonEnabled, setDelButtonEnabled] = useState(false)

    const sendForm = async () => {
        if (!buttonEnabled) {
            const requiredList = [!email ? 'почта\n' : '',
            !password ? 'пароль\n' : '',
            ].join('')
            alert('Следующие поля должны быть заполнены: \n' + requiredList)
        }
        const response = await registration(email, name, password, isAdmin);
        if (response.status === 201) {
            setName('');
            setEmail('');
            setPassword('');
            getUsers();
            // const responseEmail = await sendEmail(response.data.email, password);
        }
    }

    useEffect(() => {
        if (!name || !email || !password || !email.includes('@') || password.length < 8) {
            setButtonEnabled(false)
        }
        else {
            setButtonEnabled(true)
        }
    }, [name, email, password])

    useEffect(() => {
        if (!deleteEmail || !deleteEmail.includes('@')) {
            setDelButtonEnabled(false)
        }
        else {
            setDelButtonEnabled(true)
        }
    }, [deleteEmail])

    const deleteByEmail = async () => {
        const resposnse = await deleteUser(deleteEmail);
        setDeleteEmail('');
        getUsers();
    }

    const getUsers = async () => {
        const response = await getAllUsers();
        if (response.status === 200) {
            let newArray = [];
            for (var key in response.data) {
                if (response.data.hasOwnProperty(key)) {
                    var newObj = {};
                    newObj["name"] = key;
                    newObj["email"] = response.data[key];
                    newArray.push(newObj);
                }
            }
            setAllUsers(newArray)
        }
    }

    useEffect(() => {
        getUsers();
    }, [])

    const changeCurrentUser = (u) => {
        if (deleteEmail === u.email) {
            setDeleteEmail('')
        }
        else {
            setDeleteEmail(u.email)
        }
    }

    return (
        <div className="ctn">
            <section className='block-section form-section admin-section'>
                <h2 className="h2-title align-center">Добавить пользователя</h2>
                <Input changeValueFun={(e) => setName(e.target.value)} inputValue={name} placeholder="Имя"></Input>
                <Input changeValueFun={(e) => setEmail(e.target.value)} inputValue={email} placeholder="Почта"></Input>
                <Input changeValueFun={(e) => setPassword(e.target.value)} inputValue={password} placeholder="Пароль"></Input>
                <div className="input-with-label">
                    <label className='main-text' htmlFor="admin-checkbox">Сделать администратором</label>
                    <Input changeValueFun={(e) => setIsAdmin(e.target.checked)} inputValue={isAdmin} type="checkbox" id="admin-checkbox"></Input>
                </div>
                <Button onClick={sendForm} className={["button-red", !buttonEnabled ? 'button-disabled' : ''].join(' ')}>Создать</Button>
            </section>
            <h2 className="h2-title align-center reg-users-title">Все пользователи</h2>
            <div>
                {

                    allUsers.map(u =>
                        <div onClick={() => changeCurrentUser(u)} key={u.email} className={['all-users-user reg-users-user', u.email === deleteEmail ? 'all-users-user-active' : ''].join(' ')}>
                            <div className="reg-user-info">
                                <div className="all-users-user-name reg-name">
                                    {u.name}
                                </div>
                                <div className="all-users-user-email">
                                    {u.email}
                                </div>
                            </div>
                            {
                                (u.email === deleteEmail && allUsers.length > 1 && user.email !== u.email) && <Button onClick={deleteByEmail} className={["button-red", !delButtonEnabled ? 'button-disabled' : ''].join(' ')}>Удалить</Button>

                            }
                            {
                                (u.email === user.email && u.email === deleteEmail) && <p className='main-text warning'>Вы не можете удалить свой аккаунт</p>
                            }
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default Registration