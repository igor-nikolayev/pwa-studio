import React, { useEffect, useState} from 'react';
import { func, shape, string } from 'prop-types';
import MultiRangeSlider from "multi-range-slider-react";

import { useLocation } from 'react-router-dom';
import defaultClasses from './priceFilter.module.css';
import {useStyle} from "@magento/venia-ui/lib/classify";
import debounce from "lodash.debounce";
import setValidator from "@magento/peregrine/lib/validators/set";

const PriceFilter = props => {
    const { filterApi, group, onApply } = props;
    const { toggleItem, removeGroup } = filterApi;

    const location = useLocation();
    const {  search } = location;
    const urlParams = new URLSearchParams(search);

    const [filterMinPrice, filterMaxPrice] = urlParams.has('price[filter]') ?
        urlParams.get('price[filter]').split(',')[0].split('-') :
        [null, null]

    const [minPrice, maxPrice] = [0, 200];
    const [minValue, setMinValue] = useState(filterMinPrice || minPrice);
    const [maxValue, setMaxValue] = useState(filterMaxPrice || maxPrice);
    const [filterValue, setFilterValue] = useState(null)
    const classes = useStyle(defaultClasses, props.classes);

    const handleRange = debounce(e => {
        setFilterValue(`${e.minValue}_${e.maxValue}`);
    }, 1000)

    const handleMaxInput = debounce( (e)=> {
        setFilterValue(`${minValue}_${e.target.value}`)
    }, 2000);

    const handleMinInput =  debounce( (e)=> {
        setFilterValue(`${e.target.value}_${maxValue}`);
    }, 2000);

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
            <div className={classes.inputGroup}>
                <input type="number" value={minValue} min={0} max={200} onChange={(e) => {
                    setMinValue(e.target.value);
                    handleMinInput(e)
                }}/>

                <input type="number" value={maxValue} min={0} max={200} onChange={(e) => {
                    setMaxValue(e.target.value);
                    handleMaxInput(e)
                }}/>
            </div>
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
                    handleRange(e);
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
