

import { Fragment, useState } from 'react';

import styles from './InputAutocomplete.module.css';

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
        const selectedOption = state.filteredSuggestions.filter(suggestion => suggestion.value === e.currentTarget.innerText)[0];
        setState({
            activeSuggestion: 0,
            filteredSuggestions: [],
            showSuggestions: false,
            userInput: e.currentTarget.innerText,
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
    
        if (e.keyCode === 13) {
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
            {!state.showSuggestions && state.option && state.option.checked && <span>{props.checkedError}</span>}
        </Fragment>
    )
}

export default InputAutocomplete;