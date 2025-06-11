import logo from './logo.svg';
import "./App.css";
import { HeroLayout1, QuestionCardCollection } from "./ui-components";

function App() {
  return (
     <div className="App">
      <HeroLayout1 width={"100%"} />
      <QuestionCardCollection  />
    </div>
  );
}

export default App;
