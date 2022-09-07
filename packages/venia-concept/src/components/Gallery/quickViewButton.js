import React from 'react'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye} from "@fortawesome/free-solid-svg-icons";

import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from './quickViewButton.module.css';

const  QuickViewButton = props => {
    const {handleQuickView} = props;
    const classes = useStyle(defaultClasses, props.classes);

    return (
        <div className={classes.root}>
            <button onClick={handleQuickView}>
                <FontAwesomeIcon icon={faEye} />
            </button>
        </div>
    )
}

export default QuickViewButton;
