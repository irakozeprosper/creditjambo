import { useEffect, useState } from "react";
import { useAuth } from "../contexts/authContext";

interface AccountData {
    account_id: number;
    account_number: string;
}

interface UseAccountResult {
    account: AccountData | null;
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export function useAccount(): UseAccountResult {
    const { user } = useAuth();
    const userId = user?.user_id;

    const [account, setAccount] = useState<AccountData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAccount = async () => {
        if (!userId) return;

        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`http://localhost:5000/api/savings-accounts/account/${userId}`);
            if (!response.ok) throw new Error("Failed to fetch account details");

            const data = await response.json();
            setAccount({
                account_id: data.account_id,
                account_number: data.account_number,
            });
        } catch (err: any) {
            setError(err.message || "Could not fetch account info.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAccount();
    }, [userId]);

    return { account, loading, error, refetch: fetchAccount };
}
