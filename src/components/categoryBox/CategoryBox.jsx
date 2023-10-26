import { useState } from 'react'
import '../../App.css'
import  './CategoryBox.css'

function CategoryBox({taskCategory, setTaskCategory, ...props}) {
    const [categoryBoxActive, setCategoryBoxActive] = useState(false)

    let title = ''
    let list = []
    if(props.type === 'categories'){
        title = 'Выберите категорию'
        list = ['Воспитательная работа', 'Профессиональная работа', 'Проектная работа', 'Домашняя работа', 'Кошачья забота']
    }
    else if(props.type === 'status'){
        title = 'Текущий статус: ' + props.status
        list = ['Не начата', 'В процессе', 'Завершена']
    }
    else if(props.type === 'sort'){
        title='Сортировать'
        list = ['По весу', 'По дедлайну']
    }
    else{
        title = 'Выберите приоритет'
        list = ['Срочная задача', 'Рядовая задача', 'Необязательная задача']
    }

    const changeCategory = (c) => {
        setTaskCategory(c);
        setCategoryBoxActive(false);
    }

    return (
        <div onClick={() => setCategoryBoxActive(!categoryBoxActive)} className={['category-choose-box input', categoryBoxActive ? 'category-choose-box-active' : ''].join(' ')}>
            <div className="main-text" >{taskCategory ? taskCategory : title}</div>
            <ul>
                {
                    list.map(l =>
                        <li key={l} className='category main-text' onClick={() => { changeCategory(l) }}>{l}</li>
                        )
                }
            </ul>
        </div>
    )
}

export default CategoryBox