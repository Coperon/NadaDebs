import React from 'react'

const Blockquote = props => (
    <span style={{ fontFamily: 'monospace', margin: '0' }}>"{props.renderDefault(props)}"</span>
)

export default Blockquote

