import { useEffect, useState } from 'react'
import '../../App.css'
import './CreateTask.css'
import Input from '../input/Input.jsx'
import Button from '../button/Button.jsx'
import CategoryBox from '../categoryBox/CategoryBox.jsx'
import Range from '../range/Range.jsx'
import { getAllUsers } from '../../actions.js'
import FullScreenWindow from '../fullscreenwindow/FullScreenWindow.jsx'
import { sendTask } from '../../actions.js'

function CreateTask() {
    const [taskTitle, setTaskTitle] = useState('')
    const [taskDescription, setTaskDecrtiption] = useState('')
    const [taskComment, setTaskComment] = useState('')
    const [taskCategory, setTaskCategory] = useState('')
    const [taskPriority, setTaskPriority] = useState('')
    const [taskWeight, setTaskWeight] = useState(1)

    const [fullScreenWindowActive, setFullScreenWindowActive] = useState(false);
    const [acceptedUsers, setAcceptedUsers] = useState([])
    const [users, setUsers] = useState([])

    const [buttonEnabled, setButtonEnabled] = useState(false);

    const assignUsers = async () => {
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
            setUsers(newArray)
        }
        setFullScreenWindowActive(true);
    }

    const uploadTask = async () => {
        if (!buttonEnabled) {
            const requiredList = [!taskTitle ? 'название\n' : '',
            !taskDescription ? 'описание\n' : '',
            !taskCategory ? 'категория\n' : '',
            !taskPriority ? 'приоритет\n' : '',
            !acceptedUsers[0] ? 'исполнители\n' : ''].join('')
            alert('Следующие поля должны быть заполнены: \n' + requiredList)
        }
        else {
            const sendUsers = acceptedUsers.map(u => {
                return u.email
            }).join(' ')
            const task = {
                "name": taskTitle,
                "description": taskDescription,
                "more_info": taskComment,
                "files": 0,
                "begin": "2023-10-25T15:55:12.949",
                "end": "2023-10-25T15:55:12.949",
                "when_end": "",
                "status": "",
                "priority": taskPriority,
                "weight": taskWeight,
                "category": taskCategory,
                "users": sendUsers
            }
            const response = await sendTask(task)
            if (response.status === 200) {
                setTaskTitle('')
                setTaskDecrtiption('')
                setTaskComment('')
                setAcceptedUsers([])
                setTaskCategory('')
                setTaskPriority(1)
            }
        }
    }

    useEffect(() => {
        if (!taskTitle || !taskDescription || !taskCategory || !acceptedUsers[0] || !taskPriority) {
            setButtonEnabled(false);
        }
        else {
            setButtonEnabled(true);
        }
    }, [taskTitle, taskDescription, taskCategory, acceptedUsers, taskPriority])

    return (
        <>
            <FullScreenWindow setFullScreenWindowActive={setFullScreenWindowActive} fullScreenWindowActive={fullScreenWindowActive} users={users} acceptedUsers={acceptedUsers} setAcceptedUsers={setAcceptedUsers} />
            <div className="ctn">
                <section className='block-section form-section'>
                    <h2 className="h2-title align-center">Добавить задачу</h2>
                    <Input changeValueFun={(e) => setTaskTitle(e.target.value)} inputValue={taskTitle} placeholder="Название"></Input>
                    <Input changeValueFun={(e) => setTaskDecrtiption(e.target.value)} inputValue={taskDescription} placeholder="Описание" type='textarea'></Input>
                    <Input changeValueFun={(e) => setTaskComment(e.target.value)} inputValue={taskComment} placeholder="Комментарии (не обязательно)" type='textarea'></Input>
                    <CategoryBox type='categories' setTaskCategory={setTaskCategory} taskCategory={taskCategory} />
                    <CategoryBox setTaskCategory={setTaskPriority} taskCategory={taskPriority} />
                    <h3 className="h3-title align-center">Вес задачи</h3>
                    <Range setTaskPriority={setTaskWeight} taskPriority={taskWeight} />
                    <Button onClick={assignUsers} className="button-yellow">{'Назначить исполнителей'}</Button>
                    {acceptedUsers.length > 0 &&
                        <div className="accepted-users">
                            {
                                acceptedUsers.map(u =>
                                    <div key={u.email} className='accepted-user'>
                                        <p className='h2-title accepted-user-username'>{u.name}</p>
                                        <p className='main-text accepted-user-email'>{u.email}</p>
                                    </div>)
                            }
                        </div>}
                    <Input changeValueFun={(e) => console.log(e)} type="file" multiple />
                    <Button onClick={uploadTask} className={["button-red", !buttonEnabled ? 'button-disabled' : ''].join(' ')}>Создать</Button>
                </section>
            </div>
        </>
    )
}

export default CreateTask