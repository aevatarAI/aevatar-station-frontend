import Login from "@/app/Account/Login";
import Register from "@/app/Account/Register";
import ResetPasswordPage from "@/app/Account/ResetPassword";
import Verification from "@/app/Account/Vertification";
import Demo from "@/app/demo";
import Header from "@/components/Header";
import LayoutDefault from "@/layouts/LayoutDefault";
import { type PropsWithChildren, Suspense, lazy } from "react";
import { Route, Switch, Redirect } from "wouter";
import ReactLoading from "react-loading";
import { accessTokenAtom } from "@/state/atoms";
import { useAtom } from "jotai";

const Overview = lazy(() => import("./app/Overview"));
const Welcome = lazy(() => import("./app/Welcome"));
const Profile = lazy(() => import("./app/Profile"));
const Dashboard = lazy(() => import("./app/Dashboard"));

const Loading = () => (
  <div
    data-testid="page-loading"
    className="flex items-center justify-center w-full h-full bg-black absolute top-0 left-0 z-50">
    <div className="flex text-2xl font-bold text-gray-800 flex items-center">
      <div className="text-white font-syne text-lg font-semibold leading-normal lowercase text-[18px]">
        Scanning......
      </div>
      <ReactLoading type="bars" color="rgba(255, 255, 255, 0.20)" />
    </div>
  </div>
);

const WithLazyLoading = ({ children }: PropsWithChildren) => (
  <Suspense fallback={<Loading />}>
    <Header />
    {children}
  </Suspense>
);

const WithLazyLoadingNoHaeader = ({ children }: PropsWithChildren) => (
  <Suspense fallback={<Loading />}>{children}</Suspense>
);

const PrivateRoute = ({ path, children }: { path: string, children: React.ReactNode }) => {
  const [accessToken] = useAtom(accessTokenAtom);
  const isAuthenticated = accessToken || localStorage.getItem('access_token')

  if (!isAuthenticated) {
    return <Redirect to="/login"/>
  }

  return <Route path={path}>{children}</Route>           
}

const App = () => (
  <LayoutDefault>
    <Switch>
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

      <PrivateRoute path="/demo">
        <WithLazyLoading>
          <Demo />
        </WithLazyLoading>
      </PrivateRoute>

      <Route path="/login">
        <WithLazyLoadingNoHaeader>
          <Login />
        </WithLazyLoadingNoHaeader>
      </Route>

      <Route path="/register">
        <WithLazyLoadingNoHaeader>
          <Register />
        </WithLazyLoadingNoHaeader>
      </Route>

      <Route path="/verification">
        <WithLazyLoadingNoHaeader>
          <Verification />
        </WithLazyLoadingNoHaeader>
      </Route>

      <Route path="/reset-password">
        <WithLazyLoadingNoHaeader>
          <ResetPasswordPage />
        </WithLazyLoadingNoHaeader>
      </Route>

      <PrivateRoute path="/profile/:menu/:tab">
        <WithLazyLoading>
          <Profile />
        </WithLazyLoading>
      </PrivateRoute>

      <PrivateRoute path="/profile/:menu">
        <WithLazyLoading>
          <Profile />
        </WithLazyLoading>
      </PrivateRoute>

      <PrivateRoute path="/profile">
        <WithLazyLoading>
          <Profile />
        </WithLazyLoading>
      </PrivateRoute>

      <PrivateRoute path="/dashboard">
        <WithLazyLoading>
          <Dashboard />
        </WithLazyLoading>
      </PrivateRoute>

      <PrivateRoute path="/dashboard/:tab">
        <WithLazyLoading>
          <Dashboard />
        </WithLazyLoading>
      </PrivateRoute>

      {/* Default route in a switch */}
      {/* <Route>
          <div className="text-white text-center">404: No such page!</div>
        </Route> */}
    </Switch>
  </LayoutDefault>
);

export default App;
