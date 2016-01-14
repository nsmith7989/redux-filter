import expect from 'expect';
import {uniqueGeneric, getFrequencyOfUniqueValues, uniqueRanges} from '../src/helpers/buildOptions.js';

const config = {
    filterableCriteria: [
        {
            title: 'Type',
            attribute: 'type'
        }
    ],
    subjects: [
        {
            title: 'foo',
            type: 'foo',
            subtype: 'subfoo'
        }, {
            title: 'bar',
            type: 'bar',
            subtype: 'subbar'
        }
    ]
};

describe('getFrequencyOfUniqueValues', () => {

    it('counts the number of times a value appears', () => {
        const expected = {
            foo: 1,
            bar: 1
        };
        const actual = getFrequencyOfUniqueValues('type', config.subjects);
        expect(actual).toEqual(expected);
    });

    it('deals with subjects in an array', () => {
        const subjects = [
            {
                title: 'foo',
                type: [
                    'foo', 'bar'
                ],
                subtype: 'subfoo'
            }, {
                title: 'bar',
                type: 'bar',
                subtype: 'subbar'
            }
        ];

        const expected = {
            foo: 1,
            bar: 2
        };

        const actual = getFrequencyOfUniqueValues('type', subjects);

        expect(actual).toEqual(expected);

    });
});

describe('unique values', () => {

    it('gets unique options', () => {
        const expected = {
            title: 'Type',
            values: [
                {
                    attribute: 'type',
                    count: 1,
                    value: 'foo'
                }, {
                    attribute: 'type',
                    count: 1,
                    value: 'bar'
                }
            ]
        };

        const actual = uniqueGeneric({
            title: 'Type',
            attribute: 'type'
        }, config.subjects);

        expect(actual.values).toEqual(expected);
    });

    it('sorts option keys', () => {
        const expected = {
            title: 'Type',
            values: [
                {
                    attribute: 'type',
                    count: 1,
                    value: 'bar'
                }, {
                    attribute: 'type',
                    count: 1,
                    value: 'foo'
                }
            ]
        };

        const sortFn = (items) => {
            return [...items].sort((a, b) => {
                return (a > b)
                    ? 1
                    : -1;
            });
        };

        const actual = uniqueGeneric({
            title: 'Type',
            attribute: 'type'
        }, config.subjects, sortFn);

        expect(actual.values).toEqual(expected);
    });


});

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

describe('uniqueRanges', () => {

    it('filters uniqueRanges', () => {

        function subjects() {
            // two of 0-50
            const acc = [];
            for (let i = 0; i < 2; i++) {
                acc.push({
                    price: getRandomArbitrary(0, 49.99)
                });
            }
            // four of 50-99
            for (let i = 0; i < 4; i++) {
                acc.push({
                    price: getRandomArbitrary(50, 99.99)
                });
            }

            return acc;
        }

        const criteria = {
            title: 'Retail Price',
            attribute: 'price',
            ranges: [
                {
                    displayValue: 'Up - $49.99',
                    range: {
                        min: 0,
                        max: 49.99
                    }
                }, {
                    displayValue: '$50.00 - $99.99',
                    range: {
                        min: 50.00,
                        max: 99.99
                    }
                }
            ]
        };

        const expected = {
            title: 'Retail Price',
            values: [
                {
                    attribute: 'price',
                    count: 2,
                    value: 'Up - $49.99'
                }, {
                    attribute: 'price',
                    count: 4,
                    value: '$50.00 - $99.99'
                }
            ]
        };

        const actual = uniqueRanges(criteria, subjects());

        expect(actual.values).toEqual(expected);

    });

});
