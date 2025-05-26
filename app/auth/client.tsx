"use client"

import { useState } from 'react';
import { signIn } from 'next-auth/react'; // Import signIn
import { useRouter } from 'next/navigation'; // Import useRouter for redirection
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";

interface AuthProps {
    get: (pageg: any, pageSizeg: any) => Promise<any>;
    deleted: (id: any) => Promise<any>;
    update: (data: any, id: any) => Promise<any>;
    create: (data: any) => Promise<any>;
    find: (data: any) => Promise<any>;
}

function Auth({ create }: AuthProps) { // Destructure create from props, add other props if needed later
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Add loading state
    const router = useRouter(); // Initialize router

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setIsLoading(true);
        try {
            const result = await signIn('credentials', {
                redirect: false, // Prevent NextAuth from redirecting automatically
                email,
                password,
            });

            if (result?.error) {
                setMessage(result.error === 'CredentialsSignin' ? 'Incorrect email or password.' : 'Login failed. Please try again.');
            } else if (result?.ok) {
                setMessage('Login successful!');
                // Redirect to dashboard or desired page after successful login
                router.push('/admin'); // Or router.refresh() if you want to stay on the same page
            }
        } catch (error) {
            console.error("Login error:", error);
            setMessage('An unexpected error occurred during login.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setIsLoading(true);
        try {
            const result = await create({ email, password, firstName, lastName });

            // Assuming 'create' function returns an object with 'error' or 'success' message
            // Adjust based on the actual structure of 'result' from regdbHandler
            if (result.error) {
                setMessage(result.error || 'Registration failed.');
            } else {
                setMessage(result.message || 'Registration successful! Please log in.');
                setIsLogin(true); // Switch to login form
                setFirstName('');
                setLastName('');
                // Optionally clear email and password too, or leave them for login
                // setEmail('');
                // setPassword('');
            }
        } catch (error) {
            console.error("Registration error:", error);
            setMessage('An unexpected error occurred during registration.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-16 p-8 border border-gray-200 rounded-xl shadow-lg bg-white">
            <h2 className="text-2xl font-bold mb-6 text-center">{isLogin ? 'Login' : 'Register'}</h2>
            {message && (
                <Alert variant={message.includes('Incorrect') || message.includes('failed') || message.includes('error') ? "destructive" : "default"} className="mb-6">
                    <AlertDescription>{message}</AlertDescription>
                </Alert>
            )}
            <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-5">
                <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="mt-1"
                        placeholder="Enter your email"
                        disabled={isLoading}
                    />
                </div>
                <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="mt-1"
                        placeholder="Enter your password"
                        disabled={isLoading}
                    />
                </div>
                {!isLogin && (
                    <>
                        <div>
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                                type="text"
                                id="firstName"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                                className="mt-1"
                                placeholder="First Name"
                                disabled={isLoading}
                            />
                        </div>
                        <div>
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                                type="text"
                                id="lastName"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                                className="mt-1"
                                placeholder="Last Name"
                                disabled={isLoading}
                            />
                        </div>
                    </>
                )}
                <Button type="submit" className="w-full mt-2">
                    {isLogin ? 'Login' : 'Register'}
                </Button>
            </form>
            <Button
                variant="link"
                className="w-full mt-4 text-blue-600"
                onClick={() => { setIsLogin(!isLogin); setMessage(''); }}
            >
                {isLogin ? "Don't have an account? Register" : "Already registered? Login"}
            </Button>
        </div>
    );
}

export default Auth;