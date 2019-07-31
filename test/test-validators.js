const Test = require('tape');
const Validators = require('../lib/validators');

Test('validator special types', (t) => {
    const api = {
        swagger: '2.0',
        info: {
            title: 'Minimal',
            version: '1.0.0'
        },
        paths: {
            '/test': {
                get: {
                    description: '',
                    parameters: [
                        {
                            name: 'dateTime',
                            in: 'query',
                            required: false,
                            type: 'string',
                            format: 'date-time'
                        }
                    ],
                    responses: {
                        200: {
                            description: 'default response'
                        }
                    }
                }
            }
        }
    };
    
    const validator = Validators.create(api);

    t.test('valid date-time', async (t) => {
        t.plan(2);

        const { validate } = validator.makeValidator(api.paths['/test'].get.parameters[0]);

        try {
            const iso = '1995-09-07T10:40:52Z';
            const expected = new Date(iso).getTime();
            const v = await validate(iso);
            t.assert(v instanceof Date, 'expected returned value to be a Date');
            t.equal(v.getTime(), expected, 'expected returned date to have the same timestamp as the input');
        }
        catch (error) {
            t.fail(error.message);
        }
    });

    t.test('invalid date-time', async (t) => {
        t.plan(1);

        const { validate } = validator.makeValidator(api.paths['/test'].get.parameters[0]);

        const timestamp = Date.now();

        try {
            await validate(timestamp);
            t.fail(`${timestamp} should be invalid.`);
        }
        catch (error) {
            t.pass(`${timestamp} is invalid.`);
        }
    });

});
