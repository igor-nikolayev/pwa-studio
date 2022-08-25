import React from 'react'

export default function Logo(props) {
    const {header_logo_src: src, logo_alt: alt, logo_width: width, logo_height: height} = props.logo
    const imageSrc = process.env.MAGENTO_BACKEND_URL + 'media/logo/' + src

    return (
        <img
            src={imageSrc}
            alt={alt}
            width={width}
            height={height}
        />
    )
}
