import React, { useState, useEffect } from "react";
import { Form, Input, Button, Alert, Spin, notification } from "antd";
import { DollarOutlined, CreditCardOutlined } from "@ant-design/icons";
import { useAuth } from "../../contexts/authContext";

export const WithdrawForm: React.FC = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [fetchingAccount, setFetchingAccount] = useState(true);
    const [accountNumber, setAccountNumber] = useState<number | null>(null);
    const [availableBalance, setAvailableBalance] = useState<number>(0);

    const userId = useAuth().user?.user_id;

    useEffect(() => {
        const fetchAccount = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/savings-accounts/account/${userId}`);
                if (!res.ok) throw new Error("Failed to fetch account info");
                const data = await res.json();
                setAccountNumber(data.account_number);
                setAvailableBalance(data.current_balance);
                form.setFieldsValue({ account_id: data.account_number });
            } catch (err: any) {
                notification.error({ message: "Error", description: err.message || "Could not load account info" });
            } finally {
                setFetchingAccount(false);
            }
        };
        fetchAccount();
    }, [form, userId]);

    const generateReference = () => `REF-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

    const onFinish = async (values: any) => {
        if (!accountNumber) {
            notification.error({ message: "Account not loaded", description: "Cannot proceed without account info." });
            return;
        }

        if (values.amount > availableBalance) {
            notification.error({ message: "Insufficient Funds", description: "You do not have enough balance." });
            return;
        }

        setLoading(true);

        const transaction = {
            account_id: accountNumber,
            type: "Withdrawal",
            amount: Number(values.amount),
            source_destination_name: values.source_destination_name,
            source_destination_account: values.source_destination_account,
            reference_number: generateReference(),
        };

        try {
            const res = await fetch("http://localhost:5000/api/transactions/withdraw", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(transaction),
            });

            if (!res.ok) throw new Error("Failed to process withdrawal");

            const data = await res.json();
            notification.success({
                message: "Withdrawal Successful",
                description: `You have withdrawn ${transaction.amount.toLocaleString()} RWF. Ref: ${data.withdrawal.reference_number}`,
            });

            setAvailableBalance((prev) => prev - transaction.amount);
            form.resetFields();
            form.setFieldsValue({ account_id: accountNumber });
        } catch (err: any) {
            notification.error({ message: "Withdrawal Failed", description: err.message || "Error processing withdrawal" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto py-4">
            <Alert
                message={`Available Balance: ${availableBalance.toLocaleString()} RWF`}
                type="info"
                showIcon
                className="mb-6"
            />

            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{ amount: 50000 }}
                className="dark:text-white"
            >
                <Form.Item
                    name="account_id"
                    label="Account Number"
                >
                    {fetchingAccount ? (
                        <Spin tip="Loading account..." />
                    ) : (
                        <Input
                            prefix={<CreditCardOutlined />}
                            disabled
                            value={accountNumber || ""}
                            className="dark:bg-slate-700 dark:text-white dark:border-slate-600"
                        />
                    )}
                </Form.Item>

                <Form.Item
                    name="amount"
                    label="Amount to Withdraw (RWF)"
                    rules={[{ required: true, message: "Enter withdrawal amount!" }]}
                >
                    <Input
                        prefix={<DollarOutlined />}
                        type="number"
                        placeholder="e.g., 50000"
                        max={availableBalance}
                        className="dark:bg-slate-700 dark:text-white dark:border-slate-600"
                    />
                </Form.Item>

                <Form.Item
                    name="source_destination_name"
                    label="Target Name (Bank/MTN/etc.)"
                    rules={[{ required: true, message: "Specify target name!" }]}
                >
                    <Input
                        placeholder="e.g., MTN Mobile Money"
                        className="dark:bg-slate-700 dark:text-white dark:border-slate-600"
                    />
                </Form.Item>

                <Form.Item
                    name="source_destination_account"
                    label="Target Account / Phone Number"
                    rules={[{ required: true, message: "Specify target account!" }]}
                >
                    <Input
                        placeholder="e.g., 0788123456"
                        className="dark:bg-slate-700 dark:text-white dark:border-slate-600"
                    />
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        danger
                        className="w-full"
                    >
                        Confirm Withdrawal
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};
