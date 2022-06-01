const schema = {
    type: 'object',
    properties: {
        pathParameters: {
            type: 'object',
            properties: {
                id: {
                    type: 'string',
                }
            },
            required: ['id']
        },
        body: {
            type: 'object',
            properties: {
                amount: {
                    type: 'number'
                }
            },
            required: ['amount']
        }
    },
    required: [
        'pathParameters', 'body'
    ],
};

export default schema;