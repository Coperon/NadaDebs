export default {
    name: 'metaFields',
    title: 'Meta Fields',
    type: 'array',
    of: [{
        type: 'object',
        fields: [
            {
                name: 'title',
                title: 'Title',
                type: 'string',
                validation: (Rule) => Rule.required(),
                initialValue: 'Dimensions'
            },
            {
                name: 'description',
                title: 'Description',
                type: 'text',
                rows: 3,
                validation: (Rule) => Rule.required(),
            },
        ]
    }],
}