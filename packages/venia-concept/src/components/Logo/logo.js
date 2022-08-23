import React from 'react'

export default function Logo(props) {
    const { logo } = props;
    const src = process.env.MAGENTO_BACKEND_URL + 'media/logo/' + logo.header_logo_src
    return (
        <img src={src} alt={logo.logo_alt} width={logo.logo_width} height={logo.logo_height}/>
    )
}
