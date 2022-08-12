

import React, { Fragment, useImperativeHandle, useRef, useState } from 'react';
import { accentFold } from '../utils/StringUtils';

import styles from './InputAutocomplete.module.css';

const KEYCODE_ENTER = 13;
const KEYCODE_ESC = 27;
const KEYCODE_ARROW_UP = 38;
const KEYCODE_ARROW_DOWN = 40

const InputAutocomplete = React.forwardRef((props, ref) => {

    const [state, setState] = useState({
        activeSuggestion: 0,
        filteredSuggestions: [],
        showSuggestions: false,
        userInput: '',
        checked: false,
        selected: false
    });

    const inputRef = useRef();

    const activate = () => {
        inputRef.current.focus();
    }
    
    useImperativeHandle(ref, () => {
        return {
            focus: activate
        }
    });

    const onChange = e => {
        const { suggestions } = props;
        const userInput = e.currentTarget.value;

        const filteredSuggestions = suggestions.filter(
            suggestion =>
                accentFold(suggestion.value.toLowerCase()).indexOf(accentFold(userInput.toLowerCase())) > -1
        );

        if (state.option) {
            props.onDeselect(state.option);
        }

        let newState = {};
        if (filteredSuggestions.length === 1 && userInput === filteredSuggestions[0].value) {
            const selectedOption = state.filteredSuggestions.filter(suggestion => suggestion.value === e.innerText)[0];
            newState = {
                activeSuggestion: 0,
                filteredSuggestions: [],
                showSuggestions: false,
                userInput: e.innerText,
                option: selectedOption,
                selected: true
            }
        } else {
            newState = {
                activeSuggestion: 0,
                filteredSuggestions,
                showSuggestions: filteredSuggestions.length > 0,
                userInput: e.currentTarget.value,
                option: undefined,
                selected: false
            }
        }
        
        setState(newState);
        if (props.onChange) props.onChange(newState);
    };

    const onClick = e => {
        const selectedOption = state.filteredSuggestions.filter(suggestion => suggestion.value === e.innerText)[0];
        let newState = {
            activeSuggestion: 0,
            filteredSuggestions: [],
            showSuggestions: false,
            userInput: e.innerText,
            option: selectedOption,
            selected: true
        }
        setState(newState);
        if (typeof props.index === 'number') {
            props.onSelect(selectedOption, props.index);
        } else {
            props.onSelect(selectedOption);
        }
        if (props.onChange) props.onChange(newState);
    };

    const onKeyDown = e => {
        const { activeSuggestion, filteredSuggestions } = state;
    
        if (e.keyCode === KEYCODE_ENTER) {
            e.preventDefault();
            const selectedOption = state.filteredSuggestions[state.activeSuggestion];
            let newState = {
                activeSuggestion: 0,
                showSuggestions: false,
                userInput: filteredSuggestions[activeSuggestion].value,
                option: selectedOption,
                selected: true
            }
            setState(newState);
            if (typeof props.index === 'number') {
                props.onSelect(selectedOption, props.index);
            } else {
                props.onSelect(selectedOption);
            }
            if (props.onChange) props.onChange(newState);
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
            let newState = {
                activeSuggestion: 0,
                filteredSuggestions: [],
                showSuggestions: false,
                userInput: state.userInput,
                checked: false,
                selected: false
            }
            setState(newState);
            if (props.onBlur) props.onBlur(newState);
            return;
        } else if (state.showSuggestions) {
            onClick(e.relatedTarget);
        }
        if (props.onBlur) props.onBlur(state);
    }

    return (
        <Fragment>
            <label className={styles.label}>{props.label}</label>
            <input className={styles['input-rounded']}
                ref={inputRef}
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
        </Fragment>
    )
})

export default InputAutocomplete;