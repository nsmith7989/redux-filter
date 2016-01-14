import expect from 'expect';
import { createStore } from 'redux';
import reducer from '../src/reducers/root';
import { buildInitialState } from '../src/store/index.js';
import config from './testConfig';
import * as actions from '../src/actions/creators';



describe('reducer', () => {

    let store;
    beforeEach(() => {
        const subjectsBuilder = buildInitialState({
            filterableCriteria: config.filterableCriteria,
            filterableCriteriaSortOptions: {} // not defined
        });

        store = createStore(reducer(subjectsBuilder), {...subjectsBuilder(config.subjects)});
    });

    it('can add subjects, and have those subjects reflected in subjectsCollection', () => {

        const subjects = [...config.subjects, {title: 'baz', type: 'baz'}];
        store.dispatch(actions.updateSubjects(subjects));
        const actual = store.getState();

        const expected = subjects;

        expect(actual.subjectsCollection).toEqual(expected);

    });


    it('can add subjects, and have those subjects reflected in option groups', () => {

        const subjects = [...config.subjects, {title: 'baz', type: 'baz'}];
        store.dispatch(actions.updateSubjects(subjects));
        const actual = store.getState();

        const expected = [{
            title: 'Type',
            values: [
                {
                    attribute: 'type',
                    count: 1,
                    value: 'foo'
                },
                {
                    attribute: 'type',
                    count: 1,
                    value: 'bar'
                },
                {
                    attribute: 'type',
                    count: 1,
                    value: 'baz'
                }
            ]
        }];

        expect(actual.optionGroups).toEqual(expected);

    });

});
