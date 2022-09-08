import React, { Fragment, useEffect } from 'react';
import { node, shape, string } from 'prop-types';
import { Checkbox as InformedCheckbox, useFieldApi } from 'informed';
import useFieldState from '@magento/peregrine/lib/hooks/hook-wrappers/useInformedFieldStateWrapper';

import { useStyle } from '@magento/venia-ui/lib/classify';
import { Message } from '@magento/venia-ui/lib/components/Field';
import defaultClasses from './colorFilter.module.css';

/* TODO: change lint config to use `label-has-associated-control` */
/* eslint-disable jsx-a11y/label-has-for */

const ColorFilter = props => {
    const {
        ariaLabel,
        classes: propClasses,
        field,
        fieldValue,
        id,
        label,
        message,
        ...rest
    } = props;
    const fieldApi = useFieldApi(field);
    const fieldState = useFieldState(field);
    const classes = useStyle(defaultClasses, propClasses);

    useEffect(() => {
        if (fieldValue != null && fieldValue !== fieldState.value) {
            fieldApi.setValue(fieldValue);
        }
    }, [fieldApi, fieldState.value, fieldValue]);

    const styles = {
        backgroundColor: label,
        border: fieldState.value? '3px black solid' : 'none'
    }

    return (
        <Fragment>
            <div className={classes.inputWrapper} style={styles}>
                <InformedCheckbox
                    {...rest}
                    className={classes.input}
                    field={field}
                    id={id}
                />
            </div>
            <Message fieldState={fieldState}>{message}</Message>
        </Fragment>
    );
};

export default ColorFilter;

ColorFilter.propTypes = {
    ariaLabel: string,
    classes: shape({
        icon: string,
        input: string,
        label: string,
        message: string,
        root: string
    }),
    field: string.isRequired,
    id: string,
    label: node.isRequired,
    message: node
};

/* eslint-enable jsx-a11y/label-has-for */
