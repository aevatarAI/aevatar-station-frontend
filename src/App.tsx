import Demo from "@/app/demo";
import LayoutDefault from "@/layouts/LayoutDefault";
import ContextProviders from "@/store/Provider";
import { type PropsWithChildren, Suspense, lazy } from "react";
import { Route, Switch } from "wouter";

const Overview = lazy(() => import("./app/Overview"));
const Welcome = lazy(() => import("./app/Welcome"));

const Loading = () => (
  <div className="page-container flex w-full flex-col pt-[140px]">
    <div className="mx-auto mb-10 w-full max-w-2xl rounded-md bg-black bg-opacity-75 p-[34px] px-[48px] shadow-lg">
      <div className="text-center text-4xl font-bold text-white">
        Loading...
      </div>
    </div>
  </div>
);
const WithLazyLoading = ({ children }: PropsWithChildren) => (
  <Suspense fallback={<Loading />}>{children}</Suspense>
);

const App = () => (
  <LayoutDefault>
    <Switch>
      <ContextProviders>
        <Route path="/">
          <WithLazyLoading>
            <Overview />
          </WithLazyLoading>
        </Route>

        <Route path="/welcome">
          <WithLazyLoading>
            <Welcome />
          </WithLazyLoading>
        </Route>

        <Route path="/demo">
          <WithLazyLoading>
            <Demo />
          </WithLazyLoading>
        </Route>

        {/* Default route in a switch */}
        {/* <Route>
          <div className="text-white text-center">404: No such page!</div>
        </Route> */}
      </ContextProviders>
    </Switch>
  </LayoutDefault>
);

export default App;
