import React from "react";

import {AppRouter} from "./routes";
// Wails doesn't support BrowserRouter
// See https://wails.app/guides/reactrouter/
import {HashRouter as Router} from "react-router-dom";

function App() {
    return (
        <Router>
            <div>
                <main>
                    <AppRouter/>
                </main>
            </div>
        </Router>
    );
}

export default App;
