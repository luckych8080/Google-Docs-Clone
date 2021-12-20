import TextEditor from "./components/Editor/TextEditor";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import {v4 as uuidv4} from "uuid"

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          <Redirect to={`/documents/${uuidv4()}`} />
        </Route>
        <Route path="/documents/:id">
          <TextEditor />
        </Route>
        <Route path="/" exact></Route>
      </Switch>
    </Router>
  );
}

export default App;
