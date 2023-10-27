import { useEffect, useState } from 'react'
import '../../App.css'
import './AllTasks.css'
import { changeTask, getAllTasks, deleteTask, getAllUsers, getTasks, getStatistic } from '../../actions.js'
import Button from '../button/Button.jsx'
import Input from '../input/Input.jsx'
import Task from '../task/Task.jsx'
import CategoryBox from '../categoryBox/CategoryBox.jsx'
import { config } from '../../config.js'
import Range from '../range/Range.jsx'

function AllTasks({ user, setUser, ...props }) {

    const [files, setFiles] = useState({})
    const [tasks, setTasks] = useState(Array)
    const [currentUsersTasks, setCurrentUsersTasks] = useState(Array)
    const [currentUsersFiles, setCurrentUsersFiles] = useState({})
    const [currentTask, setCurrentTask] = useState({})
    const [currentTaskChanged, setCurrentTaskChanged] = useState({})
    const [currentStatus, setCurrentStatus] = useState('')
    const [currentUser, setCurrentUser] = useState({})
    const [searchQuery, setSearchQuery] = useState('')
    const [sortType, setSortType] = useState('')
    const [users, setUsers] = useState([])
    const [allUsersMenuActive, setAllUsersMenuActive] = useState(true)
    const [stats, setStats] = useState({})

    const getAllUsersTasks = async () => {
        const response = await getAllTasks()
        if (response.status === 200) {
            setTasks(response.data.data)
            setFiles(response.data.files)
        }
        const responsStats = await getStatistic()
        if(responsStats.status === 200){
            setStats(responsStats.data);
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
        setCurrentTaskChanged(currentTask)
    }, [currentTask])

    useEffect(() => {
        const onLoad = async () => {
            getAllUsersTasks();
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
        }
        onLoad();
    }, [])

    useEffect(() => {
        const onCurrentUserChange = async () => {
            if (currentUser.email) {
                const response = await getTasks(currentUser.email)
                setCurrentUsersTasks(response.data.data)
                setCurrentUsersFiles(response.data.files)
            }
            else {
                setCurrentUsersTasks([])
                setCurrentUsersFiles({})
            }
        }
        onCurrentUserChange();
    }, [currentUser])

    const changeCurrentTask = async () => {
        const changed = {
            "category": currentTaskChanged.category,
            "weight": currentTaskChanged.weight,
            "priority": currentTaskChanged.priority,
            "end": currentTaskChanged.end,
            "begin": currentTaskChanged.begin,
            "more_info": currentTaskChanged.more_info,
            "description": currentTaskChanged.description,
            "name": currentTaskChanged.name,
            "task_id": currentTask.id,
            "status": currentTaskChanged.status,
            "when_end": currentTaskChanged.when_end
        }
        const response = await changeTask(changed);
        if (response.status === 200) {
            setCurrentStatus('');
            setCurrentTask({})
            getAllUsersTasks();
            setCurrentUser(currentUser)
        }
    }

    const filtredTasks = tasks.filter(t => {
        return t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.description.toLowerCase().includes(searchQuery.toLowerCase())
    })

    const filtredUsersTasks = currentUsersTasks.filter(t => {
        return t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.description.toLowerCase().includes(searchQuery.toLowerCase())
    })

    let sortedTasks = currentUser.email ? filtredUsersTasks : filtredTasks

    useEffect(() => {
        sortedTasks = currentUser.email ? filtredUsersTasks : filtredTasks
    }, [currentUser])

    if (sortType === 'По весу') {
        sortedTasks = sortedTasks.sort((t1, t2) => {
            return t2.weight - t1.weight
        })
    }
    else{
        sortedTasks = sortedTasks
    }

    const deleteCurrentTask = async () => {
        const response = await deleteTask(currentTask.id);
        if (response.status === 200) {
            setCurrentTask('')
            getAllUsersTasks();
        }
    }

    const changeCurrentUser = (u) => {
        if (currentUser !== u) {
            setCurrentUser(u)
        }
        else {
            setCurrentUser({})
        }
    }

    return (
        <>
            {
                currentTask.id &&
                <div className={['fullscreen-task', currentTask.id ? 'fullsceen-task-active' : ''].join(' ')}>
                    <div className="ctn">
                        <div className="block-section change-task">
                            <h2 className="h2-title change-task-h2 align-center">Изменить задачу для {currentTask.users}</h2>
                            <Input changeValueFun={(e) => setCurrentTaskChanged({ ...currentTaskChanged, 'name': e.target.value })} inputValue={currentTaskChanged.name} placeholder="Название"></Input>
                            <Input changeValueFun={(e) => setCurrentTaskChanged({ ...currentTaskChanged, 'description': e.target.value })} inputValue={currentTaskChanged.description} placeholder="Описание" type='textarea'></Input>
                            <Input changeValueFun={(e) => setCurrentTaskChanged({ ...currentTaskChanged, 'more_info': e.target.value })} inputValue={currentTaskChanged.more_info} placeholder="Комментарии (не обязательно)" type='textarea'></Input>
                            <CategoryBox type='categories' setTaskCategory={(c) => setCurrentTaskChanged({ ...currentTaskChanged, 'category': c })} taskCategory={currentTaskChanged.category} />
                            <CategoryBox setTaskCategory={(c) => setCurrentTaskChanged({ ...currentTaskChanged, 'priority': c })} taskCategory={currentTaskChanged.priority} />
                            <h3 className="h3-title align-center">Вес задачи</h3>
                            <Range setTaskPriority={(e) => setCurrentTaskChanged({ ...currentTaskChanged, 'weight': e })} taskPriority={currentTaskChanged.weight} />
                            <h3 className="h3-title align-center">Дата начала</h3>
                            <Input changeValueFun={(e) => setCurrentTaskChanged({ ...currentTaskChanged, 'begin': e.target.value })} inputValue={currentTaskChanged.begin} type='date'></Input>
                            <h3 className="h3-title align-center">Дата конца</h3>
                            <CategoryBox type='status' taskCategory={currentStatus} setTaskCategory={setCurrentStatus} status={statuses[currentTask.status] + ' ' + (currentTask.status === 'success' ? currentTask.when_end : '')} />
                            <Input changeValueFun={(e) => setCurrentTaskChanged({ ...currentTaskChanged, 'end': e.target.value })} inputValue={currentTaskChanged.end} type='date'></Input>
                            {
                                currentUser.email ?
                                    <>
                                        {currentUsersFiles[currentTask.id][0] ? <p className="fullscreen-task-name">Сопутствующие файлы:</p> : ''}
                                        {currentUsersFiles[currentTask.id].map(f => <div key={f} className='fullscreen-task-file' onClick={() => window.open(config.url + '/' + f)}>{f.replace('static/', '')}</div>)}
                                    </> :
                                    <>
                                        {files[currentTask.id][0] ? <p className="fullscreen-task-name">Сопутствующие файлы:</p> : ''}
                                        {files[currentTask.id].map(f => <div key={f} className='fullscreen-task-file' onClick={() => window.open(config.url + '/' + f)}>{f.replace('static/', '')}</div>)}
                                    </>
                            }

                        </div>
                        <div className="fullscreen-task-buttons">
                            <Button onClick={() => setCurrentTask({})} className='button-red'>Назад</Button>
                            <Button onClick={changeCurrentTask} className='button-violet'>Сохранить изменения</Button>
                            <Button onClick={deleteCurrentTask} className='button-red'>Удалить задачу</Button>
                        </div>
                    </div>
                </div>
            }
            {
                !allUsersMenuActive &&
                <Button onClick={() => setAllUsersMenuActive(true)} className='button-yellow all-users-open-btn'>+</Button>
            }
            <div className={['all-users', allUsersMenuActive ? 'all-users-active' : ''].join(' ')}>
                <Button onClick={() => setAllUsersMenuActive(false)} className='button-red all-users-close-btn'>X</Button>
                <div className="all-useres-users">
                    {
                        users.map(u =>
                            <div onClick={() => changeCurrentUser(u)} key={u.email} className={['all-users-user', currentUser.email === u.email ? 'all-users-user-active' : ''].join(' ')}>
                                <div className="all-users-user-name">
                                    {u.name}
                                </div>
                                <div className="all-users-user-email">
                                    {u.email}
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
            <div className="ctn ">
                {
                    stats && <div className='statistic block-section'>
                        <div className="stats-status">
                            <p className="stats-status-line">{'Всего задач: ' + stats.count}</p>
                            <p className="stats-status-line">{'Завершенных: ' + stats.success}</p>
                            <p className="stats-status-line">{'Не начатых: ' + stats.not_started}</p>
                            <p className="stats-status-line">{'Выполняются: ' + stats.in_progress}</p>
                            <p className="stats-status-line">{'Средний вес задач: ' + stats.average_weight}</p>
                            <p className="stats-status-line">{'Самая частая категория: ' + stats.most_common_category}</p>
                        </div>
                    </div>
                }
                {/* <Button onClick={getAllUsersTasks} className='button-violet reload-button'>Обновить список задач</Button> */}
                <div className="sort-block block-section">
                    <Input className='search-input' changeValueFun={(e) => setSearchQuery(e.target.value)} inputValue={searchQuery} placeholder='Поиск...' />
                    <CategoryBox taskCategory={sortType} setTaskCategory={setSortType} type={'sort'} />
                </div>
                <div className='user-task-wrapper'>
                    {sortedTasks.map(t =>
                        <Task handleClick={() => setCurrentTask(t)} key={t.id} task={t} />)}
                </div>
            </div>
        </>
    )
}

export default AllTasks