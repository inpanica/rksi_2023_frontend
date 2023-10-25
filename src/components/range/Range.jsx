import { useState, useEffect } from 'react'
import '../../App.css'
import './Range.css'
import Input from '../input/Input.jsx'

function Range ({taskPriority, setTaskPriority, ...props}) {

    const [priorityColor, setPriorityColor] = useState('violet')

    useEffect(() => {
        if (taskPriority <= 3) {
            setPriorityColor('violet')
        }
        else if (taskPriority <= 6) {
            setPriorityColor('yellow')
        }
        else {
            setPriorityColor('red')
        }
    }, [taskPriority])

    return (
        <div className="input-range-wrapper">
            <Input id="range" changeValueFun={(e) => setTaskPriority((e.target.value))} min="1" max="10" inputValue={taskPriority} type='range'></Input>
            <label htmlFor='range' className={["range-label main-text", `range-label-${priorityColor}`].join(' ')}>{taskPriority}</label>
        </div>
    )
}

export default Range