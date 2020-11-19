import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import AuthApi from './AuthApi'
import Cookies from 'js-cookie'

function App() {

  const [auth, setAuth] = React.useState(false);
  const readCookie = () => {
    const user = Cookies.get("user");
    if(user) {
      setAuth(true);
    }
  }

  React.useEffect(() => {
    readCookie();
  }, [])

  return (
    <div>
      <AuthApi.Provider value={{auth, setAuth}}>
        <Router>
          <Routes />
        </Router>
      </AuthApi.Provider>
    </div>
  );
}

//Login
const Login = () => {

  const Auth = React.useContext(AuthApi);
  const handleOnClick = () => {
    Auth.setAuth(true);
    Cookies.set("user", "loginTrue")
  }
    return (
      <div>
        <h1>Welcome to daily webcoding</h1>
        <button onClick={handleOnClick}>Login</button>
      </div>
    )
  }

//Dashboard
const Dashboard = () => {
  const Auth = React.useContext(AuthApi);
  const handleOnClick = () => {
    Auth.setAuth(false);
    Cookies.remove("user")
  }
    return (
      <div>
        <h1>Dashboard</h1>
        <button onClick={handleOnClick}>Logout</button>
      </div>
    )
  }

const Routes = () => {
  const Auth = React.useContext(AuthApi)
  return(
    <Switch>
      <ProtectedLogin path="/login" component={Login} auth={Auth.auth}/>
      <ProtectedDashboard path="/dashboard" auth={Auth.auth} component={Dashboard} />
    </Switch>
  )
}

//Protect Dashboard
const ProtectedDashboard = ({auth, component:Component,...rest}) => (
  <Route 
    {...rest}
    render={() => auth ?(
      <Component />
    ): 
    
    (
      <Redirect to="/login" />
    )}
  />
)

const ProtectedLogin = ({auth, component:Component,...rest}) => (
  <Route 
    {...rest}
    render={() => !auth ?(
      <Component />
    ): 
    
    (
      <Redirect to="/dashboard" />
    )}
  />
)

export default App;
