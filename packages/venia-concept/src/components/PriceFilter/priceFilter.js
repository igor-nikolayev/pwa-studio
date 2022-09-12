import React, { useEffect, useState} from 'react';
import { func, shape, string } from 'prop-types';
import MultiRangeSlider from "multi-range-slider-react";

import defaultClasses from './priceFilter.module.css';
import {useStyle} from "@magento/venia-ui/lib/classify";
import debounce from "lodash.debounce";
import setValidator from "@magento/peregrine/lib/validators/set";

const PriceFilter = props => {
    const { filterApi, group, onApply } = props;
    const { toggleItem, removeGroup } = filterApi;
    const [minPrice, maxPrice] = [0, 200];
    const [minValue, setMinValue] = useState(minPrice);
    const [maxValue, setMaxValue] = useState(maxPrice);
    const [filterValue, setFilterValue] = useState(null)
    const classes = useStyle(defaultClasses, props.classes);

    const handleInput = debounce(e => {
        setFilterValue(`${e.minValue}_${e.maxValue}`);
    }, 1000)

    useEffect(()=> {
        if (filterValue) {
            removeGroup({ group });

            const item = {
                title: filterValue.split('_').join('-'),
                value: filterValue
            }

            toggleItem({ group, item });

            if (typeof onApply === 'function') {
                onApply(group, item);
            }
        }
    }, [filterValue])

    return (
        <div className={classes.root}>
            <MultiRangeSlider
                min={minPrice}
                max={maxPrice}
                step={5}
                ruler={false}
                label={false}
                preventWheel={false}
                minValue={minValue}
                maxValue={maxValue}
                onInput={(e) => {
                    setMinValue(e.minValue);
                    setMaxValue(e.maxValue);
                    handleInput(e);
                }}
            />
        </div>
    );
};

PriceFilter.propTypes = {
    filterApi: shape({
        toggleItem: func.isRequired
    }).isRequired,
    filterState: setValidator,
    group: string.isRequired,
};

export default PriceFilter;
