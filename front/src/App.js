import './App.css';
import {Provider}   from 'react-redux';
import {createStore, compose, applyMiddleware} from 'redux';
import {rootReducer} from './redux/rootReduser'
import thunk from 'redux-thunk';
import {Router, Route} from 'react-router-dom';
import createHistory from "history/createBrowserHistory";
import Header from './components/header.js'
import Footer from './components/footer.js'
import Login from './components/login.js'
import Register from './components/register.js'
import Profile from './components/profile.js'
import Chat from './components/chat.js'
import Agar from './components/agar.js'
import StartGame from './components/startGame.js'
import ChangePassword from './components/changePassword.js'

const store = createStore(rootReducer,compose(
  applyMiddleware(thunk)
))

store.subscribe(() => console.log(store.getState()))
console.log(store.getState())

function App() {
  return (
    <Router history = {createHistory()}>
        <Provider store = {store}>
          <div className = "page-wrapper">
            <Route path = "/" component = {Header} />
            <Route path = "/login" component = {Login} />
            <Route path = "/register" component = {Register} />
            <Route path = "/profile" component = {Profile} />
            <Route path = "/chat" component = {Chat} />
            <Route path = "/start" component = {StartGame} />
            <Route path = "/changePassword" component = {ChangePassword} />
            <Route path = "/agar/:color" component = {Agar} />
            <Footer />
          </div>
        </Provider>
    </Router> 
  );
}

export default App;
