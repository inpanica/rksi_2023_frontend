import { useEffect, useState } from 'react'
import '../../App.css'
import './CreateTask.css'
import Input from '../input/Input.jsx'
import Button from '../button/Button.jsx'
import CategoryBox from '../categoryBox/CategoryBox.jsx'
import Range from '../range/Range.jsx'
import { getAllUsers } from '../../actions.js'
import FullScreenWindow from '../fullscreenwindow/FullScreenWindow.jsx'
import { sendTask, sendFile } from '../../actions.js'

function CreateTask() {
    const [taskTitle, setTaskTitle] = useState('')
    const [taskDescription, setTaskDecrtiption] = useState('')
    const [taskComment, setTaskComment] = useState('')
    const [taskCategory, setTaskCategory] = useState('')
    const [taskPriority, setTaskPriority] = useState('')
    const [taskWeight, setTaskWeight] = useState(1)
    const [startTime, setStartTime] = useState('')
    const [endTime, setEndTime] = useState('')

    const [fullScreenWindowActive, setFullScreenWindowActive] = useState(false);
    const [acceptedUsers, setAcceptedUsers] = useState([])
    const [users, setUsers] = useState([])

    const [buttonEnabled, setButtonEnabled] = useState(false);

    const [files, setFiles] = useState([])

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

    const sendFiles = async (id) => {
        const idSt = id.join(' ')
        const formData = new FormData();
        let filesArr = files[0]

        formData.append('file', filesArr)
        const response = await sendFile(idSt, formData);
        return response
    }

    const uploadTask = async () => {
        if (!buttonEnabled) {
            const requiredList = [!taskTitle ? 'название\n' : '',
            !taskDescription ? 'описание\n' : '',
            !taskCategory ? 'категория\n' : '',
            !taskPriority ? 'приоритет\n' : '',
            !acceptedUsers[0] ? 'исполнители\n' : '',
            !startTime ? 'дата начала\n' : '',
            !endTime ? 'дата конца\n' : ''].join('')
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
                "begin": startTime,
                "end": endTime,
                "when_end": ".",
                "status": "not_started",
                "priority": taskPriority,
                "weight": taskWeight,
                "category": taskCategory,
                "users": sendUsers
            }
            const response = await sendTask(task)
            if (response.status === 200) {
                const r = sendFiles(response.data)
                setEndTime('')
                setStartTime('')
                setTaskTitle('')
                setTaskDecrtiption('')
                setTaskWeight(1)
                setTaskComment('')
                setAcceptedUsers([])
                setTaskCategory('')
                setTaskPriority('')
            }
        }
    }

    useEffect(() => {
        if (!taskTitle || !taskDescription || !taskCategory || !acceptedUsers[0] || !taskPriority || !startTime || !endTime) {
            setButtonEnabled(false);
        }
        else {
            setButtonEnabled(true);
        }
    }, [taskTitle, taskDescription, taskCategory, acceptedUsers, taskPriority, endTime, startTime])

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
                    <h3 className="h3-title align-center">Дата начала</h3>
                    <Input changeValueFun={(e) => setStartTime(e.target.value)} inputValue={startTime} type='date'></Input>
                    <h3 className="h3-title align-center">Дата конца</h3>
                    <Input changeValueFun={(e) => setEndTime(e.target.value)} inputValue={endTime} type='date'></Input>
                    <h3 className="h3-title align-center">Прикрепить файлы</h3>
                    <Input changeValueFun={(e) => setFiles(e.target.files)} type="file" files={files} />
                    <Button onClick={uploadTask} className={["button-red", !buttonEnabled ? 'button-disabled' : ''].join(' ')}>Создать</Button>
                </section>
            </div>
        </>
    )
}

export default CreateTask