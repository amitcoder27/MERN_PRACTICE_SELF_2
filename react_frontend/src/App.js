import logo from './logo.svg';
import './App.css';
import Nav from './Navigation/Nav';
import Layout from './Layout/Layout';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Layout/>
        <Nav/>
  
      </header>
    </div>
  );
}

export default App;
