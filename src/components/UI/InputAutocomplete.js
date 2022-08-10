

import { Fragment, useState } from 'react';

import styles from './InputAutocomplete.module.css';

const KEYCODE_ENTER = 13;
const KEYCODE_ESC = 27;
const KEYCODE_ARROW_UP = 38;
const KEYCODE_ARROW_DOWN = 40

const InputAutocomplete = (props) => {

    const [state, setState] = useState({
        activeSuggestion: 0,
        filteredSuggestions: [],
        showSuggestions: false,
        userInput: '',
        checked: false,
        selected: false
    });

    const onChange = e => {
        const { suggestions } = props;
        const userInput = e.currentTarget.value;
    
        const filteredSuggestions = suggestions.filter(
            suggestion =>
                suggestion.value.toLowerCase().indexOf(userInput.toLowerCase()) > -1
        );

        if (state.option) {
            props.onDeselect(state.option);
        }
    
        setState({
            activeSuggestion: 0,
            filteredSuggestions,
            showSuggestions: filteredSuggestions.length > 0,
            userInput: e.currentTarget.value,
            option: undefined,
            selected: false
        });
    };

    const onClick = e => {
        const selectedOption = state.filteredSuggestions.filter(suggestion => suggestion.value === e.innerText)[0];
        setState({
            activeSuggestion: 0,
            filteredSuggestions: [],
            showSuggestions: false,
            userInput: e.innerText,
            option: selectedOption,
            selected: true
        });
        if (typeof props.index === 'number') {
            props.onSelect(selectedOption, props.index);
        } else {
            props.onSelect(selectedOption);
        }
    };

    const onKeyDown = e => {
        const { activeSuggestion, filteredSuggestions } = state;
    
        if (e.keyCode === KEYCODE_ENTER) {
            e.preventDefault();
            const selectedOption = state.filteredSuggestions[state.activeSuggestion];
            setState({
                activeSuggestion: 0,
                showSuggestions: false,
                userInput: filteredSuggestions[activeSuggestion].value,
                option: selectedOption,
                selected: true
            });
            if (typeof props.index === 'number') {
                props.onSelect(selectedOption, props.index);
            } else {
                props.onSelect(selectedOption);
            }
        } else if (e.keyCode === KEYCODE_ESC) {
            setState({
                activeSuggestion: 0,
                filteredSuggestions: [],
                showSuggestions: false,
                userInput: '',
                checked: false,
                selected: false
            });
        } else if (e.keyCode === KEYCODE_ARROW_UP) {
            if (activeSuggestion === 0) {
                return;
            }
            setState((previousState) => { return {...previousState, activeSuggestion: activeSuggestion - 1} });
        } else if (e.keyCode === KEYCODE_ARROW_DOWN) {
            if (activeSuggestion === filteredSuggestions.length - 1) {
                return;
            }
            setState((previousState) => { return {...previousState, activeSuggestion: activeSuggestion + 1} });
        }
    };

    const onBlurHandler = (e) => {
        if (state.showSuggestions && (!e.relatedTarget || !e.currentTarget.parentElement.contains(e.relatedTarget))) {
            setState({
                activeSuggestion: 0,
                filteredSuggestions: [],
                showSuggestions: false,
                userInput: '',
                checked: false,
                selected: false
            });
        } else if (state.showSuggestions) {
            onClick(e.relatedTarget);
        }
    }

    return (
        <Fragment>
            <label className={styles.label}>{props.label}</label>
            <input className={styles['input-rounded']}
                type="text"
                onChange={e => onChange(e)}
                onKeyDown={e => onKeyDown(e)}
                value={state.userInput}
                onBlur={onBlurHandler}
            />
            {state.showSuggestions && <div><div className={styles['options-box']}>
                {state.filteredSuggestions.map((suggestion, index) => 
                    <option className={index === state.activeSuggestion ? styles.active : styles.option}
                        tabIndex={suggestion.id}
                        key={suggestion.id}
                        onClick={e => onClick(e)}
                        value={suggestion.id}>
                            {suggestion.value}
                    </option>
                )}
            </div></div>}
            {!state.showSuggestions && !state.selected && state.userInput && <span className={styles['check-error']}>{props.notExistsError}</span>}
            {!state.showSuggestions && state.option && state.option.checked && <span className={styles['check-error']}>{props.checkedError}</span>}
            {!state.showSuggestions && !state.userInput && <span className={styles['check-error']}>Debe seleccionar una opción del listado</span>}
        </Fragment>
    )
}

export default InputAutocomplete;