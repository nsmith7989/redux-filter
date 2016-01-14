import expect from 'expect';
import flattenDedup, { recurseLevel } from '../src/helpers/flattenRecursive';

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
                title: 'Fruit',
                attribute: 1,
                count: 1,
                id: 1
            }, {
                value: 'Salad',
                title: 'Salad',
                attribute: 11,
                count: 2,
                id: 11
            }, {
                value: 'Pasta',
                title: 'Pasta',
                attribute: 2,
                count: 1,
                id: 2
            }];

        const actual = flattenDedup('category', subjects, 'id', function () {
        });

        expect(actual.values).toEqual(expected);

    });

    it('nested attribute objects multiple children', () => {
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
                title: 'Fruit',
                attribute: 1,
                count: 1,
                id: 1
            }, {
                value: 'Salad',
                title: 'Salad',
                attribute: 11,
                count: 2,
                id: 11,
                underling: [{
                    id: 111,
                    value: 'Really a desert',
                    title: 'Really a desert',
                    count: 1,
                    attribute: '11-111'
                }]
            }, {
                value: 'Pasta',
                title: 'Pasta',
                attribute: 2,
                count: 1,
                id: 2
            }];

        const actual = flattenDedup('category', subjects, 'id', function () {});

        expect(actual.values).toEqual(expected);

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
                        }, {
                            id: 11001,
                            title: 'Really sweet a desert'
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
                title: 'Fruit',
                attribute: 1,
                count: 1,
                id: 1
            }, {
                value: 'Salad',
                title: 'Salad',
                attribute: 11,
                count: 2,
                id: 11,
                underling: [{
                    id: 111,
                    value: 'Really a desert',
                    title: 'Really a desert',
                    count: 1,
                    attribute: '11-111'
                }, {
                    id: 11001,
                    title: 'Really sweet a desert',
                    attribute: '11-11001',
                    count: 1,
                    value: 'Really sweet a desert'
                }]
            }, {
                value: 'Pasta',
                title: 'Pasta',
                attribute: 2,
                count: 1,
                id: 2
            }];

        const actual = flattenDedup('category', subjects, 'id', function() {});

        expect(actual.values).toEqual(expected);

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

        expect(() => flattenDedup('category', subjects, 'id', function () {
        })).toThrow(/keys on filter attributes must be unique/);
    });

    it('sorts each level by `order` attribute', () => {

        const subjects = [
            {
                title: 'Fruit Salad',
                category: [
                    {
                        id: 1,
                        title: 'Fruit',
                        order: 2
                    },
                    {
                        id: 11,
                        title: 'Salad',
                        order: 1,
                        underling: [{
                            id: 111,
                            order: 1,
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
                        title: 'Pasta',
                        order: 3
                    },
                    {
                        id: 11,
                        title: 'Salad',
                        order: 1
                    }
                ]
            }
        ];

        const expected = [
            {
                value: 'Salad',
                title: 'Salad',
                attribute: 11,
                count: 2,
                id: 11,
                order: 1,
                underling: [{
                    id: 111,
                    value: 'Really a desert',
                    title: 'Really a desert',
                    count: 1,
                    attribute: '11-111',
                    order: 1
                }]
            },
            {
                value: 'Fruit',
                title: 'Fruit',
                attribute: 1,
                count: 1,
                order: 2,
                id: 1
            }, {
                value: 'Pasta',
                title: 'Pasta',
                attribute: 2,
                count: 1,
                id: 2,
                order: 3
            }];


        const unordered = flattenDedup('category', subjects, 'id', function () {});

        const ordered = recurseLevel(unordered.values, 'children', items => {
            return [...items].sort((a, b) => a.order > b.order ? 1 : -1);
        });

        expect(ordered).toEqual(expected);

    });

});
