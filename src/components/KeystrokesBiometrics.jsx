
import { useState, useRef } from 'react'
import { AlertCircle, CheckCircle, X } from 'lucide-react'
import { Button } from './ui/button'
import { calculateMetrics } from '../lib/methods/calculateMetrics'

export default function KeystrokeBiometrics() {
    const [inputText, setInputText] = useState('')
    const [isRecording, setIsRecording] = useState(false)
    const [error, setError] = useState('')
    const [keystrokeData, setKeystrokeData] = useState([])
    const inputRef = useRef(null)
    const sampleText = "rock"

    const handleStartRecording = () => {
        setIsRecording(true)
        setInputText('')
        setError('')
        setKeystrokeData([])
        if (inputRef.current) {
            inputRef.current.focus()
        }
    }
    const handleStopRecording = () => {
        setIsRecording(false)
        const metrics = calculateMetrics(keystrokeData)
        const dataForBackend = {
            sampleText,
            inputText,
            keystrokeData,
            metrics,
            metaData: {
                recordingStartedAt: keystrokeData[0]?.time || null,
                recordingEndedAt: new Date().getTime(),
                totalKeystrokes: keystrokeData.length,
                textLength: sampleText.length,
            }
        }
        console.log(dataForBackend);
    }
    const handleKeyUp = (e) => {
        if (isRecording) {
            setKeystrokeData(prevData => [...prevData, {
                eventType: "keyup",
                key: e.key,
                time: new Date().getTime(),
                code: e.code,
                position: e.target.selectionStart,  // Get cursor position here
            }])
        }
    }
    const handleKeyDown = (e) => {
        if (isRecording) {
            setKeystrokeData(prevData => [...prevData, {
                eventType: "keydown",
                key: e.key,
                time: new Date().getTime(),
                code: e.code,
                position: e.target.selectionStart,  // Get cursor position here
            }])
        }
    }
    const handleReset = () => {
        setInputText('')
        setIsRecording(false)
        setKeystrokeData([])
        setError('')
    }
    const handleInputChange = (e) => {
        if (isRecording) {
            let newVal = e.target.value;
            setInputText(newVal);

            // More comprehensive checking
            if (newVal.length >= sampleText.length) {
                if (newVal === sampleText) {
                    // Delay to ensure last keystroke is captured
                    setTimeout(() => {
                        handleStopRecording();
                    }, 300);
                } else {
                    // Optional: Handle case where lengths match but content doesn't
                    setError("Text doesn't match the sample");
                }
            }
        }
    }
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white shadow rounded-lg p-6 mb-8">
                    <div className="mb-4">
                        {/* <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">Progress</span>
                            <span className="text-sm font-medium text-gray-700">{currentStep}/4</span>
                        </div> */}
                        {/* <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                                className="bg-primary h-2.5 rounded-full transition-all duration-300 ease-in-out"
                                style={{ width: `${(currentStep / 4) * 100}%` }}
                            ></div>
                        </div> */}
                    </div>

                    <h2 className="text-lg font-semibold text-gray-900 mb-2">Sample Text</h2>
                    <p className="text-gray-600 mb-4">{sampleText}</p>

                    <div className="relative mb-4">
                        <input
                            ref={inputRef}
                            type="text"
                            value={inputText}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            onKeyUp={handleKeyUp}
                            disabled={!isRecording}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary focus:border-primary transition duration-200"
                            placeholder="Type the sample text here..."
                        />
                        {isRecording && (
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <span className="animate-pulse">
                                    <AlertCircle className="h-5 w-5 text-primary" />
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-4 mb-6">
                        <Button
                            onClick={handleStartRecording}
                            disabled={isRecording}
                        >
                            Start Recording
                        </Button>
                        <Button
                            onClick={handleStopRecording}
                            disabled={!isRecording}
                        >
                            Stop Recording
                        </Button>
                        <Button
                            onClick={handleReset}
                        >
                            Reset
                        </Button>
                    </div>

                    {error && (
                        <div className="bg-error-light text-error p-3 rounded-md mb-4 flex items-center">
                            <AlertCircle className="h-5 w-5 mr-2" />
                            {error}
                        </div>
                    )}
                </div>
            </main>

            <footer className="bg-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-gray-500 text-sm">
                    © 2024 KeyStroke Biometrics. All rights reserved.
                </div>
            </footer>
        </div>
    )
}
