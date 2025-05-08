export default {
    name: 'phone',
    type: 'object',
    title: 'Phone',
    fieldsets: [
        {
            name: 'phone',
            title: 'Add phone visible label & tel link',
            options: {
                collapsible: false,
                collapsed: false,
                columns: 2,
            }
        }
    ],
    fields: [
        {
            name: 'phoneLabel',
            title: 'Label',
            type: 'string',
            fieldset: 'phone',
        },
        {
            name: 'phoneLink',
            title: 'Link',
            description:"Enter 'tel:' + your phone number. Example: 'tel:+34666666666'",
            type: 'url',
            validation: Rule => Rule.uri({
                scheme: ['tel']
            }),
            initialValue: 'tel:+34666666666',
            fieldset: 'phone',
        },
    ]
  };