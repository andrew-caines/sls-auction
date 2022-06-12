const schema = {
    type: 'object',
    properties: {
        body: {
            type: 'object',
            properties: {
                title: {
                    type: 'string',
                    minLength: 5
                },
                base64Data: {
                    type: 'string',
                    minLength: 1,
                    pattern: '\=$'
                }
            },
            required: ['title']
        }
    },
    required: [
        'body'
    ],
};

export default schema;