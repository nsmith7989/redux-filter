import expect from 'expect';
import flattenDedup from '../src/helpers/flattenRecursive';

describe('flatten recursive', () => {

    it('flattens and deduplicates attribute objects', () => {
        const subjects = [
            {
                title: 'Fruit Salad',
                category: [
                    {
                        id: 1,
                        title: 'Fruit'
                    },
                    {
                        id: 11,
                        title: 'Salad'
                    }
                ]
            },
            {
                title: 'Pasta Salad',
                category: [
                    {
                        id: 2,
                        title: 'Pasta'
                    },
                    {
                        id: 11,
                        title: 'Salad'
                    }
                ]
            }
        ];

        const expected = [
            {
                value: 'Fruit',
                attribute: 1,
                count: 1,
                id: 1
            }, {
                value: 'Salad',
                attribute: 11,
                count: 2,
                id: 11
            }, {
                value: 'Pasta',
                attribute: 2,
                count: 1,
                id: 2
            }];

        const actual = flattenDedup('category', subjects, 'id', function() {});

        expect(actual).toEqual(expected);

    });

    it('nested attribute objects', () => {
        const subjects = [
            {
                title: 'Fruit Salad',
                category: [
                    {
                        id: 1,
                        title: 'Fruit'
                    },
                    {
                        id: 11,
                        title: 'Salad',
                        underling: [{
                            id: 111,
                            title: 'Really a desert'
                        }]
                    }
                ]
            },
            {
                title: 'Pasta Salad',
                category: [
                    {
                        id: 2,
                        title: 'Pasta'
                    },
                    {
                        id: 11,
                        title: 'Salad'
                    }
                ]
            }
        ];

        const expected = [
            {
                value: 'Fruit',
                attribute: 1,
                count: 1,
                id: 1
            }, {
                value: 'Salad',
                attribute: 11,
                count: 2,
                id: 11,
                underling: [{
                    id: 111,
                    value: 'Really a desert',
                    count: 1,
                    attribute: '11-111'
                }]
            }, {
                value: 'Pasta',
                attribute: 2,
                count: 1,
                id: 2
            }];

        const actual = flattenDedup('category', subjects, 'id', function() {});

        expect(actual).toEqual(expected);

    });

    it('throws when keys are not unique', () => {
        const subjects = [
            {
                title: 'Fruit Salad',
                category: [
                    {
                        id: 1,
                        title: 'Fruit'
                    },
                    {
                        id: 1,
                        title: 'Salad',
                        underling: [{
                            id: 111,
                            title: 'Really a desert'
                        }]
                    }
                ]
            },
            {
                title: 'Pasta Salad',
                category: [
                    {
                        id: 1,
                        title: 'Pasta'
                    },
                    {
                        id: 1,
                        title: 'Salad'
                    }
                ]
            }
        ];

        expect(() => flattenDedup('category', subjects, 'id', function() {})).toThrow(/keys on filter attributes must be unique/);
    });

});