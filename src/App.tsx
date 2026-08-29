import './App.css';
import InputArea from './InputArea'
import OutputArea from './OutputArea'

const App = () => {
    return (
        <div className="content">
            <h1 className="text-primary">YOUTH Chordbookerizer</h1>
            <p className="text-secondary">A simple application to help in the easy formatting of chordbooks for the YOUTH praise.</p>
            <p className="text-secondary">NOTE: This application is still in its beta phase. There are likely some functions that do not work correctly or some features may be missing.</p>
            <div className="input-output-area">
                <InputArea />
                <OutputArea />
            </div>
        </div>
    );
};

export default App;
