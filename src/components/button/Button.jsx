import './Button.css'

function Button({ children, ...props }) {

    return (
        <button {...props} className={[props.className, 'button'].join(' ')} type={props.type ? props.type : 'button'}>
            <span className='button-text'>{children}</span>
        </button>
    )
}

export default Button;