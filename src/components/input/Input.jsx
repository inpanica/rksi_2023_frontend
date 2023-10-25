import './Input.css'

function Input({ changeValueFun, inputValue, ...props }) {

    const changeHandle = (e) => {
        changeValueFun(e)
    }

    return (
        <>
            {(props.type !== 'textarea') ?
                <input {...props} type={props.type} className={["input", "input-" + props.type].join(' ')} placeholder={props.placeholder}
                    required="required"
                    value={inputValue}
                    id={props.id}
                    onChange={changeHandle} />
                : <textarea {...props} className={["input", "input-" + props.type].join(' ')} placeholder={props.placeholder}
                    required="required"
                    value={inputValue}
                    onChange={changeHandle} />
            }
        </>
    )
}

export default Input