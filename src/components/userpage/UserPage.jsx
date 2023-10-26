import { useEffect, useState } from 'react'
import '../../App.css'
import './UserPage.css'
import { Link } from 'react-router-dom'
import { getTasks, changeTask } from '../../actions.js'
import Button from '../button/Button.jsx'
import Input from '../input/Input.jsx'
import Task from '../task/Task.jsx'
import CategoryBox from '../categoryBox/CategoryBox.jsx'
import { config } from '../../config.js'

function UserPage({ user, setUser, ...props }) {

    const [files, setFiles] = useState({})
    const [tasks, setTasks] = useState(Array)
    const [currentTask, setCurrentTask] = useState({})
    const [currentStatus, setCurrentStatus] = useState('')
    const [searchQuery, setSearchQuery] = useState('')
    const [sortType, setSortType] = useState('')

    const logout = () => {
        localStorage.clear()
        setUser({ name: '', email: '', isAdmin: '' })
    }

    const getMyTasks = async () => {
        const response = await getTasks(user.email)
        if (response.status === 200) {
            setTasks(response.data.data)
            setFiles(response.data.files)
        }
    }

    const [color, setColor] = useState('')

    const date = new Date();
    let day = date.getDate();
    day = String(day).split('').length === 2 ? day : '0' + day
    let month = date.getMonth();
    month = String(month).split('').length === 2 ? month : '0' + month
    let year = date.getFullYear();
    const today = `${year}-${month}-${day}`

    const statuses = { 'not_started': 'Не начата', 'in_progress': 'В процессе', 'success': 'Завершена' }

    useEffect(() => {
        if (currentTask.weight < 4) {
            setColor('violet')
        }
        else if (currentTask.weight <= 6) {
            setColor('yellow')
        }
        else {
            setColor('red')
        }
    }, [currentTask])

    useEffect(() => {
        getMyTasks();
    }, [])

    const changeStatus = async () => {
        const st = Object.entries(statuses).filter((a) => {
            return a[1] === currentStatus
        })[0][0]
        const changed = {
            "category": currentTask.category,
            "weight": currentTask.weight,
            "priority": currentTask.priority,
            "end": currentTask.end,
            "begin": currentTask.begin,
            "files": currentTask.files,
            "more_info": currentTask.more_info,
            "description": currentTask.description,
            "name": currentTask.name,
            "task_id": currentTask.id,
            "status": st,
            "when_end": (st === 'success' ? today : '')
        }
        const response = await changeTask(changed);
        if (response.status === 200) {
            setCurrentStatus('');
            setCurrentTask({})
            getMyTasks();
        }
    }

    const filtredTasks = tasks.filter(t => {
        return t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.description.toLowerCase().includes(searchQuery.toLowerCase())
    })

    let sortedTasks = filtredTasks

    if (sortType === 'По весу') {
        sortedTasks = sortedTasks.sort((t1, t2) => {
            return t2.weight - t1.weight
        })
    }
    else if (sortType === 'По дедлайну') {
        sortedTasks = sortedTasks.sort((t1, t2) => {
            return t2.end - t1.end
        })
    }

    return (
        <>
            {
                currentTask.id &&
                <div className={['fullscreen-task', currentTask.id ? 'fullsceen-task-active' : ''].join(' ')}>
                    <div className="ctn">
                        <div className="block-section">
                            <p className="fullscreen-task-name">{currentTask.name}</p>
                            <p className="fullscreen-task-description main-text">{currentTask.description}</p>
                            {
                                currentTask.more_info && <p className="fullscreen-task-name">Комментарии</p>
                            }
                            <p className="fullscreen-task-comments main-text">{currentTask.more_info}</p>
                            <p className="fullscreen-task-category main-text">{'Категория: ' + currentTask.category}</p>
                            <p className="fullscreen-task-weight main-text">Вес:<span className={['fullscreen-task-weight-decorate', 'fullscreen-task-weight-decorate-' + color].join(' ')}>{currentTask.weight}</span></p>
                            <p className="fullscreen-task-priority main-text">{currentTask.priority}</p>
                            <p className="fullscreen-task-time main-text">{currentTask.begin + ' - ' + currentTask.end}</p>
                            <CategoryBox type='status' taskCategory={currentStatus} setTaskCategory={setCurrentStatus} status={statuses[currentTask.status] + ' ' + (currentTask.status === 'success' ? currentTask.when_end : '')} />
                            {files[currentTask.id] && <p className="fullscreen-task-name">Сопутствующие файлы:</p>}
                            {files[currentTask.id].map(f => <div key={f} className='fullscreen-task-file' onClick={() => window.open(config.url + '/' + f)}>{f.replace('static/', '')}</div>)}
                        </div>
                        <div className="fullscreen-task-buttons">
                            <Button onClick={() => setCurrentTask({})} className='button-red'>Назад</Button>
                            <Button onClick={changeStatus} className='button-violet'>Подтвердить</Button>
                        </div>
                    </div>
                </div>
            }
            <div className="ctn">
                <section className='block-section'>
                    <h2 className="h2-title title">{user.name}</h2>
                    <h3 className="h3-title">{user.email}</h3>
                </section>
                <Link to='/' onClick={logout} className='main-text logout-btn'>Выйти</Link>
                <Button onClick={getMyTasks} className='button-violet reload-button'>Обновить список задач</Button>
                <div className="sort-block block-section">
                    <Input className='search-input' changeValueFun={(e) => setSearchQuery(e.target.value)} inputValue={searchQuery} placeholder='Поиск...' />
                    <CategoryBox taskCategory={sortType} setTaskCategory={setSortType} type={'sort'} />
                </div>
                <div className='user-task-wrapper'>
                    {sortedTasks.map(t =>
                        <Task handleClick={() => setCurrentTask(t)} key={t.id} task={t} />
                    )}
                </div>
            </div>
        </>
    )
}

export default UserPage