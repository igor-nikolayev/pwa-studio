import React, {Fragment, Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState} from 'react';
import { FormattedMessage } from 'react-intl';
import { array, number, shape, string } from 'prop-types';

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faList, faTh} from "@fortawesome/free-solid-svg-icons";

import { useIsInViewport } from '@magento/peregrine/lib/hooks/useIsInViewport';
import { useCategoryContent } from '@magento/peregrine/lib/talons/RootComponents/Category';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { useHistory, useLocation } from 'react-router-dom';

import Breadcrumbs from '@magento/venia-ui/lib/components/Breadcrumbs';
import FilterModalOpenButton, {
    FilterModalOpenButtonShimmer
} from '@magento/venia-ui/lib/components/FilterModalOpenButton';
import { FilterSidebarShimmer } from '@magento/venia-ui/lib/components/FilterSidebar';
import Gallery, { GalleryShimmer } from '../Gallery';
import { StoreTitle } from '@magento/venia-ui/lib/components/Head';
import Pagination from '@magento/venia-ui/lib/components/Pagination';
import ProductSort, { ProductSortShimmer } from '@magento/venia-ui/lib/components/ProductSort';
import RichContent from '@magento/venia-ui/lib/components/RichContent';
import Shimmer from '@magento/venia-ui/lib/components/Shimmer';
import SortedByContainer, {
    SortedByContainerShimmer
} from '@magento/venia-ui/lib/components/SortedByContainer';
import defaultClasses from './category.module.css';
import NoProductsFound from '@magento/venia-ui/lib/RootComponents/Category/NoProductsFound';

const FilterModal = React.lazy(() => import('@magento/venia-ui/lib/components/FilterModal'));
const FilterSidebar = React.lazy(() =>
    import('@magento/venia-ui/lib/components/FilterSidebar')
);

