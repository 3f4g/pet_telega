import type { ReactNode } from 'react';

import { Provider } from 'react-redux';

import { store } from './store';


interface IStoreProviderProps {
  children: ReactNode;
}

const StoreProvider = ({ children }: IStoreProviderProps) => {
  return <Provider store={store}>{children}</Provider>;
};

export default StoreProvider;
