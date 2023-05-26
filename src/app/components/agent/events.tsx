import { Provider } from 'react-redux';
import { wrapper } from '@/redux/store/store';
import styles from '@/app/assets/css/page.module.css'

// @ts-ignore
function Events({ Component, rest }) {
    const { store, props } = wrapper.useWrappedStore(rest);
    const { pageProps } = props;
    return (
        <Provider store={store}>
            <Component {...pageProps} />
        </Provider>
    );
}

export default Events;
