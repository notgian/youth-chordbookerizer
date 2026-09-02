import './App.css';
import Header from './Header.tsx'
import InputArea from './InputArea'
import OutputArea from './OutputArea'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';

const App = () => {
    return (
        <div className='wrapper'>
            <Header />
            <div className="content">
                <div className="content-info">
                    <span className="info-card">
                        <FontAwesomeIcon className="info-card-icon" icon={faCircleInfo} />
                        <span className="info-card-text"> <b>NOTE:</b> This application is still in its beta phase. There are likely some functions that do not work correctly or some features may be missing.</span>
                    </span>
                    <p className="text-secondary">A simple application to help ease the process of formatting chord books for the YOUTH Praise.</p>
                    <p className="text-secondary">Simply copy a song's chords and paste them into this page. Then copy the formatted chords and paste them straight into a Google Docs!</p>
                </div>
                <div className="input-output-area">
                    <InputArea />
                    <OutputArea />
                </div>
            </div>
        </div>
    );
};

export default App;
