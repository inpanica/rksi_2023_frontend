import { useState } from 'react'
import '../../App.css'
import  './CategoryBox.css'

function CategoryBox() {
    const [categoryBoxActive, setCategoryBoxActive] = useState(false)
    const [category, setCategory] = useState('')

    const changeCategory = (c) => {
        setCategory(c);
        setCategoryBoxActive(false);
    }

    return (
        <div className={['category-choose-box input', categoryBoxActive ? 'category-choose-box-active' : ''].join(' ')}>
            <div className="main-text" onClick={() => setCategoryBoxActive(!categoryBoxActive)}>{category ? category : 'Выберите категорию'}</div>
            <ul>
                <li className='category main-text' onClick={() => { changeCategory('География') }}>География</li>
                <li className='category main-text' onClick={() => { changeCategory('Котики') }}>Котики</li>
            </ul>
        </div>
    )
}

export default CategoryBox