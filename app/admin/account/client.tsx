"use client";

import { useState, useEffect } from 'react';
import ImageUpload from '../../../components/ImageUpload';
import { DynamicForm, FieldDefinition } from "@/components/ui/dynamicForm";

interface UserProfile {
    id?: string; // Assuming API might return/use it, though not explicitly in GET select
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    city?: string;
    state?: string; // To match backend PUT expectation (json.state)
    zipCode?: string; // To match backend PUT expectation (json.zipCode)
}

interface AccountClientPageProps {
    initialUser: UserProfile | null;
}

function AccountPage({ initialUser, update }: any) {
    const [user, setUser] = useState<UserProfile | null>(initialUser);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(!initialUser && !loading ? 'Failed to load user data from server.' : null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        if (initialUser) {
            setUser(initialUser);
            setError(null);
        } else {
            setError('User data could not be loaded.');
        }
    }, [initialUser]);

    const handleSubmit = async (formData: any) => {
        if (!user) return;

        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        // Prepare data for PUT request, ensuring names match backend expectations
        const profileDataToUpdate = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            city: formData.city,
            state: formData.state, // Ensure this is 'state' for the backend
            zipCode: formData.zipCode, // Ensure this is 'zipCode' for the backend
        };
        console.log(formData);
        
        try {
           const response = await update(formData, initialUser.id)
            setSuccessMessage('Profile updated successfully!');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred while updating');
        } finally {
            setLoading(false);
        }
    };

    const fields: FieldDefinition[] = [
        { name: 'firstName', label: 'First Name', type: 'String', input: 'input', inputType: 'text', required: true },
        { name: 'lastName', label: 'Last Name', type: 'String', input: 'input', inputType: 'text', required: true },
        { name: 'email', label: 'Email', type: 'String', input: 'input', inputType: 'email', required: true },
        { name: 'phone', label: 'Phone', type: 'String', input: 'input', inputType: 'tel', required: false },
        { name: 'avatar', label: 'Avatar', type: 'String', input: 'input', inputType: 'file', required: false },
    ];

    if (!initialUser && !loading && !successMessage) {
        return <div className="container mx-auto p-4"><p className="text-red-500 bg-red-100 p-2 mb-4 rounded">Error: {error || 'Could not load user profile.'}</p><p>Please try refreshing the page or contact support.</p></div>;
    }

    if (loading) {
        return <div className="container mx-auto p-4"><p>Saving profile...</p></div>;
    }

    if (!user && !loading) {
        return <div className="container mx-auto p-4"><p>Loading profile...</p></div>;
    }

    if (error && !successMessage) {
        return <div className="container mx-auto p-4"><p className="text-red-500 bg-red-100 p-2 mb-4 rounded">Error: {error}</p><p>Please try refreshing the page or contact support.</p></div>;
    }

    if (!user && !loading) {
        return <div className="container mx-auto p-4"><p>No user profile data found. {error}</p></div>;
    }

    return (
        <div className="container mx-auto p-4 max-w-2xl">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Account Settings</h1>
            <ImageUpload />
            {successMessage && <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert"><p className="font-bold">Success</p><p>{successMessage}</p></div>}
            {error && !successMessage && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert"><p className="font-bold">Error</p><p>{error}</p></div>}

            {user && (
                <DynamicForm
                    fields={fields}
                    initialData={user}
                    onSubmit={handleSubmit}
                    submitButtonText="Save Changes"
                    isLoading={loading}
                    error={error}
                    className="space-y-6 bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
                />
            )}
        </div>
    );
}

export default AccountPage;
