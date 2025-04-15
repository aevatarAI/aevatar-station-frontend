import Login from "@/app/Account/Login";
import Register from "@/app/Account/Register";
import ResetPasswordPage from "@/app/Account/ResetPassword";
import Verification from "@/app/Account/Vertification";
import Demo from "@/app/demo";
import Header from "@/components/Header";
import LayoutDefault from "@/layouts/LayoutDefault";
import { type PropsWithChildren, Suspense, lazy, useEffect } from "react";
import { Route, Switch, Redirect } from "wouter";
import ReactLoading from "react-loading";
import { accessTokenAtom } from "@/state/atoms";
import { useAtom } from "jotai";
import { service } from "@/api/axios";
import { SetAuthHeader } from "@/hooks/SetAuthHeader";
import { useGetOrganizations } from "@/hooks/useGetOrganizations";
import { useNavigate } from "@/hooks/navigate";
import { getProjects } from "@/hooks/useGetProjects";
import { useJWTDecode } from "@/hooks/useEmail";
import { getUserRole, NEW } from "@/utils/helpers";
import { CURRENT_ORGANIZATION_ATOM } from "@/state/atoms/organisation";

const Welcome = lazy(() => import("./app/Welcome"));
const Profile = lazy(() => import("./app/Profile"));
const Dashboard = lazy(() => import("./app/Dashboard"));

export const Loading = () => (
  <div
    data-testid="page-loading"
    className="flex items-center justify-center w-full h-full bg-black absolute top-0 left-0 z-50"
  >
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
  <Suspense fallback={<Loading />}>
    {children}
  </Suspense>
);


const Redirection = () => {
  const navigate = useNavigate();
  const { decodeJwt } = useJWTDecode();
  const [accessToken] = useAtom(accessTokenAtom);
  const { data, isLoading } = useGetOrganizations();
  const [, setCurrentOrganisationId] = useAtom(CURRENT_ORGANIZATION_ATOM);

  useEffect(() => {
    if (isLoading || !data) return;

    const fetchProjectsThenRedirect = async () => {
      const decodedToken = decodeJwt(accessToken as string);
      const userRole = getUserRole(decodedToken);
      const organizationIds = data.data.items.map((datum: any) => datum.id);
      const results = organizationIds.map((id: string) => getProjects(id));

      if (userRole === NEW) {
        return navigate("/welcome");
      }

      try {
        const responses = await Promise.all(results);
        let hasProjects = false;

        for (let index in responses) {
          const response = responses[index];
          if (response.code === "20000" && response.data.items.length > 0) {
            hasProjects = true;
            setCurrentOrganisationId(organizationIds[index])
            break;
          }
        }

        navigate(hasProjects ? "/dashboard" : "/profile");

      } catch (e) {
        navigate("/profile")
      }
    }

    fetchProjectsThenRedirect();

  }, [data, isLoading, navigate])

  return isLoading ? <Loading /> : null;
}

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
  return <Route path={path}>{children}</Route>;
};

const App = () => (
  <LayoutDefault>
    <Switch>
      <Route path="/">
        <WithLazyLoading>
          <Login />
        </WithLazyLoading>
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
  </LayoutDefault>
);

export default App;
