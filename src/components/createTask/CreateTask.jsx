import { useEffect, useState } from 'react'
import '../../App.css'
import './CreateTask.css'
import Input from '../input/Input.jsx'
import Button from '../button/Button.jsx'
import CategoryBox from '../categoryBox/CategoryBox.jsx'
import Range from '../range/Range.jsx'

function CreateTask() {
    const [taskTitle, setTaskTitle] = useState('')
    const [taskDescription, setTaskDecrtiption] = useState('')
    const [taskComment, setTaskComment] = useState('')

    const [fullScreenWindowActive, setFullScreenWindowActive] = useState(false);

    return (
        <>
            <div className={["fullsceen-window", fullScreenWindowActive ? 'fullsceen-window-active' : ''].join(' ')}>
                <div className="ctn">
                    <section className='block-section form-section'>
                        <h2 className="h2-title">Выберите исполнителей</h2>
                    </section>
                    <Button onClick={() => setFullScreenWindowActive(false)} className="button-red">Назад</Button>
                </div>
            </div>
            <div className="ctn">
                <section className='block-section form-section'>
                    <h2 className="h2-title align-center">Добавить задачу</h2>
                    <Input changeValueFun={(e) => setTaskTitle(e.target.value)} inputValue={taskTitle} placeholder="Название"></Input>
                    <Input changeValueFun={(e) => setTaskDecrtiption(e.target.value)} inputValue={taskDescription} placeholder="Описание" type='textarea'></Input>
                    <Input changeValueFun={(e) => setTaskComment(e.target.value)} inputValue={taskComment} placeholder="Комментарии (не обязательно)" type='textarea'></Input>
                    <CategoryBox />
                    <h3 className="h3-title align-center">Приоритет выполнения</h3>
                    <Range />
                    <Button onClick={() => setFullScreenWindowActive(true)} className="button-yellow">Добавить исполнителей</Button>
                    <Input type="file" multiple />
                    <Button className="button-red">Создать</Button>
                </section>
            </div>
        </>
    )
}

export default CreateTask