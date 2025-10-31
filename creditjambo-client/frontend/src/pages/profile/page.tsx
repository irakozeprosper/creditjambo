// src/pages/client/ClientProfile.tsx
import React from "react";
import { useAuth } from "../../contexts/authContext";
import { useQuery } from "@tanstack/react-query";
import { getClientProfile } from "../../api/clientService";

interface Client {
    first_name: string;
    last_name: string;
    user_id: string;
    email: string;
    phone_number: string;
    created_at: string;
}

const ClientProfile: React.FC = () => {
    const { user } = useAuth();

    // Fetch client info using logged-in user's ID
    const {
        data: client,
        isLoading,
        error,
    } = useQuery<Client>({
        queryKey: ["clientProfile", user?.user_id],
        queryFn: () => getClientProfile(user!.user_id),
        enabled: !!user,
    });

    const ProfileItem: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
        <div className="flex justify-between py-2 border-b border-gray-100 dark:border-slate-700 last:border-b-0">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</span>
            <span className="text-sm font-semibold text-gray-900 dark:text-slate-50">{value}</span>
        </div>
    );

    if (isLoading) return <div className="min-h-screen flex items-center justify-center text-gray-600 dark:text-gray-300">Loading profile...</div>;

    if (error || !client) return <div className="min-h-screen flex items-center justify-center text-red-600">Failed to load client data.</div>;

    return (
        <div className="bg-gray-100 dark:bg-gray-900 min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 transition-colors duration-500 font-sans">
            <div className="w-full max-w-2xl">
                <h1 className="text-3xl font-extrabold text-center mb-8 text-gray-900 dark:text-slate-50">Client Profile Overview</h1>

                <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 transition-colors duration-500">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 mb-8 pb-6 border-b dark:border-slate-700">
                        <div className="w-20 h-20 rounded-full bg-indigo-500 flex items-center justify-center text-white text-3xl font-bold">
                            {`${client.first_name.charAt(0).toUpperCase()}${client.last_name.charAt(0).toUpperCase()}`}
                        </div>
                    </div>

                    {/* Personal Details */}
                    <div className="mb-8">
                        <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 mb-4">Personal Details</h3>
                        <div className="space-y-1">
                            <ProfileItem
                                label="Email Address"
                                value={client.email}
                            />
                            <ProfileItem
                                label="Phone Number"
                                value={client.phone_number}
                            />
                            <ProfileItem
                                label="Date Joined"
                                value={client.created_at}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientProfile;
