import { useEffect, useState } from 'react'
import '../../App.css'
import './AllTasks.css'
import { changeTask, getAllTasks } from '../../actions.js'
import Button from '../button/Button.jsx'
import Input from '../input/Input.jsx'
import Task from '../task/Task.jsx'
import CategoryBox from '../categoryBox/CategoryBox.jsx'
import { config } from '../../config.js'
import { deleteTask } from '../../actions.js'
import Range from '../range/Range.jsx'

function AllTasks({ user, setUser, ...props }) {

    const [files, setFiles] = useState({})
    const [tasks, setTasks] = useState(Array)
    const [currentTask, setCurrentTask] = useState({})
    const [currentTaskChanged, setCurrentTaskChanged] = useState({})
    const [currentStatus, setCurrentStatus] = useState('')
    const [searchQuery, setSearchQuery] = useState('')
    const [sortType, setSortType] = useState('')


    const getTasks = async () => {
        const response = await getAllTasks()
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
        setCurrentTaskChanged(currentTask)
    }, [currentTask])

    useEffect(() => {
        getTasks();
    }, [])

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
            getTasks();
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

    const deleteCurrentTask = async () => {
        const response = await deleteTask(currentTask.id);
        if (response.status === 200) {
            setCurrentTask('')
            getTasks();
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
                            <Input changeValueFun={(e) => setCurrentTaskChanged({...currentTaskChanged, 'name': e.target.value})} inputValue={currentTaskChanged.name} placeholder="Название"></Input>
                            <Input changeValueFun={(e) => setCurrentTaskChanged({...currentTaskChanged, 'description': e.target.value})} inputValue={currentTaskChanged.description} placeholder="Описание" type='textarea'></Input>
                            <Input changeValueFun={(e) => setCurrentTaskChanged({...currentTaskChanged, 'more_info': e.target.value})} inputValue={currentTaskChanged.more_info} placeholder="Комментарии (не обязательно)" type='textarea'></Input>
                            <CategoryBox type='categories' setTaskCategory={(c) => setCurrentTaskChanged({...currentTaskChanged, 'category': c})} taskCategory={currentTaskChanged.category} />
                            <CategoryBox setTaskCategory={(c) => setCurrentTaskChanged({...currentTaskChanged, 'priority': c})} taskCategory={currentTaskChanged.priority} />
                            <h3 className="h3-title align-center">Вес задачи</h3>
                            <Range setTaskPriority={(e) => setCurrentTaskChanged({...currentTaskChanged, 'weight': e})} taskPriority={currentTaskChanged.weight} />
                            <h3 className="h3-title align-center">Дата начала</h3>
                            <Input changeValueFun={(e) => setCurrentTaskChanged({...currentTaskChanged, 'begin': e.target.value})} inputValue={currentTaskChanged.begin} type='date'></Input>
                            <h3 className="h3-title align-center">Дата конца</h3>
                            <CategoryBox type='status' taskCategory={currentStatus} setTaskCategory={setCurrentStatus} status={statuses[currentTask.status] + ' ' + (currentTask.status === 'success' ? currentTask.when_end : '')} />
                            <Input changeValueFun={(e) => setCurrentTaskChanged({...currentTaskChanged, 'end': e.target.value})} inputValue={currentTaskChanged.end} type='date'></Input>
                            {files[currentTask.id] && <p className="fullscreen-task-name">Сопутствующие файлы:</p>}
                            {files[currentTask.id].map(f => <div key={f} className='fullscreen-task-file' onClick={() => window.open(config.url + '/' + f)}>{f.replace('static/', '')}</div>)}
                        </div>
                        <div className="fullscreen-task-buttons">
                            <Button onClick={() => setCurrentTask({})} className='button-red'>Назад</Button>
                            <Button onClick={changeCurrentTask} className='button-violet'>Сохранить изменения</Button>
                            <Button onClick={deleteCurrentTask} className='button-red'>Удалить задачу</Button>
                        </div>
                    </div>
                </div>
            }
            <div className="ctn">
                <h2 className="h2-title align-center all-tasks-title">Все задачи</h2>
                <Button onClick={getTasks} className='button-violet reload-button'>Обновить список задач</Button>
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

export default AllTasks