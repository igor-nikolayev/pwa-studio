import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useLazyQuery, useQuery } from '@apollo/client';

import mergeOperations from '../../../util/shallowMerge';
import { useAppContext } from '../../../context/app';
import { useSort } from '../../../hooks/useSort';
import {
    getFiltersFromSearch,
    getFilterInput
} from '../../../talons/FilterModal/helpers';

import DEFAULT_OPERATIONS from './category.gql';

/**
 * A [React Hook]{@link https://reactjs.org/docs/hooks-intro.html} that
 * controls the logic for the Category Root Component.
 *
 * @kind function
 *
 * @param {object}      props
 * @param {String}      props.id - Category uid.
 * @param {GraphQLAST}  props.operations.getCategoryQuery - Fetches category using a server query
 * @param {GraphQLAST}  props.operations.getFilterInputsQuery - Fetches "allowed" filters using a server query
 * @param {GraphQLAST}  props.queries.getStoreConfig - Fetches store configuration using a server query
 *
 * @returns {object}    result
 * @returns {object}    result.error - Indicates a network error occurred.
 * @returns {object}    result.categoryData - Category data.
 * @returns {bool}      result.isLoading - Category data loading.
 * @returns {string}    result.metaDescription - Category meta description.
 * @returns {object}    result.pageControl - Category pagination state.
 * @returns {array}     result.sortProps - Category sorting parameters.
 * @returns {number}    result.pageSize - Category total pages.
 */
export const useCategory = props => {
    const {
        id,
        queries: { getPageSize }
    } = props;

    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const {getCategoryQuery, getFilterInputsQuery } = operations;
    const [page, setPage] = useState(1);
    const [categoryProductsItems, setCategoryProductsItems] = useState([]);

    const { data: pageSizeData } = useQuery(getPageSize, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });
    const pageSize = pageSizeData && pageSizeData.storeConfig.grid_per_page;
    const sortProps = useSort({ sortFromSearch: false });
    const [currentSort] = sortProps;

    // Keep track of the sort criteria so we can tell when they change.
    const previousSort = useRef(currentSort);

    const [
        ,
        {
            actions: { setPageLoading }
        }
    ] = useAppContext();

    const [runQuery, queryResponse] = useLazyQuery(getCategoryQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });
    const {
        called: categoryCalled,
        loading: categoryLoading,
        error,
        data
    } = queryResponse;
    const { search } = useLocation();

    const isBackgroundLoading = !!data && categoryLoading;

    // Update the page indicator if the GraphQL query is in flight.
    useEffect(() => {
        setPageLoading(isBackgroundLoading);
    }, [isBackgroundLoading, setPageLoading]);

    // Keep track of the search terms so we can tell when they change.
    const previousSearch = useRef(search);

    // Get "allowed" filters by intersection of schema and aggregations
    const {
        called: introspectionCalled,
        data: introspectionData,
        loading: introspectionLoading
    } = useQuery(getFilterInputsQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    // Create a type map we can reference later to ensure we pass valid args
    // to the graphql query.
    // For example: { category_id: 'FilterEqualTypeInput', price: 'FilterRangeTypeInput' }
    const filterTypeMap = useMemo(() => {
        const typeMap = new Map();
        if (introspectionData) {
            introspectionData.__type.inputFields.forEach(({ name, type }) => {
                typeMap.set(name, type.name);
            });
        }
        return typeMap;
    }, [introspectionData]);

    // Run the category query immediately and whenever its variable values change.
    useEffect(() => {
        // Wait until we have the type map to fetch product data.
        if (!filterTypeMap.size || !pageSize) {
            return;
        }

        const filters = getFiltersFromSearch(search);

        // Construct the filter arg object.
        const newFilters = {};
        filters.forEach((values, key) => {
            newFilters[key] = getFilterInput(values, filterTypeMap.get(key));
        });

        // Use the category uid for the current category page regardless of the
        // applied filters. Follow-up in PWA-404.
        newFilters['category_uid'] = { eq: id };

        runQuery({
            variables: {
                currentPage: 1,
                id: id,
                filters: newFilters,
                pageSize: Number(pageSize),
                sort: { [currentSort.sortAttribute]: currentSort.sortDirection }
            }
        });
    }, [
        currentSort,
        filterTypeMap,
        id,
        pageSize,
        runQuery,
        search
    ]);

    // If we get an error after loading we should try to reset to page 1.
    // If we continue to have errors after that, render an error message.

    // Reset the current page back to one (1) when the search string, filters
    // or sort criteria change.
    useEffect(() => {
        // We don't want to compare page value.
        const prevSearch = new URLSearchParams(previousSearch.current);
        const nextSearch = new URLSearchParams(search);
        prevSearch.delete('page');
        nextSearch.delete('page');

        if (
            prevSearch.toString() !== nextSearch.toString() ||
            previousSort.current.sortAttribute.toString() !==
                currentSort.sortAttribute.toString() ||
            previousSort.current.sortDirection.toString() !==
                currentSort.sortDirection.toString()
        ) {
            // The search term changed.
            // And update the ref.
            previousSearch.current = search;
            previousSort.current = currentSort;
        }
    }, [currentSort, previousSearch, search]);

    useEffect(()=>{
        if (data){
            setCategoryProductsItems(prevCategoryProductsItems =>  [...prevCategoryProductsItems, ...data.products.items])
        }
    }, [data]);

    const categoryData = categoryLoading && !data ? null : data;
    const categoryNotFound =
        !categoryLoading && data && data.categories.items.length === 0;
    const metaDescription =
        data &&
        data.categories.items[0] &&
        data.categories.items[0].meta_description
            ? data.categories.items[0].meta_description
            : '';

    // When only categoryLoading is involved, noProductsFound component flashes for a moment
    const loading =
        (introspectionCalled && !categoryCalled) ||
        (categoryLoading && !data) ||
        introspectionLoading;

    const handleLoadMore = () => {
        if (!filterTypeMap.size || !pageSize) {
            return;
        }

        const currentPage = page + 1;
        const filters = getFiltersFromSearch(search);

        const newFilters = {};
        filters.forEach((values, key) => {
            newFilters[key] = getFilterInput(values, filterTypeMap.get(key));
        });

        newFilters['category_uid'] = {eq: id};
        runQuery({
            variables: {
                currentPage: currentPage,
                id: id,
                filters: newFilters,
                pageSize: Number(pageSize),
                sort: {[currentSort.sortAttribute]: currentSort.sortDirection}
            }
        });
        setPage(currentPage);
    };

    const isLoadMoreAvailable = data?.products.page_info.total_pages !== page;

    return {
        error,
        categoryData,
        loading,
        categoryProductsItems,
        metaDescription,
        sortProps,
        pageSize,
        categoryNotFound,
        handleLoadMore,
        isLoadMoreAvailable
    };
};
