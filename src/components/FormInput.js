const FormInput = (props) => {
    return (
        <div className={props.className}>
            {
                props.showTitle && (
                    <label htmlFor={props.fieldName} className="form-label">{props.fieldName.toLowerCase()}</label>
                )
            }
            <input
                type={props.type}
                id={props.fieldName}
                className="form-control"
                aria-describedby={props.fieldName + 'HelpBlock'}
                placeholder={props.hint}
                name={props.name}
                onChange={props.onChange}
                value={props.value}
                disabled={props.disabled}
            />
            {
                props.isErr && (
                    <div id={props.fieldName + 'HelpBlock'} className="form-text mb-2 ms-1 text-danger">
                        {props.errText}
                    </div>
                )
            }
        </div>
    );
}

export default FormInput;
