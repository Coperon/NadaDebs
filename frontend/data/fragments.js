export const imageQuery = `
asset-> {
    metadata,
    url,
    altText,
    originalFilename
},
crop,
hotspot
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