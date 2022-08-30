import React from 'react';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { Portal } from "@magento/venia-ui/lib/components/Portal";
import { FocusScope } from 'react-aria';

import defaultClasses from './quickViewModal.module.css';
import QuickViewContent from "./quickViewContent";

const QuickViewModal = props => {
    const {product, closeHandle} = props;
    const classes = useStyle(defaultClasses, props.classes);
    const modalRoot = document.getElementById('modal-root');

    return (
        <Portal container={modalRoot}>
            <FocusScope contain restoreFocus autoFocus>
                <div className={classes.root} onClick={closeHandle}>
                    <div className={classes.rootOpen} onClick={event => event.stopPropagation()}>
                        <button className={classes.closeButton} onClick={closeHandle}></button>
                        <QuickViewContent product={product}/>
                    </div>
                </div>
            </FocusScope>
        </Portal>
    )
}

export default QuickViewModal;
