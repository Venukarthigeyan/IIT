import React, { useState, useEffect } from 'react';
import { highlightPlugin, MessageIcon } from '@react-pdf-viewer/highlight';
import { Button, Position, PrimaryButton, Tooltip, Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

const PDFViewer = ({ fileUrl }) => {
    const [message, setMessage] = useState('');
    const [notes, setNotes] = useState([]);
    const notesContainerRef = React.useRef(null);
    let noteId = notes.length;

    const noteEles = new Map();
    const [questions, setQuestions] = useState([]);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [feedback, setFeedback] = useState({});

    useEffect(() => {
        fetchQuestions();
        fetchNotes();
        // Clean up notes map on unmount
        return () => {
            noteEles.clear();
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fileUrl]);
    const fetchNotes = async () => {
        try {
            const response = await fetch('https://iit-backend.onrender.com/api/notes?fileUrl=' + encodeURIComponent(fileUrl));
            const data = await response.json();
            // Sort notes by creation date in ascending order (oldest first)
            const sortedNotes = data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            setNotes(sortedNotes);
            noteId = data.length;
        } catch (error) {
            console.error('Error fetching notes:', error);
        }
    };

    const renderHighlightTarget = (props) => (
        <div
            style={{
                background: '#eee',
                display: 'flex',
                position: 'absolute',
                left: `${props.selectionRegion.left}%`,
                top: `${props.selectionRegion.top + props.selectionRegion.height}%`,
                transform: 'translate(0, 8px)',
                zIndex: 1,
            }}
        >
            <Tooltip
                position={Position.TopCenter}
                target={
                    <Button onClick={props.toggle}>
                        <MessageIcon style={{ fontSize: '24px', transform: 'scale(1.9)' }} />
                    </Button>
                }
                content={() => <div style={{ width: '100px' }}>Add a note</div>}
                offset={{ left: 0, top: -8 }}
            />
        </div>
    );

    const renderHighlightContent = (props) => {
        const addNote = async () => {
            if (message !== '') {
                const note = {
                    id: ++noteId,
                    content: message,
                    highlightAreas: props.highlightAreas,
                    quote: props.selectedText,
                    fileUrl: fileUrl,
                    createdAt: new Date(),
                };

                try {
                    const response = await fetch('https://iit-backend.onrender.com/api/notes', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(note),
                    });

                    if (response.ok) {
                        const savedNote = await response.json();
                        setNotes(currentNotes => [...currentNotes, savedNote]);
                        props.cancel();
                    } else {
                        console.error('Failed to save note');
                    }
                } catch (error) {
                    console.error('Error saving note:', error);
                }
            }
        };

        return (
            <div
                style={{
                    background: '#fff',
                    border: '1px solid rgba(0, 0, 0, .3)',
                    borderRadius: '2px',
                    padding: '8px',
                    position: 'absolute',
                    left: `${props.selectionRegion.left}%`,
                    top: `${props.selectionRegion.top + props.selectionRegion.height}%`,
                    zIndex: 1,
                }}
            >
                <div>
                    <textarea
                        rows={3}
                        style={{
                            border: '1px solid rgba(0, 0, 0, .3)',
                        }}
                        onChange={(e) => setMessage(e.target.value)}
                    ></textarea>
                </div>
                <div
                    style={{
                        display: 'flex',
                        marginTop: '8px',
                    }}
                >
                    <div style={{ marginRight: '8px' }}>
                        <PrimaryButton onClick={addNote}>Add</PrimaryButton>
                    </div>
                    <Button onClick={props.cancel}>Cancel</Button>
                </div>
            </div>
        );
    };

    const jumpToNote = (note) => {
        activateTab(3);
        const notesContainer = notesContainerRef.current;
        if (noteEles.has(note.id) && notesContainer) {
            notesContainer.scrollTop = noteEles.get(note.id).getBoundingClientRect().top;
        }
    };

    const renderHighlights = (props) => (
        <div>
            {notes.map((note) => (
                <React.Fragment key={note.id}>
                    {note.highlightAreas
                        .filter((area) => area.pageIndex === props.pageIndex)
                        .map((area, idx) => (
                            <div
                                key={idx}
                                style={{
                                    background: 'yellow',
                                    opacity: 0.4,
                                    ...props.getCssProperties(area, props.rotation),
                                }}
                                onClick={() => jumpToNote(note)}
                                ref={(ref) => {
                                    noteEles.set(note.id, ref);
                                }}
                            />
                        ))}
                </React.Fragment>
            ))}
        </div>
    );

    const highlightPluginInstance = highlightPlugin({
        renderHighlightTarget,
        renderHighlightContent,
        renderHighlights,
    });

    const { jumpToHighlightArea } = highlightPluginInstance;

    // Create the notes sidebar content
    const sidebarNotes = (
        <div
            ref={notesContainerRef}
            style={{
                overflow: 'auto',
                width: '100%',
            }}
        >
            {notes.length === 0 && <div style={{ textAlign: 'center' }}>There is no note</div>}
            {notes.map((note) => (
                <div
                    key={note.id}
                    style={{
                        borderBottom: '1px solid rgba(0, 0, 0, .3)',
                        cursor: 'pointer',
                        padding: '8px',
                    }}
                    onClick={() => jumpToHighlightArea(note.highlightAreas[0])}
                    ref={(ref) => {
                        noteEles.set(note.id, ref);
                    }}
                >
                    <blockquote
                        style={{
                            borderLeft: '2px solid rgba(0, 0, 0, 0.2)',
                            fontSize: '.75rem',
                            lineHeight: 1.5,
                            margin: '0 0 8px 0',
                            paddingLeft: '8px',
                            textAlign: 'justify',
                        }}
                    >
                       
                    </blockquote>
                    {note.content}
                </div>
            ))}
        </div>
    );

    // Create the default layout plugin instance with the custom notes tab
    const defaultLayoutPluginInstance = defaultLayoutPlugin({
        sidebarTabs: (defaultTabs) => 
            defaultTabs
                .filter(tab => tab.title !== 'Attachment') // Remove the Attachment tab
                .concat({
                    content: sidebarNotes,
                    icon: <MessageIcon />,
                    title: 'Notes',
                }),
    });
    
    const { activateTab } = defaultLayoutPluginInstance;
    const fetchQuestions = async () => {
        try {
            const response = await fetch('/questions.json');
            const data = await response.json();
            const bookData = data.books.find(book => book.fileUrl === fileUrl);
            setQuestions(bookData ? bookData.questions : []);
        } catch (error) {
            console.error('Error fetching questions:', error);
        }
    };

    const handleAnswerSelect = (questionId, option) => {
        setSelectedAnswers(prev => ({ ...prev, [questionId]: option }));
    };

    const checkAnswers = () => {
        const newFeedback = {};
        let allCorrect = true;

        questions.forEach((q, index) => {
            const selectedAnswer = selectedAnswers[index]?.trim();
            const correctAnswer = q.correct_option.trim();

            if (!selectedAnswer) {
                newFeedback[index] = '⚠️ Please select an answer';
                allCorrect = false;
            } else if (selectedAnswer === correctAnswer) {
                newFeedback[index] = '✅ Correct!';
            } else {
                newFeedback[index] = '❌ Incorrect. The correct answer is: ' + correctAnswer;
                allCorrect = false;
            }
        });

        setFeedback(newFeedback);
    };

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            {/* PDF Viewer */}
            <div style={{ width: '120%', height: '100vh' }}>
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                    <Viewer fileUrl={fileUrl} plugins={[highlightPluginInstance, defaultLayoutPluginInstance]}  />
                </Worker>
            </div>

            {/* MCQ Section */}
            <div style={{ width: '40%', padding: '20px', borderLeft: '1px solid gray', overflowY: 'auto', backgroundColor: 'white' }}>
                <h3 style={{ color: 'black' ,textAlign:'center'}}>Questions for this Book</h3>
                {questions.length === 0 ? (
                    <p style={{color:'black',textAlign:'center'}}>No questions available for this book.</p>
                ) : (
                    questions.map((q, index) => (
                        <div key={index} style={{ marginBottom: '20px', padding: '15px', border: '1px solid #eee', borderRadius: '8px', color: 'black' }}>
                            <p style={{ fontWeight: 'bold', marginBottom: '10px' }}>{index + 1}. {q.question}</p>
                            {q.options.map((option, optIndex) => (
                                <label 
                                    key={optIndex} 
                                    style={{ 
                                        display: 'block', 
                                        marginBottom: '8px',
                                        padding: '8px',
                                        backgroundColor: selectedAnswers[index] === option ? '#f0f0f0' : 'transparent',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <input
                                        type="radio"
                                        name={`question-${index}`}
                                        value={option}
                                        checked={selectedAnswers[index] === option}
                                        onChange={() => handleAnswerSelect(index, option)}
                                        style={{ marginRight: '10px' }}
                                    />
                                    {option}
                                </label>
                            ))}
                            {feedback[index] && (
                                <p style={{ 
                                    marginTop: '10px',
                                    padding: '8px',
                                    borderRadius: '4px',
                                    backgroundColor: feedback[index].includes('✅') ? '#e6ffe6' : 
                                                  feedback[index].includes('❌') ? '#ffe6e6' : '#fff3e6',
                                    color: feedback[index].includes('✅') ? 'green' : 
                                          feedback[index].includes('❌') ? 'red' : '#996600'
                                }}>
                                    {feedback[index]}
                                </p>
                            )}
                        </div>
                    ))
                )}
                {questions.length > 0 && (
                    <PrimaryButton 
                        onClick={checkAnswers}
                        style={{ 
                            width: '100%',
                            marginTop: '20px',
                            padding: '10px'
                        }}
                    >
                        Submit Answers
                    </PrimaryButton>
                )}
            </div>
        </div>
    );
};
//
export default PDFViewer;
