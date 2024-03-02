import {useState, useEffect} from "react";
import {clear} from "@testing-library/user-event/dist/clear";

const App = () => {
    const [value, setValue] = useState("")
    const [error, setError] = useState("")
    const [chatHistory, setChatHistory] = useState([])

    const surpriseOptions = [
        'who won the latest Nobel peace prize?',
        'where does the pizza come from?',
        'who do you make a BLT sandwich?'
    ]
    const surprise = () => {
        const randomValue = surpriseOptions[Math.floor(Math.random() * surpriseOptions.length)]
        setValue(randomValue)
    }
    const getResponse = async () => {
        if (!value) {
            setError("Error! Please ask a Question")
            return
        }
        try {
            const options = {
                method: 'POST',
                body: JSON.stringify({
                    history: chatHistory,
                    message: value
                }),
                headers:
                    {
                        'Content-Type': 'application/json'
                    }
            }
            const response = await fetch('http://localhost:8000/gemini', options)
            const data = await response.text()
            console.log(data)
            setChatHistory(oldChatHistory => [oldChatHistory, {
                role: "user",
                parts: value
            },
                {
                    role: "model",
                    parts: data
                }])

        } catch (error) {
            console.error(error)
            setError("Something went wrong! Please try again later.")
        }
    }
    const clear = () => {
        setValue("")
        setError("")
        setChatHistory([])
    }
    return (

        <div className="app">
            <p>What do you want to know?
                <button className="surprise" onClick={surprise} disabled={!chatHistory}>Surprise me</button></p>

            <div className="input-container">
                <input
                    value={value}
                    placeholder="when is christamas..?"
                    onChange={(e) => setValue(e.target.value)}
                />
                {!error && <button onClick={getResponse}>Ask me</button>}
                {error && <button onClick={clear}>clear</button>}
            </div>
            {error && <p>{error}</p>}
            <div className="search_results">
                {chatHistory.map((chatItem, _index) => <div key={_index}>
                    <p className="answer"> {
                        chatItem.role
                    }:{
                        chatItem.parts
                    }</p>
                </div>)}
            </div>


        </div>
    );
}

export default App;
