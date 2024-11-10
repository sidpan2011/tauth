import React, { useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import platform from 'platform'
import { useAtom } from 'jotai'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card.jsx'
import { toast } from '../hooks/use-toast'
import { Separator } from './ui/separator.jsx'
import Logo from './Logo'
import { Label } from './ui/label,jsx'
import { Input } from './ui/input.jsx'
import { Button } from './ui/button.jsx'
import { emailSchema, passwordSchema } from '../lib/schemas'
import { hydratedAuthAtom } from '../store/store.js'
import { calculateMetrics } from '../lib/methods/calculateMetrics'

const BASE_URL = import.meta.env.VITE_AUTH_BASE_URL
const GOOD_SAMPLE_TEXTS = [
    "the quick brown fox jumps over",        // 26 chars
    "typing this phrase to verify myself",    // 32 chars
    "hello world how are you today friend",   // 33 chars
    "please type this to confirm identity",   // 34 chars
    "a simple phrase to show my typing style" // 36 chars
];

const Auth = () => {
    const navigate = useNavigate()
    const [, setAuth] = useAtom(hydratedAuthAtom)
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        characters: ''
    })
    const [isSignIn, setIsSignIn] = useState(true)
    const [inputText, setInputText] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [keystrokeData, setKeystrokeData] = useState([])
    const inputRef = useRef(null)
    const sampleText = useMemo(() => {
        return GOOD_SAMPLE_TEXTS[Math.floor(Math.random() * GOOD_SAMPLE_TEXTS.length)]
    }, [])
    const renderSampleText = () => {
        return sampleText.split('').map((char, index) => {
            const isMatched = index < inputText.length && char === inputText[index];
            const isWrong = index < inputText.length && char !== inputText[index];
            return (
                <span
                    key={index}
                    className={`${isMatched ? 'text-white/40' :
                        isWrong ? 'text-red-500' :
                            'text-muted-foreground'
                        } font-bold`}
                >
                    {char}
                </span>
            );
        });
    };
    const handleKeyDown = (e) => {
        if (e.target.id === 'characters') {
            setKeystrokeData(prevData => [...prevData, {
                eventType: "keydown",
                key: e.key,
                time: new Date().getTime(),
                code: e.code,
                position: e.target.selectionStart,  // Get cursor position here
            }])
        }
    }
    const handleKeyUp = (e) => {
        if (e.target.id === 'characters') {
            setKeystrokeData(prevData => [...prevData, {
                eventType: "keyup",
                key: e.key,
                time: new Date().getTime(),
                code: e.code,
                position: e.target.selectionStart,
            }])
        }
    }
    const typingDataObject = (metrics) => {
        const startTime = keystrokeData[0]?.time || 0
        const endTime = keystrokeData[keystrokeData.length - 1]?.time || 0
        const totalTimeInMs = endTime - startTime

        return {
            email: formData.email,
            typing_dna: {
                metrics: metrics.rawMetrics,
                wpm: metrics.wpm,
                totalEvents: metrics.totalEvents,
                uniqueKeys: metrics.uniqueKeys,
                metaData: {
                    recordingStartedAt: keystrokeData[0]?.time || null,
                    recordingEndedAt: new Date().getTime(),
                    totalKeystrokes: keystrokeData.length,
                    textLength: sampleText.length,
                    totalTimeInMs,
                    sampleText,
                    inputText: formData.characters,
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
            password: formData.password || ""
        }
    }
    const handleReset = () => {
        setInputText('')
        setKeystrokeData([])
    }
    const sendKeystrokeMetrics = async (metrics) => {
        try {
            const formattedData = typingDataObject(metrics)
            console.log("formattedData", formattedData);
            const response = await axios.post(`${BASE_URL}/login`, formattedData)
            console.log(response);
            if (response.data.status_code === 200) {
                const userData = response.data.data;
                const authData = {
                    isAuthenticated: true,
                    user: {
                        data: {
                            email: userData.email,
                            is_keystroke_done: userData.is_keystroke_done,
                            id: userData.id,
                            created_at: userData.created_at
                        }
                    },
                    sessionStart: new Date().getTime()
                };

                console.log("Setting auth data for login:", authData);
                setAuth(authData);
            }
            toast({
                title: "Pattern Matched",
                description: "Character pattern authentication successful!"
            })
        } catch (error) {
            toast({
                title: "Error",
                variant: "destructive",
                description: "An unexpected error occurred",
            })
            console.error("Error sending keystroke metrics:", error)
        }
    }
    const handleInputChange = (e) => {
        const { id, value } = e.target
        setFormData(prev => ({
            ...prev,
            [id]: value
        }))
        if (id === 'characters') {

            setInputText(e.target.value)
        }
    }
    const toggleAuth = () => {
        setIsSignIn(!isSignIn)
        setFormData({ email: '', password: '', characters: '' })
    }

    const handleClick = async (e) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            // First validate email as it's required for both methods
            const emailResult = emailSchema.safeParse(formData.email)
            if (!emailResult.success) {
                toast({
                    title: "Invalid Email",
                    description: emailResult.error.errors[0].message,
                    variant: "destructive"
                })
                setIsLoading(false)
                return
            }

            if (isSignIn) {
                if (formData.password) {
                    // Login with email/password
                    try {
                        const response = await axios({
                            method: 'post',
                            url: `${BASE_URL}/login`,
                            data: {
                                email: formData.email,
                                password: formData.password
                            },
                        });

                        if (response.data.status_code === 200) {
                            console.log("Raw login response:", response.data);

                            const userData = response.data.data;
                            const authData = {
                                isAuthenticated: true,
                                user: {
                                    data: {
                                        email: userData.email,
                                        is_keystroke_done: userData.is_keystroke_done,
                                        id: userData.id,
                                        created_at: userData.created_at
                                    }
                                },
                                sessionStart: new Date().getTime()
                            };

                            console.log("Setting auth data for login:", authData);
                            setAuth(authData);
                            console.log("keystroke done value", response.data.is_keystroke_done);
                            toast({
                                title: "Sign In Successful",
                                description: "Welcome back!"
                            })
                            navigate('/dashboard')
                            setFormData({ email: '', password: '', characters: '' })
                        }
                    } catch (error) {
                        toast({
                            title: "Sign In Failed",
                            description: error.response?.data?.message || "Invalid credentials",
                            variant: "destructive"
                        })
                    }
                } else if (formData.characters === sampleText) {
                    const metrics = calculateMetrics(keystrokeData)
                    await sendKeystrokeMetrics(metrics)
                    // For now, just show success toast for character matching
                    // toast({
                    //     icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
                    //     title: "Pattern Matched",
                    //     description: "Character pattern authentication successful!"
                    // })
                    setFormData({ email: '', password: '', characters: '' })
                    setKeystrokeData([])
                }
            } else {
                // Handle sign up
                const passwordResult = passwordSchema.safeParse(formData.password)
                console.log("else block for sign up");
                if (!passwordResult.success) {
                    toast({
                        title: "Invalid Password",
                        description: passwordResult.error.errors[0].message,
                        variant: "destructive"
                    })
                    return
                }

                try {
                    console.log("before making post request");
                    const response = await axios({
                        method: 'post',
                        url: `${BASE_URL}/signup`,
                        data: {
                            email: formData.email,
                            password: formData.password
                        },
                    });
                    console.log("after making post request");
                    console.log(response);

                    if (response.data.status_code === 200) {
                        const authData = {
                            isAuthenticated: true,
                            user: response.data,
                            sessionStart: new Date().getTime() // Add session start time
                        };
                        setAuth(authData)
                        console.log(authData);
                        toast({
                            title: "Account Created",
                            description: `Account successfully created with ${formData.email}`
                        })
                        navigate('/dashboard')
                        setFormData({ email: '', password: '', characters: '' })
                    }
                } catch (error) {
                    console.log(error);
                    toast({
                        title: "Sign Up Failed",
                        description: error.response?.data?.message || "Failed to create account",
                        variant: "destructive"
                    })
                }
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "An unexpected error occurred",
            })
            console.error("Signup Error:", {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            })
        } finally {
            setIsLoading(false)
        }
    }

    const isFormValid = () => {
        const isEmailValid = formData.email.length > 0

        if (isSignIn) {
            // For sign in: need email AND either password or correct characters
            return isEmailValid && (formData.password.length >= 8 || formData.characters === sampleText)
        }

        // For sign up: need both email and password
        return isEmailValid && formData.password.length >= 8
    }

    return (
        <main className='flex flex-col justify-center min-h-screen items-center px-4'>
            <Card className="flex flex-col w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle>
                        {isSignIn ? "Sign into TAuth" : "Sign up for TAuth"}
                    </CardTitle>
                    <CardDescription>
                        {isSignIn ? "Welcome back! Please sign in to continue" : "Create an account to get started"}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleClick} className="space-y-6">
                        <div className="space-y-4">
                            <div>
                                <Label>Email</Label>
                                <Input
                                    type="email"
                                    id="email"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    disabled={isLoading}
                                />
                            </div>

                            {isSignIn ? (
                                <>
                                    <div className='space-y-3'>
                                        <Label>Choose your authentication method</Label>
                                        <Input
                                            type="password"
                                            id="password"
                                            placeholder="Password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            disabled={isLoading || formData.characters.length > 0}
                                        />

                                        <div className='relative'>
                                            <div className='absolute inset-0 flex items-center'>
                                                <span className='w-full border-t border-neutral-700' />
                                            </div>
                                            <div className='relative flex justify-center text-xs uppercase'>
                                                <span className='bg-black px-2 text-neutral-400'>or</span>
                                            </div>
                                        </div>

                                        <div className='space-y-3'>
                                            <p className='text-sm text-neutral-400'>Type <span className='font-bold text-white'>"{renderSampleText()}"</span> to authenticate</p>

                                            <div className="flex w-full max-w-sm items-center space-x-2">
                                                <Input
                                                    ref={inputRef}
                                                    type="text"
                                                    id="characters"
                                                    placeholder="Enter the characters"
                                                    value={formData.characters}
                                                    onChange={handleInputChange}
                                                    onKeyDown={handleKeyDown}
                                                    onKeyUp={handleKeyUp}
                                                    disabled={isLoading || formData.password.length > 0}
                                                />
                                                <Button
                                                    type="button"
                                                    onClick={handleReset}
                                                    variant="destructive"
                                                >
                                                    Reset
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div>
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        type="password"
                                        id="password"
                                        placeholder="Password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        disabled={isLoading}
                                    />
                                    <p className="text-sm text-neutral-400 mt-1">
                                        Password must be at least 8 characters
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className='space-y-3'>
                            <Button
                                type="submit"
                                variant="default"
                                className='w-full font-medium bg-blue-600 hover:bg-blue-700 text-white'
                                disabled={!isFormValid() || isLoading}
                            >
                                {isLoading ? "Processing..." : isSignIn ? "Sign In" : "Sign Up"}
                            </Button>
                            <Link to="/" className="block">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className='w-full font-medium'
                                    disabled={isLoading}
                                >
                                    Go back
                                </Button>
                            </Link>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col">
                    <p className='text-white/60 text-center text-sm my-2'>
                        {isSignIn ? "Don't have an account?" : "Already have an account?"}
                        <span
                            className='font-semibold cursor-pointer pl-1 text-blue-400 hover:text-blue-300'
                            onClick={toggleAuth}
                        >
                            {isSignIn ? "Sign up" : "Sign in"}
                        </span>
                    </p>
                    <div className='flex flex-col items-center w-full text-white/60'>
                        <Separator className="bg-neutral-700" />
                        <div className='flex items-center space-x-1 mt-3'>
                            <p className='text-sm'>Secured by </p>
                            <Logo optionalSize="h-7" />
                        </div>
                    </div>
                </CardFooter>
            </Card>
        </main>
    )
}

export default Auth