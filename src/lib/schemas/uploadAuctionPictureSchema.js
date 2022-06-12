const schema = {
    type: 'object',
    properties: {
        body: {
            type: 'string',
            properties: {
                base64Data: {
                    type: 'string',
                    minLength: 1,
                    pattern: '\=$'
                }
            },
            required: ['base64Data']
        }
    },
    required: [
        'body'
    ],
};
export default schema;