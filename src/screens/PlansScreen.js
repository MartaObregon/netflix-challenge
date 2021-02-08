import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { currentPlan, selectUser } from '../features/counter/userSlice';
import db from '../firebase';
import './PlansScreen.css';
import {loadStripe} from '@stripe/stripe-js'

function PlansScreen() {

    const [products, setProducts] = useState([]);
    const user = useSelector(selectUser);
    const dispatch = useDispatch();

    const subscription = useSelector(selectUser)

    useEffect(()=>{
        db.collection('customers')
        .doc(user.uid)
        .collection('subscriptions')
        .get()
        .then(querySnapshot =>{
            querySnapshot.forEach(async subscription =>{
                
                dispatch(currentPlan({
                    role: subscription.data().role,
                    current_period_end: subscription.data().current_period_end.seconds,
                    current_period_start: subscription.data().current_period_start.seconds,
                }))
            })
        })
    }, [dispatch, user.uid])

    console.log(subscription)


    const loadCheckout = async (priceId) => {
        const docRef = await db.collection('customers')
        .doc(user.uid)
        .collection('checkout_sessions')
        .add({
            price: priceId,
            success_url: window.location.origin,
            cancel_url: window.location.origin
        })

        docRef.onSnapshot(async(snap)=>{
            const {error, sessionId} = snap.data();

            if(error){
                //show an error to your customer
                //and inspect your cloud function logs in the Firebase console.
                alert(`An error ocurred: ${error.message}`)
            }
            if(sessionId){
                //we hace a session, lets redirect to Checkout
                //Init stripe

                const stripe = await loadStripe('pk_test_51Hj19rEjLGUVpd9dzURkx31g0tZLW3vjWN8kdAwUatM0dgHZcCHdHQBJPsB3diqwIWkWAl5puHAvfPSJuhVCXK9100md6g1nfH')
                stripe.redirectToCheckout({sessionId})
            }
        })
    }

    useEffect(() => {
        
        db.collection('products')
        .where('active', '==', true) //no need to real time listen with onSnapshop, because products are not dinamic
        .get().then(querySnapshot => {
            const products = {};
            querySnapshot.forEach(async productDoc => {
                products[productDoc.id] = productDoc.data();
                const priceSnap = await productDoc.ref.collection('prices').get();
                priceSnap.docs.forEach(price =>{
                    products[productDoc.id].prices = {
                        priceId: price.id,
                        priceData: price.data(),
                    }
                })
            })

            setProducts(products)
        })
       
    }, [])

    console.log(products)
    //because products is an objects and you cannot iterate or map an object the solution is to destruct it into an array..

    return (
        <div className="plansScreen">
        <br/>
            {user.plan && <p>Renewal date: {new Date(user.plan.current_period_end * 1000).toLocaleDateString()} </p>}
            {Object.entries(products).map(([productId, productData]) =>{
                //add some logic to check if the user subs is active
                const isCurrentPackage = productData.name?.toLowerCase().includes(user.plan?.role)

                return (
                    <div 
                    key={productId}
                    className={`${isCurrentPackage && "plansScreen__plan--disabled"} plansScreen__plan`}>
                        <div className="plansScreen__info">
                            <h5>{productData.name}</h5>
                            <h6>{productData.description}</h6>
                        </div>


                        <button onClick={()=> !isCurrentPackage && loadCheckout(productData.prices.priceId)}>{isCurrentPackage? 'Current Package' : 'Subscribe'}
                        </button>
                        
                    
                    </div>

                    
                )

            })}
        </div>
    )
}

export default PlansScreen
