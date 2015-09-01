import React from 'react';
import { Provider } from 'react-redux';
import store from './store/index.js'

import App from './components/App';

React.render(
    <Provider store={store}>
        {() => <App />}
    </Provider>,
    document.getElementById('root')
);
