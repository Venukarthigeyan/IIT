/* eslint-disable no-loop-func */
import React, { useState, useEffect, useRef } from 'react';
import './Chat.css';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [currentResponse, setCurrentResponse] = useState('');
    const chatWindowRef = useRef(null);

    const handleSendMessage = async () => {
        if (!userInput.trim()) return;
        setMessages(prev => [...prev, { sender: 'User', text: userInput }]);
        setUserInput('');
        setIsLoading(true);
        setCurrentResponse('');

        try {
            const response = await fetch('http://localhost:5001/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: userInput, stream: true }),
            });

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let fullResponse = '';

            while (true) {
                const { value, done } = await reader.read();
                if (done) {
                    setMessages(prev => [...prev, { sender: 'DigiBot', text: fullResponse }]);
                    setCurrentResponse('');
                    break;
                }

                const text = decoder.decode(value);
                const lines = text.split('\n').filter(line => line.trim());

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = JSON.parse(line.slice(6));
                        fullResponse += data.response;
                        setCurrentResponse(fullResponse);
                    }
                }
            }
        } catch (error) {
            console.error('Error:', error);
            setMessages(prev => [...prev, { 
                sender: 'DigiBot', 
                text: 'Error: Unable to fetch response.' 
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (chatWindowRef.current) {
            chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
        }
    }, [messages, currentResponse]);

    return (
        <div>
        <h1>Chat with DigiBot </h1>
        <div className="chat-container">
            <div className="chat-window" ref={chatWindowRef}>
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.sender.toLowerCase()}`}>
                        <div className="message-content">
                            <strong>{msg.sender}:</strong>
                            <p>{msg.text}</p>
                        </div>
                    </div>
                ))}
                {currentResponse && (
                    <div className="message digibot">
                        <div className="message-content">
                            <strong>DigiBot:</strong>
                            <p>{currentResponse}</p>
                        </div>
                    </div>
                )}
                {isLoading && !currentResponse && (
                    <div className="message digibot"><p>...</p></div>
                )}
            </div>
            <div className="input-container">
                <input
                    type="text"
                    placeholder="Ask DigiBot..."
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    disabled={isLoading}
                />
                <button onClick={handleSendMessage} disabled={isLoading}>
                    Send
                </button>
            </div>
        </div>
        </div>
    );
};

export default Chat;