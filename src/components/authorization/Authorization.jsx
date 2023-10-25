import { useState } from 'react'
import '../../App.css'
import './Authorization.css'
import Button from '../button/Button.jsx'
import Input from '../input/Input.jsx'

function Authorization() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    return (
        <div className="ctn">
            <section className='block-section form-section'>
                <h2 className="h2-title align-center">Вход</h2>
                <Input changeValueFun={(e) => setEmail(e.target.value)} inputValue={email} placeholder="Почта"></Input>
                <Input changeValueFun={(e) => setPassword(e.target.value)} inputValue={password} placeholder="Пароль"></Input>
                <Button className="button-red">Войти</Button>
            </section>
        </div>
    )
}

export default Authorization