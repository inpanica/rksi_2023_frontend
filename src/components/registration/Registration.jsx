import { useEffect, useState } from 'react'
import '../../App.css'
import './Registration.css'
import Button from '../button/Button.jsx'
import Input from '../input/Input.jsx'
import { registration, sendEmail} from '../../actions.js'

function Registration() {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isAdmin, setIsAdmin] = useState(false)

    const [buttonEnabled, setButtonEnabled] = useState(false)

    const sendForm = async () => {
        const response = await registration(email, name, password, isAdmin);
        if (response.status === 201) {
            setName('');
            setEmail('');
            setPassword('');
            // const responseEmail = sendEmail(response.data.email);
        }
    }

    useEffect(() => {
        if(!name || !email || !password || !email.includes('@') || password.length < 8){
            setButtonEnabled(false)
        }
        else{
            setButtonEnabled(true)
        }
    }, [name, email, password])

    return (
        <div className="ctn">
            <section className='block-section form-section'>
                <h2 className="h2-title align-center">Добавить пользователя</h2>
                <Input changeValueFun={(e) => setName(e.target.value)} inputValue={name} placeholder="Имя"></Input>
                <Input changeValueFun={(e) => setEmail(e.target.value)} inputValue={email} placeholder="Почта"></Input>
                <Input changeValueFun={(e) => setPassword(e.target.value)} inputValue={password} placeholder="Пароль"></Input>
                <div className="input-with-label">
                    <label className='main-text' htmlFor="admin-checkbox">Сделать администратором</label>
                    <Input changeValueFun={(e) => setIsAdmin(e.target.checked)} inputValue={isAdmin} type="checkbox" id="admin-checkbox"></Input>
                </div>
                <Button disabled={!buttonEnabled} onClick={sendForm} className="button-red">Создать</Button>
            </section>
        </div>
    )
}

export default Registration