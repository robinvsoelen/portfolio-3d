import React, {useState} from 'react';
import './LoadingScreen.css'

const LoadingScreen = ({ loaded, loadingProgress, setUserReady, userReady }) => {
    const [triggerFadeOut, setTriggerFadeOut] = useState(false);

    const handleUserReady = () => {
        // Trigger the fade out effect
        setTriggerFadeOut(true);

        // After 2 seconds, set userReady to true
        setTimeout(() => {
            setUserReady(true);
        }, 1000);
    };
    setUserReady(false);
    return (
        (
            <div style={{ backgroundImage: 'url("./assets/img/screenshot.png")' }} className={`LoadingContainer ${triggerFadeOut ? 'fadeOut' : ''}`}>

                {loaded && <div className='loadingContent'>
                    <div className='MyName'>
                        Robin van Soelen
                    </div>
                    <p className='userReadyText'>Hello and welcome to my website.  </p>

                    <p className='userReadyText'>The website is ready. Are you?</p>
                    <button className='userReadyButton' onClick={handleUserReady}>I was born ready</button>
                </div>}

                {!loaded && (
                        <div className="lds-dual-ring">
                            <div className='LoadingText'>{loadingProgress.toFixed(0)}%</div>
                        </div>
                    )}

            </div>
        )
    );
};

export default LoadingScreen;
