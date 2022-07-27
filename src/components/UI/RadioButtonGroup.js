
import { Fragment, useState } from 'react';
import styles from './RadioButtonGroup.module.css';

const RadioButtonGroup = props => {
    const [optionSelected, setOptionSelected] = useState();

    const idRadioGroup = Math.random().toString();

    const onCheckHandler = (event) => {
        setOptionSelected(event.target.value)
        props.onCheck(event.target.value);
    }

    return (
        <Fragment>
            {
                props.options.map((option, index) =>
                    <div className={styles.wrapper} key={index}>
                        <div className={styles.item}>
                            <input
                                type="radio"
                                name={'radio' + index + idRadioGroup}
                                value={option.value}
                                checked={optionSelected === option.value}
                                onChange={event => onCheckHandler(event)}
                            />
                            <label className={styles['label-radio']} />
                            <div>{option.label}</div>
                        </div>
                    </div>
                )
            }
        </Fragment>
    )
}

export default RadioButtonGroup;