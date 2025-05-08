import React from 'react'
const HighlightDecorator = (props) => <mark>{props.renderDefault(props)}</mark>

export default HighlightDecorator
