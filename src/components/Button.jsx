import './Button.css';

const Button = ({ round = false, onClick, children }) => {
    return (
        <button
            className={'button' + (round ? ' round' : '')}
            onClick={onClick}
        >
            {children}
        </button>
    );
};

export default Button;
