import React, {useState} from 'react';
import { FormattedMessage } from 'react-intl';
import { Info } from 'react-feather';
import { string, number, shape } from 'prop-types';
import { Link } from 'react-router-dom';
import Price from '@magento/venia-ui/lib/components/Price';
import { UNCONSTRAINED_SIZE_KEY } from '@magento/peregrine/lib/talons/Image/useImage';
import { useGalleryItem } from '@magento/peregrine/lib/talons/Gallery/useGalleryItem';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Image from '@magento/venia-ui/lib/components/Image';
import GalleryItemShimmer from './item.shimmer';
import defaultClasses from './item.module.css';
import WishlistGalleryButton from '@magento/venia-ui/lib/components/Wishlist/AddToListButton';

import AddToCartButton from '@magento/venia-ui/lib/components/Gallery/addToCartButton';
import QuickViewButton from "./quickViewButton";
import QuickViewModal  from "../QuickViewModal";
import {useScrollLock} from "@magento/peregrine";

// eslint-disable-next-line no-unused-vars

// The placeholder image is 4:5, so we should make sure to size our product
// images appropriately.
const IMAGE_WIDTH = 300;
const IMAGE_HEIGHT = 375;

// Gallery switches from two columns to three at 640px.
const IMAGE_WIDTHS = new Map()
    .set(640, IMAGE_WIDTH)
    .set(UNCONSTRAINED_SIZE_KEY, 840);

const GalleryItem = props => {
    const {
        handleLinkClick,
        item,
        itemRef,
        wishlistButtonProps,
        isSupportedProductType
    } = useGalleryItem(props);

    const { storeConfig } = props;

    const productUrlSuffix = storeConfig && storeConfig.product_url_suffix;

    const classes = useStyle(defaultClasses, props.classes);

    const [showQuickViewButton, setShowQuickViewButton] = useState(false);
    const [isQuickViewModalOpened, setIsQuickViewModalOpened] = useState(false);

    useScrollLock(isQuickViewModalOpened);

    if (!item) {
        return <GalleryItemShimmer classes={classes} />;
    }

    // eslint-disable-next-line no-unused-vars
    const { name, price_range, small_image, url_key, product_brand } = item;

    const { url: smallImageURL } = small_image;
    const productLink = resourceUrl(`/${url_key}${productUrlSuffix || ''}`);

    const wishlistButton = wishlistButtonProps ? (
        <WishlistGalleryButton {...wishlistButtonProps} />
    ) : null;

    const addButton = isSupportedProductType ? (
        <AddToCartButton item={item} urlSuffix={productUrlSuffix} />
    ) : (
        <div className={classes.unavailableContainer}>
            <Info />
            <p>
                <FormattedMessage
                    id={'galleryItem.unavailableProduct'}
                    defaultMessage={'Currently unavailable for purchase.'}
                />
            </p>
        </div>
    );

    // fallback to regular price when final price is unavailable
    const priceSource =
        price_range.maximum_price.final_price ||
        price_range.maximum_price.regular_price;

    // Hide the Rating component until it is updated with the new look and feel (PWA-2512).
    const ratingAverage = null;

    return (
        <div
            data-cy="GalleryItem-root"
            className={classes.categoryItem}
            aria-live="polite"
            aria-busy="false"
            onMouseEnter={() => setShowQuickViewButton(true)}
            onMouseLeave={() => setShowQuickViewButton(false)}
            ref={itemRef}
        >
            <Link
                onClick={handleLinkClick}
                to={productLink}
                className={classes.images}
            >
                <Image
                    alt={name}
                    classes={{
                        image: classes.image,
                        loaded: classes.imageLoaded,
                        notLoaded: classes.imageNotLoaded,
                        root: classes.imageContainer
                    }}
                    height={IMAGE_HEIGHT}
                    resource={smallImageURL}
                    widths={IMAGE_WIDTHS}
                />
                {ratingAverage}
            </Link>
            <Link
                onClick={handleLinkClick}
                to={productLink}
                className={classes.name}
                data-cy="GalleryItem-name"
            >
                <span>{name}</span>
            </Link>
            <p>
                {product_brand &&  <FormattedMessage
                    id="product.brandLabel"
                    defaultMessage="Brand: "
                    values={{ value: product_brand }}
                /> }
            </p>

            <div data-cy="GalleryItem-price" className={classes.price}>
                <Price
                    value={priceSource.value}
                    currencyCode={priceSource.currency}
                />
            </div>

            <div className={classes.actionsContainer}>
                {' '}
                {addButton}
                {wishlistButton}
            </div>
            {showQuickViewButton &&
                <QuickViewButton
                    handleQuickView={()=> setIsQuickViewModalOpened(true)}
            />}
            {isQuickViewModalOpened &&
                <QuickViewModal
                    product={item}
                    closeHandle={()=> setIsQuickViewModalOpened(false)}
                />}
        </div>
    );
};

GalleryItem.propTypes = {
    classes: shape({
        image: string,
        imageLoaded: string,
        imageNotLoaded: string,
        imageContainer: string,
        images: string,
        name: string,
        price: string,
        root: string,
        categoryItem: string
    }),
    item: shape({
        id: number.isRequired,
        uid: string.isRequired,
        name: string.isRequired,
        product_brand: string,
        small_image: shape({
            url: string.isRequired
        }),
        stock_status: string.isRequired,
        __typename: string.isRequired,
        url_key: string.isRequired,
        sku: string.isRequired,
        price_range: shape({
            maximum_price: shape({
                final_price: shape({
                    value: number.isRequired,
                    currency: string.isRequired
                }),
                regular_price: shape({
                    value: number.isRequired,
                    currency: string.isRequired
                }).isRequired,
                discount: shape({
                    amount_off: number.isRequired
                }).isRequired
            }).isRequired
        }).isRequired
    }),
    storeConfig: shape({
        magento_wishlist_general_is_enabled: string.isRequired,
        product_url_suffix: string
    })
};

export default GalleryItem;
