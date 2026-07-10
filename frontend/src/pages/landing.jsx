import React from 'react'
import "../App.css"
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';
import server from '../environment';
export default function LandingPage() {


    const router = useNavigate();

    const handleGuestJoin = async () => {
        const meetingCode = window.prompt("Enter the meeting code to join");

        if (!meetingCode || !meetingCode.trim()) {
            return;
        }

        const trimmedMeetingCode = meetingCode.trim();

        try {
            const response = await axios.get(`${server}/api/v1/users/validate_meeting/${trimmedMeetingCode}`);

            if (response.data?.exists) {
                sessionStorage.setItem("meetingEntry", "guest");
                router(`/${trimmedMeetingCode}`);
                return;
            }

            window.alert("Invalid meeting code. Ask the host for the correct code.");
        } catch (error) {
            window.alert("Unable to verify the meeting code right now. Please try again.");
        }
    };

    return (
        <div className='landingPageContainer'>
            <nav>
                <div className='navHeader'>
                    <h2>Apna Video Call</h2>
                </div>
                <div className='navlist'>
                    <p onClick={handleGuestJoin}>Join as Guest</p>
                    <p onClick={() => {
                        router("/auth")

                    }}>Register</p>
                    <div onClick={() => {
                        router("/auth")

                    }} role='button'>
                        <p>Login</p>
                    </div>
                </div>
            </nav>


            <div className="landingMainContainer">
                <div>
                    <h1><span style={{ color: "#FF9839" }}>Connect</span> with your loved Ones</h1>

                    <p>Cover a distance by Apna Video Call</p>
                    <div role='button'>
                        <Link to={"/auth"}>Get Started</Link>
                    </div>
                </div>
                <div>

                    <img src="/mobile.png" alt="" />

                </div>
            </div>



        </div>
    )
}