const CategoryContent = props => {
    const {
        categoryId,
        data,
        isLoading,
        pageControl,
        sortProps,
        pageSize
    } = props;
    const [currentSort] = sortProps;

    const talonProps = useCategoryContent({
        categoryId,
        data,
        pageSize
    });

    const {
        availableSortMethods,
        categoryName,
        categoryDescription,
        filters,
        items,
        totalCount,
        totalPagesFromData
    } = talonProps;

    const sidebarRef = useRef(null);
    const sectionRef = useRef(null);
    const location = useLocation();
    const history = useHistory();
    const { pathname, search } = location;
    const urlParams = new URLSearchParams(search);
    const [galleryView, setGalleryView]= useState(urlParams.get('view') || 'grid');

    useEffect(() => {
        if (galleryView === 'list') {
            sectionRef.current.classList.add(classes.galleryList)
            urlParams.set('view', 'list')
        } else {
            sectionRef.current.classList.remove(classes.galleryList)
            urlParams.set('view', 'grid')
        }

        history.push(`${pathname}?${urlParams.toString()}`)
    }, [galleryView])

    const classes = useStyle(defaultClasses, props.classes);
    const shouldRenderSidebarContent = useIsInViewport({
        elementRef: sidebarRef
    });

    const shouldShowFilterButtons = filters && filters.length;
    const shouldShowFilterShimmer = filters === null;

    // If there are no products we can hide the sort button.
    const shouldShowSortButtons = totalPagesFromData && availableSortMethods;
    const shouldShowSortShimmer = !totalPagesFromData && isLoading;

    const maybeFilterButtons = shouldShowFilterButtons ? (
        <FilterModalOpenButton filters={filters} />
    ) : shouldShowFilterShimmer ? (
        <FilterModalOpenButtonShimmer />
    ) : null;

    const filtersModal = shouldShowFilterButtons ? (
        <FilterModal filters={filters} />
    ) : null;

    const sidebar = shouldShowFilterButtons ? (
        <FilterSidebar filters={filters} />
    ) : shouldShowFilterShimmer ? (
        <FilterSidebarShimmer />
    ) : null;

    const maybeSortButton = shouldShowSortButtons ? (
        <ProductSort
            sortProps={sortProps}
            availableSortMethods={availableSortMethods}
        />
    ) : shouldShowSortShimmer ? (
        <ProductSortShimmer />
    ) : null;

    const maybeSortContainer = shouldShowSortButtons ? (
        <SortedByContainer currentSort={currentSort} />
    ) : shouldShowSortShimmer ? (
        <SortedByContainerShimmer />
    ) : null;

    const categoryResultsHeading =
        totalCount > 0 ? (
            <FormattedMessage
                id={'categoryContent.resultCount'}
                values={{
                    count: totalCount
                }}
                defaultMessage={'{count} Results'}
            />
        ) : isLoading ? (
            <Shimmer width={5} />
        ) : null;

    const categoryDescriptionElement = categoryDescription ? (
        <RichContent html={categoryDescription} />
    ) : null;

    const content = useMemo(() => {
        if (!totalPagesFromData && !isLoading) {
            return <NoProductsFound categoryId={categoryId} />;
        }

        const gallery = totalPagesFromData ? (
            <Gallery items={items} classes={classes}/>
        ) : (
            <GalleryShimmer items={items} />
        );

        const pagination = totalPagesFromData ? (
            <Pagination pageControl={pageControl} />
        ) : null;

        return (
            <Fragment>
                <section className={classes.gallery} ref={sectionRef}>{gallery}</section>
                <div className={classes.pagination}>{pagination}</div>
            </Fragment>
        );
    }, [
        categoryId,
        classes.gallery,
        classes.pagination,
        isLoading,
        items,
        pageControl,
        totalPagesFromData
    ]);

    const categoryTitle = categoryName ? categoryName : <Shimmer width={5} />;

    return (
        <Fragment>
            <Breadcrumbs categoryId={categoryId} />
            <StoreTitle>{categoryName}</StoreTitle>
            <article className={classes.root} data-cy="CategoryContent-root">
                <div className={classes.categoryHeader}>
                    <h1 aria-live="polite" className={classes.title}>
                        <div
                            className={classes.categoryTitle}
                            data-cy="CategoryContent-categoryTitle"
                        >
                            {categoryTitle}
                        </div>
                    </h1>
                    {categoryDescriptionElement}
                </div>
                <div className={classes.contentWrapper}>
                    <div ref={sidebarRef} className={classes.sidebar}>
                        <Suspense fallback={<FilterSidebarShimmer />}>
                            {shouldRenderSidebarContent ? sidebar : null}
                        </Suspense>
                    </div>
                    <div className={classes.categoryContent}>
                        <div className={classes.heading}>
                            <div
                                data-cy="CategoryContent-categoryInfo"
                                className={classes.categoryInfo}
                            >
                                {categoryResultsHeading}
                            </div>
                            <div className={classes.viewButtons}>
                                <FontAwesomeIcon
                                    className={`${classes.viewButton} ${galleryView ==='grid' && classes.disabled }`}
                                    cursor={'pointer'}
                                    icon={faTh}
                                    onClick={()=> setGalleryView( 'grid')}
                                />
                                <FontAwesomeIcon
                                    className={`${classes.viewButton} ${galleryView ==='list' && classes.disabled }`}
                                    cursor={'pointer'}
                                    icon={faList}
                                    onClick={()=> setGalleryView('list')}
                                />
                            </div>
                            <div className={classes.headerButtons}>
                                {maybeFilterButtons}
                                {maybeSortButton}
                            </div>
                            {maybeSortContainer}
                        </div>
                        {content}
                        <Suspense fallback={null}>{filtersModal}</Suspense>
                    </div>
                </div>
            </article>
        </Fragment>
    );
};

export default CategoryContent;

CategoryContent.propTypes = {
    classes: shape({
        gallery: string,
        pagination: string,
        root: string,
        categoryHeader: string,
        title: string,
        categoryTitle: string,
        sidebar: string,
        categoryContent: string,
        heading: string,
        categoryInfo: string,
        headerButtons: string,
        viewButton: string,
        viewButtons: string,
        galleryList: string
    }),
    // sortProps contains the following structure:
    // [{sortDirection: string, sortAttribute: string, sortText: string},
    // React.Dispatch<React.SetStateAction<{sortDirection: string, sortAttribute: string, sortText: string}]
    sortProps: array,
    pageSize: number
};
