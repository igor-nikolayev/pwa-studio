import React, {Fragment} from 'react';
import { shape, string } from 'prop-types';
import { useCategory } from '@magento/peregrine/lib/talons/RootComponents/Category';
import { useStyle } from '@magento/venia-ui/lib/classify';

import CategoryContent from './categoryContent';
import defaultClasses from '@magento/venia-ui/lib/RootComponents/Category/category.module.css';
import { Meta } from '@magento/venia-ui/lib/components/Head';
import { GET_PAGE_SIZE } from '@magento/venia-ui/lib/RootComponents/Category/category.gql';
import ErrorView from '@magento/venia-ui/lib/components/ErrorView';
import { useIntl } from 'react-intl';

const MESSAGES = new Map().set(
    'NOT_FOUND',
    "Looks like the category you were hoping to find doesn't exist. Sorry about that."
);

const Category = props => {
    const { uid } = props;
    const { formatMessage } = useIntl();

    const talonProps = useCategory({
        id: uid,
        queries: {
            getPageSize: GET_PAGE_SIZE
        }
    });

    const {
        error,
        metaDescription,
        loading,
        categoryData,
        categoryProductsItems,
        sortProps,
        pageSize,
        categoryNotFound,
        handleLoadMore,
        isLoadMoreAvailable
    } = talonProps;

    const classes = useStyle(defaultClasses, props.classes);

    if (!categoryData) {
        if (error) {
            if (process.env.NODE_ENV !== 'production') {
                console.error(error);
            }

            return <ErrorView />;
        }
    }
    if (categoryNotFound) {
        return (
            <ErrorView
                message={formatMessage({
                    id: 'category.notFound',
                    defaultMessage: MESSAGES.get('NOT_FOUND')
                })}
            />
        );
    }


    return (
        <Fragment>
            <Meta name="description" content={metaDescription} />
            <CategoryContent
                categoryId={uid}
                classes={classes}
                data={categoryData}
                isLoading={loading}
                sortProps={sortProps}
                pageSize={pageSize}
                productsItems={categoryProductsItems}
                isLoadMoreAvailable={isLoadMoreAvailable}
                handleLoadMore={handleLoadMore}
            />
        </Fragment>
    );
};

Category.propTypes = {
    classes: shape({
        gallery: string,
        root: string,
        title: string
    }),
    uid: string
};

Category.defaultProps = {
    uid: 'Mg=='
};

export default Category;
