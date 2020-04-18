import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Switch } from "react-router-dom";

import HomeScreen from 'src/screens/Home';
import WorldScreen from 'src/screens/Game';
import './App.css';

const App = () => {

  return (
    <BrowserRouter>
      <Switch>
        <Route
          path="/:roomName"
          render={({ match }) => <WorldScreen roomName={match.params.roomName} />}
        />
        <Route
          path="/"
          render={() => <HomeScreen />}
        />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
