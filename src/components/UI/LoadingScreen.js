import React, {useState} from 'react';
import './LoadingScreen.css'
import { isMobile, isTablet } from 'react-device-detect';

const LoadingScreen = ({ loaded, loadingProgress, setUserReady, userReady }) => {
    const [triggerFadeOut, setTriggerFadeOut] = useState(false);

    const handleUserReady = () => {
        setTriggerFadeOut(true);

        setTimeout(() => {
            setUserReady(true);
        }, 1000);
    };
    setUserReady(false);
    return (
        (
            <div style={{ backgroundImage: 'url("./assets/img/screenshot.png")' }} className={`LoadingContainer ${triggerFadeOut ? 'fadeOut' : ''}`}>

                {loaded && <div className='loadingContent'>
                    <h1 className='userReadyText'>The website is ready!</h1>
                    {(isMobile || isTablet) && <p className='userReadyText'>Scroll vertically to move, scroll horizontally to pan the camera</p>}
                    {(!isMobile & !isTablet) && <p className='userReadyText'>Use the mouse to control everything</p>}

                    <button className='userReadyButton' onClick={handleUserReady}>Start</button>
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
