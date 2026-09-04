export const imageQuery = `
asset-> {
    _id,
    metadata,
    url,
    altText,
    originalFilename
},
crop,
hotspot,
`

// Blocks rendered by <CommonContentGrid>. The image MUST be projected through
// imageQuery: without it the asset stays an unresolved reference, so altText and
// originalFilename are undefined and <CommonMediaImage> falls all the way through
// to an empty alt. That was 108 pages shipping alt="" in the Sep 2026 audit.
export const contentGridQuery = `
...,
_type == 'contentMedia' => {
    ...,
    image {
        ${imageQuery}
    }
}
`

export const linkQuery = `
title,
isInternalLink,
"internalLink": internalLink->{
    _id,
    _type,
    "slug": slug.current,
},
"externalUrl": externalUrl
`

export const mediaQuery = `
    videoUrl,
    autoplay,
    caption []{
        ...,
        _type=='block' => {
            markDefs [] {
                ...,
                _type == "link" => {
                    ${linkQuery}
                }
            }
        }
    },
    videoType,
    ${imageQuery}
`

export const textContentQuery = `
...,
_type=='block' => {
    markDefs [] {
        ...,
        _type == "link" => {
            ${linkQuery}
        }
    }
}
`
export const seoQuery = `
ogtitle,
ogdescription,
ogimage {
    asset-> {
        url
    }
}
`

export const blockContentQuery = `
...,
_type=='block' => {
    markDefs [] {
        ...,
        _type == "link" => {
            ${linkQuery}
        }
    }
},
_type == 'media' => {
    ${mediaQuery}
},
_type == 'gallery' => {
    "images": images[]{
        ${imageQuery}
    },
},
`

export const pageBuilder = `
"pageBuilder": pageBuilder.builder[] {
    _type,
    _type=='builderTextContent' => {
        content[]{
            ${textContentQuery}
        }
    },
    _type=='builderMedia' => {
        ${mediaQuery}
    },
    _type=='builderGallery' => {
        allowLightbox,
        caption,
        images [] {
            ${imageQuery}
        }
    }
},
`