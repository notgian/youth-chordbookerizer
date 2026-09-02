import './App.css';
import Header from './Header.tsx'
import InputArea from './InputArea'
import OutputArea from './OutputArea'

const App = () => {
    return (
        <div className='wrapper'>
            <Header />
            <div className="content">
                <p className="text-secondary">A simple application to help in the easy formatting of chordbooks for the YOUTH praise.</p>
                <p className="text-secondary">NOTE: This application is still in its beta phase. There are likely some functions that do not work correctly or some features may be missing.</p>
                <div className="input-output-area">
                    <InputArea />
                    <OutputArea />
                </div>
            </div>
        </div>
    );
};

export default App;
