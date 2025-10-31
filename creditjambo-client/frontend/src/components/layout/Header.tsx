import React, { useState } from "react";
import { Button } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined, BellOutlined, UserOutlined, SettingOutlined } from "@ant-design/icons";
import { cn } from "../../utils/cn";
import { Link } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../hooks/use-theme";
import { useNavigate } from "react-router-dom";
import { useLogoutService } from "../../services/logoutService";
import { useAuth } from "../../contexts/authContext";

interface HeaderProps {
    collapsed: boolean;
    setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Header: React.FC<HeaderProps> = ({ collapsed, setCollapsed }) => {
    const { user } = useAuth();
    const { handleLogout } = useLogoutService();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const { theme, setTheme } = useTheme();
    return (
        <header className="sticky top-0 z-40 flex h-[60px] items-center justify-between border-b border-slate-200 bg-slate-200 px-4 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center">
                <Button
                    type="text"
                    size="large"
                    className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                    onClick={() => setCollapsed(!collapsed)}
                    icon={collapsed ? <MenuUnfoldOutlined className="text-xl" /> : <MenuFoldOutlined className="text-xl" />}
                />
                <button
                    className="btn-ghost size-10"
                    onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                >
                    <Sun
                        size={20}
                        className="dark:hidden"
                    />
                    <Moon
                        size={20}
                        className="hidden dark:block text-white"
                    />
                </button>

                <span className={cn("ml-4 hidden text-lg font-semibold text-slate-800 dark:text-slate-100", collapsed ? "md:block" : "sm:block")}>
                    Dashboard
                </span>
            </div>

            <div className="flex items-center gap-x-3">
                <Link
                    to="/settings"
                    title="Settings"
                >
                    <Button
                        type="text"
                        shape="circle"
                        icon={<SettingOutlined className="text-xl" />}
                        className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    />
                </Link>

                <Link
                    to="/notifications"
                    title="Notifications"
                >
                    <Button
                        type="text"
                        shape="circle"
                        icon={
                            <div className="relative">
                                <BellOutlined className="text-xl" />

                                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900" />
                            </div>
                        }
                        className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    />
                </Link>

                <button
                    onClick={() => setOpen(!open)}
                    className="group flex items-center gap-x-2 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-indigo-500 text-white font-medium text-sm border-2 border-indigo-500 transition-all group-hover:bg-indigo-600">
                        <UserOutlined />
                    </div>

                    <div className="hidden sm:block text-left">
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-50 leading-none">
                            {`${user?.first_name} ${user?.last_name}`}{" "}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-none">Customer</p>
                    </div>
                </button>
                {open && (
                    <div className="absolute right-0 top-14 w-48 rounded-md border border-gray-200 bg-white shadow-md dark:border-slate-700 dark:bg-slate-800 z-50">
                        <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 font-medium border-b border-gray-200 dark:border-slate-600">
                            Signed in as
                            <div className="truncate text-blue-600 dark:text-blue-300">{user?.email}</div>
                        </div>
                        <button
                            onClick={() => {
                                navigate("/profile");
                                setOpen(false);
                            }}
                            className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-slate-700"
                        >
                            View Profile
                        </button>
                        <button
                            onClick={() => {
                                handleLogout();
                                setOpen(false);
                            }}
                            className="block w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-red-50 dark:hover:bg-slate-700"
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};
