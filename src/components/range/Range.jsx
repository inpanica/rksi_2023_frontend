import { useState, useEffect } from 'react'
import '../../App.css'
import './Range.css'
import Input from '../input/Input.jsx'

function Range () {

    const [priority, setPriority] = useState(1)
    const [priotiryColor, setPriorityColor] = useState('violet')

    useEffect(() => {
        if (priority <= 3) {
            setPriorityColor('violet')
        }
        else if (priority <= 6) {
            setPriorityColor('yellow')
        }
        else {
            setPriorityColor('red')
        }
    }, [priority])

    return (
        <div className="input-range-wrapper">
            <Input id="range" changeValueFun={(e) => setPriority((e.target.value))} min="1" max="10" inputValue={priority} type='range'></Input>
            <label htmlFor='range' className={["range-label main-text", `range-label-${priotiryColor}`].join(' ')}>{priority}</label>
        </div>
    )
}

export default Range