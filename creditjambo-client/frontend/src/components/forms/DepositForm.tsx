import React, { useState, useEffect } from "react";
import { Form, Input, Button, Alert, Spin } from "antd";
import { DollarOutlined, CreditCardOutlined } from "@ant-design/icons";
import { useAuth } from "../../contexts/authContext";
import type { Transaction } from "../../types/transaction";

export const DepositForm: React.FC = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [fetchingAccount, setFetchingAccount] = useState(true);
    const [accountNumber, setAccountNumber] = useState<number | null>(null);
    const [accountId, setAccountId] = useState<number | null>(null);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const userId = useAuth().user?.user_id;
    console.log(userId);

    useEffect(() => {
        const fetchAccount = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/savings-accounts/account/${userId}`);
                if (!response.ok) throw new Error("Failed to fetch account details");
                const data = await response.json();

                setAccountNumber(data.account_number);
                setAccountId(data.account_id);
                form.setFieldsValue({ account_number: data.account_number });
            } catch (error: any) {
                setMessage({ type: "error", text: error.message || "Could not fetch account info." });
            } finally {
                setFetchingAccount(false);
            }
        };

        fetchAccount();
    }, [form, userId]);

    const onFinish = async (values: any) => {
        setLoading(true);
        setMessage(null);

        if (!accountNumber) {
            setMessage({ type: "error", text: "Account not loaded yet." });
            setLoading(false);
            return;
        }

        const transaction: Omit<Transaction, "transaction_id" | "transaction_date" | "reference_number"> = {
            account_id: accountId!,
            type: "Deposit",
            amount: Number(values.amount),
            status: "Pending",
            source_destination_name: values.source_destination_name,
            source_destination_account: values.source_destination_account,
        };

        try {
            const response = await fetch("http://localhost:5000/api/transactions/deposit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(transaction),
            });

            if (!response.ok) throw new Error("Failed to save transaction");
            const data = await response.json();

            setMessage({
                type: "success",
                text: `Successfully deposited ${transaction.amount.toLocaleString()} RWF. Ref: ${data.deposit.reference_number}`,
            });

            form.resetFields();
            form.setFieldsValue({ account_id: accountNumber });
        } catch (err: any) {
            setMessage({ type: "error", text: err.message || "Transaction failed." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto py-4">
            {message && (
                <Alert
                    message={message.text}
                    type={message.type}
                    showIcon
                    className="mb-6"
                />
            )}

            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{ amount: 10000 }}
                className="dark:text-white"
            >
                <Form.Item
                    name="account_number"
                    label={<span className="dark:text-slate-200">Account Number</span>}
                >
                    {fetchingAccount ? (
                        <Spin tip="Loading account..." />
                    ) : (
                        <Input
                            prefix={<CreditCardOutlined />}
                            disabled
                            value={accountNumber || ""}
                            placeholder="Account not found"
                            className="dark:bg-slate-700 dark:text-white dark:border-slate-600"
                        />
                    )}
                </Form.Item>

                <Form.Item
                    name="amount"
                    label={<span className="dark:text-slate-200">Deposit Amount (RWF)</span>}
                    rules={[{ required: true, message: "Please enter the amount!" }]}
                >
                    <Input
                        prefix={<DollarOutlined />}
                        type="number"
                        placeholder="e.g., 100000"
                        min={1000}
                        className="dark:bg-slate-700 dark:text-white dark:border-slate-600"
                    />
                </Form.Item>

                <Form.Item
                    name="source_destination_name"
                    label={<span className="dark:text-slate-200">Source Name (e.g., MTN, Equity Bank)</span>}
                    rules={[{ required: true, message: "Please specify the source name!" }]}
                >
                    <Input
                        placeholder="MTN Mobile Money"
                        className="dark:bg-slate-700 dark:text-white dark:border-slate-600"
                    />
                </Form.Item>

                <Form.Item
                    name="source_destination_account"
                    label={<span className="dark:text-slate-200">Source Account Number</span>}
                    rules={[{ required: true, message: "Please enter the source account number!" }]}
                >
                    <Input
                        type="number"
                        placeholder="e.g., 0788123456 or 123456789012"
                        className="dark:bg-slate-700 dark:text-white dark:border-slate-600"
                    />
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        className="w-full"
                    >
                        Confirm Deposit
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};
