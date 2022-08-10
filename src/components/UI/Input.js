import React, { Fragment, useImperativeHandle, useRef } from 'react';

import styles from './Input.module.css';

const Input = React.forwardRef((props, ref) => {
    const inputRef = useRef();

    const activate = () => {
        inputRef.current.focus();
    }
    
    useImperativeHandle(ref, () => {
        return {
            focus: activate
        }
    });

    return (
        <Fragment>
            <label className={styles.label}>{props.label}</label>
            <input className={styles['input-rounded']}
                ref={inputRef}
                type={props.type ? props.type : 'text'}
                pattern={props.pattern ? props.pattern : undefined}
                maxLength={props.maxlength ? props.maxlength : undefined}
                onChange={props.onChange}
                onBlur={props.onBlur} />
        </Fragment>
    );
})

export default Input;