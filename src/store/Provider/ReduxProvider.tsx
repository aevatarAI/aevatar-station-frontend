import { Provider } from "react-redux";
import { store } from "./store";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import type { ReactNode } from "react";

const persistor = persistStore(store);

export default function ReduxProvider({ children }: { children?: ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor as any}>
        {children}
      </PersistGate>
    </Provider>
  );
}
