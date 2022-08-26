import React, { Fragment } from 'react';
import { shape, string } from 'prop-types';

import { useStyle } from '@magento/venia-ui/lib/classify';
import BreadcrumbsShimmer from '@magento/venia-ui/lib/components/Breadcrumbs/breadcrumbs.shimmer';
import { FilterModalOpenButtonShimmer } from '@magento/venia-ui/lib/components/FilterModalOpenButton';
import { FilterSidebarShimmer } from '@magento/venia-ui/lib/components/FilterSidebar';
import { GalleryShimmer } from '@magento/venia-ui/lib/components/Gallery';
import { ProductSortShimmer } from '@magento/venia-ui/lib/components/ProductSort';
import Shimmer from '@magento/venia-ui/lib/components/Shimmer';
import { SortedByContainerShimmer } from '@magento/venia-ui/lib/components/SortedByContainer';
import defaultClasses from './category.module.css';

const CategoryContentShimmer = props => {
    const classes = useStyle(defaultClasses, props.classes);

    const placeholderItems = Array.from({ length: 6 }).fill(null);

    return (
        <Fragment>
            <BreadcrumbsShimmer />
            <article className={classes.root}>
                <div className={classes.categoryHeader}>
                    <h1 className={classes.title}>
                        <div className={classes.categoryTitle}>
                            <Shimmer width={5} />
                        </div>
                    </h1>
                </div>
                <div className={classes.contentWrapper}>
                    <div className={classes.sidebar}>
                        <FilterSidebarShimmer />
                    </div>
                    <div className={classes.categoryContent}>
                        <div className={classes.heading}>
                            <div className={classes.categoryInfo}>
                                <Shimmer width={5} />
                            </div>
                            <div className={classes.headerButtons}>
                                <FilterModalOpenButtonShimmer />
                                <ProductSortShimmer />
                            </div>
                            <SortedByContainerShimmer />
                        </div>
                        <section className={classes.gallery}>
                            <GalleryShimmer items={placeholderItems} />
                        </section>
                    </div>
                </div>
            </article>
        </Fragment>
    );
};

CategoryContentShimmer.defaultProps = {
    classes: {}
};

CategoryContentShimmer.propTypes = {
    classes: shape({
        root: string,
        categoryHeader: string,
        title: string,
        categoryTitle: string,
        sidebar: string,
        categoryContent: string,
        heading: string,
        categoryInfo: string,
        headerButtons: string,
        gallery: string
    })
};

export default CategoryContentShimmer;
