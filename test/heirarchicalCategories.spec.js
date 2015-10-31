import expect from 'expect';
import {uniqueGeneric, getFrequencyOfUniqueValues, uniqueRanges} from '../src/helpers/buildOptions.js';

const config = {
    filterableCriteria: [
        {
            title: 'Type',
            attribute: 'type',
            children: [
                {
                    title: 'SubType',
                    attribute: 'subtype',
                    parent: 'type'
                }
            ]
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

        expect(actual).toEqual(expected);
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

        expect(actual).toEqual(expected);
    });

    it('handles sub arrays', () => {
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
            ],
            children: [
                {
                    title: 'SubType',
                    values: [
                        {
                            attribute: 'subtype',
                            count: 1,
                            value: 'subfoo'
                        }, {
                            attribute: 'subtype',
                            count: 1,
                            value: 'subbar'
                        }
                    ]
                }
            ]
        };

        const actual = uniqueGeneric({
            title: 'Type',
            attribute: 'type',
            children: [
                {
                    title: 'SubType',
                    attribute: 'subtype',
                    parent: 'type'
                }
            ]
        }, config.subjects);

        expect(actual).toEqual(expected);

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

        expect(actual).toEqual(expected);

    });

    it('processes ranges for heirachial values', () => {

        function subjects() {
            // two of 0-50
            const acc = [];
            for (let i = 0; i < 2; i++) {
                acc.push({
                    price: getRandomArbitrary(0, 49.99),
                    salePrice: getRandomArbitrary(0, 19.99)
                });
            }
            // four of 50-99
            for (let i = 0; i < 4; i++) {
                acc.push({
                    price: getRandomArbitrary(50, 99.99),
                    salePrice: getRandomArbitrary(20, 49.00)
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
            ],
            children: [
                {
                    title: 'Sale Price',
                    attribute: 'salePrice',
                    ranges: [
                        {
                            displayValue: 'Sale Price Up to $19.99',
                            range: {
                                min: 0,
                                max: 19.99
                            }
                        }, {
                            displayValue: 'Sale Price $20.00 to $49.99',
                            range: {
                                min: 20,
                                max: 49.99
                            }
                        }
                    ]
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
            ],
            children: [
                {
                    title: 'Sale Price',
                    values: [
                        {
                            attribute: 'salePrice',
                            count: 2,
                            value: 'Sale Price Up to $19.99'
                        }, {
                            attribute: 'salePrice',
                            count: 4,
                            value: 'Sale Price $20.00 to $49.99'
                        }
                    ]
                }
            ]
        };

        const actual = uniqueRanges(criteria, subjects());

        expect(actual).toEqual(expected);

    });

});
