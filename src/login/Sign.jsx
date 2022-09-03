import React from 'react';
import Home from '../landingPage/Home';
import { useEffect } from 'react';
import Hello from '../Hello';
import { getCookie, hasCookie } from 'cookies-next';

export const getServerSideProps = ({ req, res }) => {
    let user = hasCookie("User", { req, res }) ? getCookie('User', { req, res }) : '';
    let isLoggedIn = hasCookie("isLoggedIn", { req, res }) ? getCookie("isLoggedIn", { req, res }) : null;
    return { props: { user, isLoggedIn } };
}

function Sign({ user, isLoggedIn }) {
    return (
        <div>
            {
                isLoggedIn !== null && user !== '' ? <Hello /> : <Home />
            }
        </div>
    )
}

export default Sign