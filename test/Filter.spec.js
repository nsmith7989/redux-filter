import React, { Component } from 'react';
import TestUtils from 'react-addons-test-utils';
import expect, { spyOn } from 'expect';
import jsdom from 'mocha-jsdom';
import Filter from '../src/index.js';
import testConfig from './testConfig.js';

expect.extend({
    toBeDefined() {
        expect.assert(
          this.actual !== undefined,
          'expected %s to be defined',
          this.actual
        );
    }
});

expect.extend({
    toBeAFunction() {
        expect.assert(
          (typeof this.actual === 'function'),
          'expected %s to be a function',
          this.actual
        );
    }
});


describe('Filter Component', () => {
    jsdom();

    class Child extends Component {

        render() {
            return <div>Test</div>;
        }
    }

    const render = () => {
        const spy = spyOn(console, 'error');
        const tree = TestUtils.renderIntoDocument(
          <Filter {...testConfig}>
              <Child />
          </Filter>
        );
        expect(spy.calls.length).toBe(0);
        return tree;
    };

    const makeChild = () => {
        const tree = TestUtils.renderIntoDocument(
          <Filter {...testConfig}>
              <Child />
          </Filter>
        );
        return TestUtils.findRenderedComponentWithType(tree, Child);
    };


    it('should enforce a single child', () => {

        expect(() => TestUtils.renderIntoDocument(
          <Filter>
              <Child />
          </Filter>
        )).toNotThrow();

        expect(() => TestUtils.renderIntoDocument(
          <Filter>
              <Child />
              <Child />
          </Filter>
        )).toThrow(/exactly one child/);

    });

    it('should enforce a react component as child', () => {
        expect(() => TestUtils.renderIntoDocument(
          <Filter>
              <Child />
          </Filter>
        )).toNotThrow();

        expect(() => TestUtils.renderIntoDocument(
          <Filter>
              <div />
          </Filter>
        )).toThrow(/child must be a react component, not a dom element/);
    });

    describe('Inject Object Props', () => {

        const testProps = ['collection',
            'optionGroups',
            'keyword',
            'appliedFilters',
            'sortItems',
            'sortFn'];

        testProps.forEach(prop => {
            it(`correctly injects ${prop} into child`, () => {
                const child = TestUtils.findRenderedComponentWithType(render(), Child);
                expect(child.props[prop]).toBeDefined();
            });
        });

    });

    describe('Inject function props', () => {
        const testFunctions = ['toggleFilter',
            'toggleOnly',
            'clearFilters',
            'keywordSearch',
            'applySort',
            'clearAllFilters'];
        testFunctions.forEach(prop => {
            it(`correctly injects ${prop} as a function into child`, () => {
                const child = TestUtils.findRenderedComponentWithType(render(), Child);
                expect(child.props[prop]).toBeAFunction();
            });
        });
    });

    describe('Single Actions', () => {

        const singleActions = [
            {action: 'toggleFilter', args: ['type', 'foo'], subjects: [{title: 'foo', type: 'foo'}]},
            {action: 'toggleFilter', args: ['type', 'bar'], subjects: [{title: 'bar', type: 'bar'}]},
            {action: 'clearAllFilters', args: [], subjects: [{title: 'foo', type: 'foo'}, {title: 'bar', type: 'bar'}]}
        ];

        singleActions.forEach(test => {
            it(`should return correct subjects when ${test.action} is called with ${test.args}`, () => {
                const child = makeChild();
                // call action
                child.props[test.action].apply(child, test.args);
                expect(child.props.collection).toEqual(test.subjects);
            });
        });

    });

    describe('Multiple Actions', () => {

        const sequences = [
            [
                {
                    fn: 'toggleFilter',
                    args: ['type', 'bar'],
                    result: [{title: 'bar', type: 'bar'}]
                },
                {
                    fn: 'toggleFilter',
                    args: ['type', 'bar'],
                    result: [{title: 'foo', type: 'foo'}, {title: 'bar', type: 'bar'}]
                }
            ],
            [
                {
                    fn: 'toggleFilter',
                    args: ['type', 'bar'],
                    result: [{title: 'bar', type: 'bar'}]
                },
                {
                    fn: 'toggleFilter',
                    args: ['type', 'bar'],
                    result: [{title: 'foo', type: 'foo'}, {title: 'bar', type: 'bar'}]
                },
                {
                    fn: 'toggleFilter',
                    args: ['type', 'bar'],
                    result: [{title: 'bar', type: 'bar'}]
                },
                {
                    fn: 'toggleFilter',
                    args: ['type', 'foo'],
                    result: [{title: 'foo', type: 'foo'}, {title: 'bar', type: 'bar'}]
                }
            ],
            [
                {
                    fn: 'toggleFilter',
                    args: ['type', 'bar'],
                    result: [{title: 'bar', type: 'bar'}]
                },
                {
                    fn: 'clearFilters',
                    args: ['type', 'bar'],
                    result: [{title: 'foo', type: 'foo'}, {title: 'bar', type: 'bar'}]
                }
            ]
        ];

        sequences.forEach(seq => {
            describe(`should have the correct subjects after each`, () => {
                let child;
                seq.forEach((obj, index) => {
                    it(`should have the correct subjects after ${obj.fn}`, () => {
                        if (index === 0) {
                            child = makeChild();
                        }
                        child.props[obj.fn].apply(child, obj.args);
                        expect(child.props.collection).toEqual(obj.result);
                    });
                });
            });
        });
    });

    describe('Searching', () => {
      // const searchKeys = ['foo', 'bar', 'gibberish'];
        const searchKeys = [
            {
                searchTerm: 'foo',
                result: [{title: 'foo', type: 'foo'}]
            },
            {
                searchTerm: 'bar',
                result: [{title: 'bar', type: 'bar'}]
            },
            {
                searchTerm: 'gibberish',
                result: []
            }
        ];
        searchKeys.forEach(keyObject => {
            it(`filter with ${keyObject.searchTerm}`, () => {
                const child = makeChild();
                child.props.keywordSearch(keyObject.searchTerm);
                expect(child.props.collection).toEqual(keyObject.result);
            });
        });
    });

    describe('hiearcical filter', () => {

        const makeChild = () => {
            const config = {
                subjects: [
                    {
                        'title': '1000 Island Dressing',
                        'filterableCriteria': [{
                            'content_id': '218130',
                            'title': 'Food Type',
                            'position': '1',
                            'children': [{
                                'content_id': '218133',
                                'title': 'Salad Dressings and Dips',
                                'position': '3',
                                'children': [{
                                    'content_id': '218147',
                                    'parent_id': '216468',
                                    'title': 'Dressings',
                                    'position': '2',
                                    'category': '_id_218133_id_'
                                }]
                            }]
                        }, {
                            'content_id': '218131',
                            'title': 'Dietary Concerns',
                            'position': '2',
                            'children': [{
                                'content_id': '218145',
                                'title': 'Gluten Free',
                                'position': '4'
                            }, {
                                'content_id': '224159',
                                'title': 'Allergens',
                                'position': '6',
                                'children': [{
                                    'content_id': '224160',
                                    'title': 'Egg',
                                    'position': '1'
                                }]
                            }]
                        }]
                    },
                    {title: 'bar', type: 'bar'}
                ],
                filterableCriteria: [{
                    title: 'attributes',
                    attribute: 'filterableCriteria',
                    hierarchy: true,
                    id: 'content_id',
                    attributeDisplayValue: 'title'
                }]
            };

            const tree = TestUtils.renderIntoDocument(
              <Filter {...config}>
                  <Child />
              </Filter>
            );
            return TestUtils.findRenderedComponentWithType(tree, Child);
        };


        it(`renders hierarchical children`, () => {

            expect(() => makeChild()).toNotThrow();
        });


    });

});
