import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Login, Register, NoMatch, Home } from "./index";

class App extends React.Component {
    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path="/" component={Login} />
                    <Route path="/register" component={Register} />
                    <Route path="/home" component={Home} />
                    <Route component={NoMatch} />
                </Switch>
            </Router>
        );
    }
}

export default App;
