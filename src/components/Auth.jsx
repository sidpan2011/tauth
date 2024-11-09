import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import { toast } from '../hooks/use-toast'
import { Separator } from './ui/separator'
import Logo from './Logo'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { emailSchema, passwordSchema } from '../lib/schemas'
import axios from 'axios'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { useAtom } from 'jotai'
import { hydratedAuthAtom } from '../store/store'

const BASE_URL = import.meta.env.VITE_AUTH_BASE_URL
const GOOD_SAMPLE_TEXTS = [
    "the quick brown fox jumps over",        // 26 chars
    "typing this phrase to verify myself",    // 32 chars
    "hello world how are you today friend",   // 33 chars
    "please type this to confirm identity",   // 34 chars
    "a simple phrase to show my typing style" // 36 chars
];
const sampleText = GOOD_SAMPLE_TEXTS[Math.floor(Math.random() * GOOD_SAMPLE_TEXTS.length)]
console.log(sampleText);
console.log(BASE_URL);

const Auth = () => {
    const navigate = useNavigate()
    const [, setAuth] = useAtom(hydratedAuthAtom)
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        characters: ''
    })
    const [isSignIn, setIsSignIn] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const handleInputChange = (e) => {
        const { id, value } = e.target
        setFormData(prev => ({
            ...prev,
            [id]: value
        }))
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
                    icon: <AlertCircle className="h-5 w-5 text-red-500" />,
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
                            const authData = {
                                isAuthenticated: true,
                                user: response.data.user,
                                sessionStart: new Date().getTime() // Add session start time
                            };
                            setAuth(authData)
                            toast({
                                icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
                                title: "Sign In Successful",
                                description: "Welcome back!"
                            })
                            navigate('/dashboard')
                            setFormData({ email: '', password: '', characters: '' })
                        }
                    } catch (error) {
                        toast({
                            icon: <AlertCircle className="h-5 w-5 text-red-500" />,
                            title: "Sign In Failed",
                            description: error.response?.data?.message || "Invalid credentials",
                            variant: "destructive"
                        })
                    }
                } else if (formData.characters === sampleText) {
                    // For now, just show success toast for character matching
                    toast({
                        icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
                        title: "Pattern Matched",
                        description: "Character pattern authentication successful!"
                    })
                    setFormData({ email: '', password: '', characters: '' })
                }
            } else {
                // Handle sign up
                const passwordResult = passwordSchema.safeParse(formData.password)
                console.log("else block for sign up");
                if (!passwordResult.success) {
                    toast({
                        icon: <AlertCircle className="h-5 w-5 text-red-500" />,
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
                            user: response.data.user,
                            sessionStart: new Date().getTime() // Add session start time
                        };
                        setAuth(authData)
                        toast({
                            icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
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
                                    <div className='space-y-2'>
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

                                        <div className='space-y-2'>
                                            <p className='text-sm text-neutral-400'>Type <span className='font-bold text-white'>"{sampleText}"</span> to authenticate</p>
                                            <Input
                                                type="text"
                                                id="characters"
                                                placeholder="Enter the characters"
                                                value={formData.characters}
                                                onChange={handleInputChange}
                                                disabled={isLoading || formData.password.length > 0}
                                            />
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
                                    variant="destructive"
                                    className='w-full font-medium'
                                    disabled={isLoading}
                                >
                                    Cancel
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