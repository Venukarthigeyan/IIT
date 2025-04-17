import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import SignUpPage from "./pages/SignUpPage";
import GoogleAuthProviderWrapper from "./context/AuthContext";
import SearchBooks from "./pages/SearchBooks";
import Chat from "./pages/Chat";

function App() {
  return (
    <GoogleAuthProviderWrapper>
      <Router>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/dashboard" component={DashboardPage} />
          <Route path="/profile" component={ProfilePage} />
          <Route path="/forgot-password" component={ForgotPasswordPage} />
          <Route path="/search" component={SearchBooks} />
          <Route path="/signup" component={SignUpPage} />
          <Route path="/chat" component={HomePage} />
        </Switch>
      </Router>
    </GoogleAuthProviderWrapper>
  );
}

export default App;