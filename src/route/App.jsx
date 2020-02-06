import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Login, Register, NoMatch } from "./index";

class App extends React.Component {
    render() {
        return (
            <Router>
                <div>
                    {/* <Header /> */}
                    <Switch>
                        <Route exact path="/" component={Login} />
                        <Route path="/register" component={Register} />
                        <Route component={NoMatch} />
                    </Switch>
                </div>
            </Router>
        );
    }
}

export default App;
