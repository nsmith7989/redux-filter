import expect from 'expect';
import {uniqueObject, createHeirachy} from '../src/helpers/buildOptions.js';

describe('build heirachy', () => {
    it('builds results based on flat results', () => {
        const flatResults = {
            'categoryAttribute': {
                'count': 4,
                'values': [
                    {
                        'title': 'Categories'
                    }
                ]
            },
            'topLevelCategory': {
                'count': 2,
                'values': [
                    {
                        'title': 'Classic Chilled Salads',
                        'parent': 'categoryAttribute'
                    }
                ],
                'parent': 'categoryAttribute'
            },
            'subCategory': {
                'count': 2,
                'values': [
                    {
                        'title': 'Potato Salads',
                        'parent': 'topLevelCategory'
                    }
                ],
                'parent': 'topLevelCategory'
            }
        };

        const expected = [
            {
                title: 'Categories',
                attribute: 'categoryAttribute',
                count: 4,
                values: [
                    {
                        title: 'Categories'
                    }
                ],
                children: [
                    {
                        title: 'Classic Chilled Salads',
                        attribute: 'topLevelCategory',
                        count: 2,
                        values: [
                            {
                                title: 'Classic Chilled Salads',
                                parent: 'categoryAttribute'
                            }
                        ],
                        children: [
                            {
                                title: 'Potato Salads',
                                attribute: 'subCategory',
                                count: 2,
                                values: [
                                    {
                                        title: 'Potato Salads',
                                        parent: 'topLevelCategory'
                                    }
                                ]
                            }, {
                                title: 'Cole Slaws',
                                attribute: 'subcategory',
                                count: 2,
                                values: [
                                    {
                                        title: 'Cole Slaws',
                                        parent: 'topLevelCategory'
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ];

        const actual = createHeirachy(flatResults);
        expect(actual).toEqual(expected);

    });
});

function product(attribute, topLevelCategory, subCategory) {
    return {
        title: 'Product',
        categoryHeirarchy: {
            categoryAttribute: {
                title: attribute
            },
            topLevelCategory: {
                title: topLevelCategory,
                parent: 'categoryAttribute'
            },
            subCategory: {
                title: subCategory,
                parent: 'topLevelCategory'
            }
        }
    };
}

describe('heirical options generation', () => {
    it('generates hierahical options based on subjects', () => {

        const subjects = [];
        for (let i = 0; i < 2; i++) {
            subjects.push(product('Categories', 'Classic Chilled Salads', 'Potato Salads'));
        }
        for (let i = 0; i < 2; i++) {
            subjects.push(product('Categories', 'Classic Chilled Salads', 'Cole Slaws'));
        }

        const expected = {
            title: 'categoryHeirarchy',
            values: [
                {
                    title: 'Categories',
                    attribute: 'categoryAttribute',
                    count: 4,
                    values: [
                        {
                            title: 'Categories'
                        }
                    ],
                    children: [
                        {
                            title: 'Classic Chilled Salads',
                            attribute: 'topLevelCategory',
                            count: 4,
                            values: [
                                {
                                    title: 'Classic Chilled Salads',
                                    parent: 'categoryAttribute'
                                }
                            ],
                            children: [
                                {
                                    title: 'Potato Salads',
                                    attribute: 'subCategory',
                                    count: 2,
                                    values: [
                                        {
                                            title: 'Potato Salads',
                                            parent: 'topLevelCategory'
                                        }
                                    ]
                                }, {
                                    title: 'Cole Slaws',
                                    attribute: 'subCategory',
                                    count: 2,
                                    values: [
                                        {
                                            title: 'Cole Slaws',
                                            parent: 'topLevelCategory'
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        };

        const options = {
            title: 'categoryHeirarchy',
            attribute: 'categoryHeirarchy',
            hierachy: true
        };

        const actual = uniqueObject(options, subjects);

        expect(actual).toEqual(expected);

    });
});
