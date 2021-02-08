import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom"


import './App.css';
import { login, logout, selectUser } from './features/counter/userSlice';
import { auth } from './firebase';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import ProfileScreen from './screens/ProfileScreen';

function App() {

  const user = useSelector(selectUser) //select the user that is stored;
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(userAuth =>{
      if(userAuth){
        dispatch(login({
          uid: userAuth.uid,
          email: userAuth.email
        })) //parameter inside the action login is the payload in this case the authUser uid and email to the state stored, 
      } else{
        dispatch(logout())
      }
    })
    return unsubscribe
  }, [dispatch])

  return (
    <div className="app">
      <Router>
      {!user ? (<LoginScreen/>) : (
        <Switch>
        
          <Route  exact path="/">
              <HomeScreen/>
          </Route>
          <Route path="/profile">
            <ProfileScreen/>
          </Route>
          
        </Switch>
      )}
      </Router>
      
    </div>
  );
}

export default App;
