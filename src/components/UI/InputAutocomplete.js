

import { Fragment, useState } from 'react';

import styles from './InputAutocomplete.module.css';

const InputAutocomplete = (props) => {

    const [state, setState] = useState({
        activeSuggestion: 0,
        filteredSuggestions: [],
        showSuggestions: false,
        userInput: '',
        selected: false
    });

    const onChange = e => {
        const { suggestions } = props;
        const userInput = e.currentTarget.value;
    
        const filteredSuggestions = suggestions.filter(
            suggestion =>
                suggestion.value.toLowerCase().indexOf(userInput.toLowerCase()) > -1
        );
    
        setState({
            activeSuggestion: 0,
            filteredSuggestions,
            showSuggestions: filteredSuggestions.length > 0,
            userInput: e.currentTarget.value,
            selected: false
        });
    };

    const onClick = e => {
        setState({
            activeSuggestion: 0,
            filteredSuggestions: [],
            showSuggestions: false,
            userInput: e.currentTarget.innerText,
            selected: true
        });
    };

    const onKeyDown = e => {
        const { activeSuggestion, filteredSuggestions } = state;
    
        if (e.keyCode === 13) {
            setState({
                activeSuggestion: 0,
                showSuggestions: false,
                userInput: filteredSuggestions[activeSuggestion].value,
                selected: true
            });
        } else if (e.keyCode === 38) {
            if (activeSuggestion === 0) {
                return;
            }
            setState((previousState) => { return {...previousState, activeSuggestion: activeSuggestion - 1} });
        } else if (e.keyCode === 40) {
            if (activeSuggestion === filteredSuggestions.length - 1) {
                return;
            }
            setState((previousState) => { return {...previousState, activeSuggestion: activeSuggestion + 1} });
        }
    };

    return (
        <Fragment>
            <label className={styles.label}>{props.label}</label>
            <input className={styles['input-rounded']}
                type="text"
                onChange={e => onChange(e)}
                onKeyDown={e => onKeyDown(e)}
                value={state.userInput}
            />
            {state.showSuggestions && <div><div className={styles['options-box']}>
                {state.filteredSuggestions.map((suggestion, index) => 
                    <option className={index === state.activeSuggestion ? styles.active : styles.option}
                        key={suggestion.id}
                        onClick={e => onClick(e)}
                        value={suggestion.id}>
                            {suggestion.value}
                    </option>
                )}
            </div></div>}
            {!state.showSuggestions && !state.selected && state.userInput && <span>{props.notExistsError}</span>}
        </Fragment>
    )
}

export default InputAutocomplete;