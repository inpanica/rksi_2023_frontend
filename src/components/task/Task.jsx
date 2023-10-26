import { useEffect, useState } from 'react'
import '../../App.css'
import './Task.css'
import { Link } from 'react-router-dom'
import { getTasks } from '../../actions.js'
import Button from '../button/Button.jsx'

function Task({ task, handleClick, files, ...props }) {

    const [color, setColor] = useState('')

    const statuses = {'not_started': 'Не начата', 'in_progress': 'В процессе', 'success': 'Завершена'}

    useEffect(() => {
        if (task.weight < 4) {
            setColor('violet')
        }
        else if (task.weight <= 6) {
            setColor('yellow')
        }
        else{
            setColor('red')
        }
    }, [task.weight])

    return (
        <div onClick={() => handleClick()} key={task.id} className='user-task'>
            <p className="user-task-name">{task.name}</p>
            <p className="user-task-priority main-text">{'для ' + task.users}</p>
            <p className="user-task-description main-text">{task.description}</p>
            <p className="user-task-priority main-text">{task.priority}</p>
            <p className="user-task-status main-text">{statuses[task.status] + ' ' + (task.status === 'success' ? task.when_end : '')}</p>
            <p className={["user-task-weight main-text", 'user-task-weight-' + color].join(' ')}>{task.weight}</p>
        </div>
    )
}

export default Task