import { service } from "@/api/axios";
import Login from "@/app/Account/Login";
import Register from "@/app/Account/Register";
import ResetPasswordPage from "@/app/Account/ResetPassword";
import Verification from "@/app/Account/Vertification";
import Redirection from "@/app/Redirection";
import { GithubLoginCallback } from "@/app/SocialLogin/github";
import { GoogleLoginCallback } from "@/app/SocialLogin/google";
import Demo from "@/app/demo";
import Header from "@/components/Header";
import ProjectInitialisingLoading from "@/components/ProjectInitialisingLoading";
import { AccessTokenUpdater } from "@/hooks/AccessTokenUpdater";
import { SetAuthHeader } from "@/hooks/SetAuthHeader";
import LayoutDefault from "@/layouts/LayoutDefault";
import { accessTokenAtom } from "@/state/atoms";
import { useAtom } from "jotai";
import { type PropsWithChildren, Suspense, lazy } from "react";
import { Redirect, Route, Switch } from "wouter";
import Welcome from "./app/Welcome";
import Loading from "./components/PageLoading";
const Profile = lazy(() => import("./app/Profile"));
const Dashboard = lazy(() => import("./app/Dashboard"));

const WithLazyLoading = ({ children }: PropsWithChildren) => (
  <Suspense fallback={<Loading />}>
    <Header />
    {children}
  </Suspense>
);

const WithLazyLoadingNoHaeader = ({ children }: PropsWithChildren) => (
  <Suspense fallback={<Loading />}>{children}</Suspense>
);

const PrivateRoute = ({
  path,
  children,
}: {
  path: string;
  children: React.ReactNode;
}) => {
  const [accessToken] = useAtom(accessTokenAtom);
  const authenticated = accessToken || localStorage.getItem("access_token");

  if (!authenticated) {
    return <Redirect to="/login" />;
  }

  if (!service.defaults.headers.Authorization)
    service.defaults.headers.Authorization = authenticated;

  return (
    <Route path={path}>
      <AccessTokenUpdater />

      {children}
    </Route>
  );
};

const App = () => (
  <LayoutDefault>
    <Switch>
      <Route path="/">
        <WithLazyLoading>
          <Login />
        </WithLazyLoading>
      </Route>

      <Route path="/auth/github/callback">
        <GithubLoginCallback />
      </Route>

      <Route path="/auth/google/callback">
        <GoogleLoginCallback />
      </Route>

      <PrivateRoute path="/welcome">
        <WithLazyLoading>
          <SetAuthHeader />
          <Welcome />
        </WithLazyLoading>
      </PrivateRoute>

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

      <PrivateRoute path="/redirect">
        <Redirection />
      </PrivateRoute>

      <Route>
        <div className="text-white text-center">404: No such page!</div>
      </Route>
    </Switch>
    <ProjectInitialisingLoading />
  </LayoutDefault>
);

export default App;
