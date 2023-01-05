import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  HashRouter,
} from "react-router-dom";
import Home from "../routes/Home";
import Navigation from "./Navigation";
import Community from "../routes/Community";

import Project from "../routes/Project";
import Login from "../routes/Login";
import Signin from "../routes/Signin";
import Profile from "../routes/Profile";

import Apply from "../routes/Apply";
import ApplyWrite from "../routes/ApplyWrite";

import ApplyContent from "../routes/ApplyContent";
import Map from "../routes/Map";
import Board from "./Board";
import CommunityWriting from "../routes/CommunityWriting";
import Intro from "../routes/Intro";
import Footer from "./Footer";

const AppRouter = ({ isLoggedIn, userObj, refreshUserObj }) => {
  return (
    <HashRouter basename={"/"}>
      <Navigation
        isLoggedIn={isLoggedIn}
        userObj={userObj}
        refreshUserObj={refreshUserObj}
      />
      <Switch>
        <Route exact path="/">
          <Home userObj={userObj} />
        </Route>

        <Route exact path="/login">
          <Login userObj={userObj} refreshUserObj={refreshUserObj} />
        </Route>
        <Route exact path="/signin">
          <Signin userObj={userObj} refreshUserObj={refreshUserObj} />
        </Route>
        <Route exact path="/profile">
          <Profile userObj={userObj} refreshUserObj={refreshUserObj} />
        </Route>

        <Route exact path="/intro">
          <Intro />
        </Route>

        <Route exact path="/community">
          <Community />
        </Route>
        <Route exact path="/communityWriting">
          <CommunityWriting isLoggedIn={isLoggedIn} userObj={userObj} />
        </Route>
        <Route exact path="/board/:id">
          <Board isLoggedIn={isLoggedIn} userObj={userObj} />
        </Route>

        <Route exact path="/map">
          <Map isLoggedIn={isLoggedIn} userObj={userObj} />
        </Route>
        <Route exact path="/apply">
          <Apply isLoggedIn={isLoggedIn} userObj={userObj} />
        </Route>

        <Route exact path="/applycontent">
          <ApplyContent userObj={userObj} />
        </Route>
        <Route exact path="/applywrite">
          <ApplyWrite userObj={userObj} />
        </Route>

        <Route exact path="/program">
          <Project />
        </Route>
      </Switch>

      <Footer />
    </HashRouter>
  );
};
export default AppRouter;
