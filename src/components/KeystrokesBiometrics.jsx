
import { useState, useRef, useMemo } from 'react'
import axios from 'axios'
import { useAtom } from 'jotai'
import platform from 'platform'
import { AlertCircle } from 'lucide-react'
import { Button } from './ui/button.jsx'
import { calculateMetrics } from '../lib/methods/calculateMetrics.js'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card.jsx'
import { Input } from './ui/input.jsx'
import { hydratedAuthAtom } from '../store/store.js'

const BASE_URL = import.meta.env.VITE_AUTH_BASE_URL

export default function KeystrokeBiometrics() {
    const [inputText, setInputText] = useState('')
    const [isRecording, setIsRecording] = useState(false)
    const [error, setError] = useState('')
    const [keystrokeData, setKeystrokeData] = useState([])
    const inputRef = useRef(null)
    const [auth] = useAtom(hydratedAuthAtom)
    const GOOD_SAMPLE_TEXTS = [
        "the quick brown fox jumps over",        // 26 chars
        "typing this phrase to verify myself",    // 32 chars
        "hello world how are you today friend",   // 33 chars
        "please type this to confirm identity",   // 34 chars
        "a simple phrase to show my typing style" // 36 chars
    ];
    const sampleText = useMemo(() => {
        return GOOD_SAMPLE_TEXTS[Math.floor(Math.random() * GOOD_SAMPLE_TEXTS.length)]
    }, []) 
    console.log(sampleText);
    const renderSampleText = () => {
        return sampleText.split('').map((char, index) => {
            const isMatched = index < inputText.length && char === inputText[index];
            const isWrong = index < inputText.length && char !== inputText[index];
            return (
                <span
                    key={index}
                    className={`${
                        isMatched ? 'text-white/40' : 
                        isWrong ? 'text-red-500' : 
                        'text-muted-foreground'
                    } font-bold`}
                >
                    {char}
                </span>
            );
        });
    };
    const handleStartRecording = () => {
        setIsRecording(true)
        setInputText('')
        setError('')
        setKeystrokeData([])
        if (inputRef.current) {
            inputRef.current.focus()
        }
    }
    const handleStopRecording = async () => {
        setIsRecording(false)
        console.log(BASE_URL);
        const metrics = calculateMetrics(keystrokeData)
        const startTime = keystrokeData[0]?.time || 0
        const endTime = keystrokeData[keystrokeData.length - 1]?.time || 0
        const totalTimeInMs = endTime - startTime
        // const dataForBackend = 
        const response = await axios.post(`${BASE_URL}/metrics`, {
            data: {
                userPID: auth.user?.data?.id,
                sampleText,
                inputText,
                // keystrokeData,
                metrics,
                metaData: {
                    recordingStartedAt: keystrokeData[0]?.time || null,
                    recordingEndedAt: new Date().getTime(),
                    totalKeystrokes: keystrokeData.length,
                    textLength: sampleText.length,
                    totalTimeInMs,
                },
                deviceInfo: {
                    browser: platform.name || "Unknown",
                    version: platform.version || "Unknown",
                    os: platform.os?.family || "Unknown",
                    osVersion: platform.os?.version || "Unknown",
                    device_type: platform.product || "Unknown",
                    screen_resolution: `${window.screen.width}x${window.screen.height}`,
                }
            },
        })
        console.log(response);
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
        <div className="min-h-screen flex flex-col">
            <main className="flex-grow container mx-auto  py-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Type the below text to update your keystroke biometrics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Sample Text */}
                        <p className="text-muted-foreground font-bold">"{renderSampleText()}"</p>

                        {/* Input Field */}
                        <div className="relative">
                            <Input
                                ref={inputRef}
                                type="text"
                                value={inputText}
                                onChange={handleInputChange}
                                onKeyDown={handleKeyDown}
                                onKeyUp={handleKeyUp}
                                disabled={!isRecording}
                                className="w-full"
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

                        {/* Control Buttons */}
                        <div className="flex flex-wrap gap-4">
                            <Button
                                onClick={handleStartRecording}
                                disabled={isRecording}
                                className="rounded-xl"
                            >
                                Start Recording
                            </Button>
                            <Button
                                onClick={handleStopRecording}
                                disabled={!isRecording}
                                variant="secondary"
                                className="rounded-xl"
                            >
                                Stop Recording
                            </Button>
                            <Button
                                onClick={handleReset}
                                variant="destructive"
                                className="rounded-xl"
                            >
                                Reset
                            </Button>
                        </div>

                        {/* Error Alert */}
                        {/* {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )} */}
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}
