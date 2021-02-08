import React from 'react'
import { useSelector } from 'react-redux'
import { selectUser } from '../features/counter/userSlice'
import { auth } from '../firebase'
import Nav from '../Nav'
import PlansScreen from './PlansScreen'
import './ProfileScreen.css'

function ProfileScreen() {

    const user = useSelector(selectUser);

    

    return (
        <div className="profileScreen">
           <Nav/>
           <div className="profileScreen__body">
                <h1>Edit Profile</h1>
                <div className="profileScreen__info">

                    <img alt="" src="https://pbs.twimg.com/profile_images/1240119990411550720/hBEe3tdn_400x400.png"/>

                    <div className="profileScreen__details">
                        <h2>{user.email}</h2>
                        <div className="profileScreen__plans"> 
                            <h3>Plans {user.plan && <p> (Current Plan: {user.plan.role})</p>} </h3>
                            <PlansScreen/>
                            
                            <button onClick={()=> auth.signOut()} className="profileScreen__signout">Sign out</button>
                        </div>
                    </div>
                </div>
           </div>
        </div>
    )
}

export default ProfileScreen
