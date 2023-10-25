import { useEffect, useState } from 'react'
import '../../App.css'
import './Authorization.css'
import Button from '../button/Button.jsx'
import Input from '../input/Input.jsx'
import { authorization, getUser } from '../../actions.js'

function Authorization({setUser, ...props}) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [buttonEnabled, setButtonEnabled] = useState(false)

    const auth = async () => {
        if (!buttonEnabled) {
            const requiredList = [!email ? 'почта\n' : '',
            !password ? 'пароль\n' : ''].join('')
            alert('Следующие поля должны быть заполнены: \n' + requiredList)
        }
        else {
        }
        const response = await authorization(email, password);
        if (response.status === 200) {
            localStorage.setItem('access', response.data.access_token)
            setEmail('')
            setPassword('')
            const userResponse = await getUser()
            if(userResponse.status === 200){
                setUser({name: userResponse.data.name, email: userResponse.data.email, isAdmin: userResponse.data.is_admin})
            }
        }
    }

    useEffect(() => {
        if (!email || !password || !email.includes('@')) {
            setButtonEnabled(false)
        }
        else {
            setButtonEnabled(true)
        }
    }, [email, password])

    return (
        <div className="ctn">
            <section className='block-section form-section'>
                <h2 className="h2-title align-center">Вход</h2>
                <Input changeValueFun={(e) => setEmail(e.target.value)} inputValue={email} placeholder="Почта"></Input>
                <Input changeValueFun={(e) => setPassword(e.target.value)} inputValue={password} placeholder="Пароль"></Input>
                <Button onClick={auth} className={["button-red", !buttonEnabled ? 'button-disabled' : ''].join(' ')}>Войти</Button>
            </section>
        </div>
    )
}

export default Authorization