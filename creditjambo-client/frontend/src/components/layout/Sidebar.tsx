import { forwardRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { navbarLinks } from "../../constants";

import PropTypes from "prop-types";
import { cn } from "../../utils/cn";
import logoDark from "../../assets/logoDark.png";
import logo from "../../assets/logo.png";

import { CrownOutlined } from "@ant-design/icons";

interface SidebarProps {
    collapsed: boolean;
    setCollapsed?: (state: boolean) => void;
}

const Sidebar = forwardRef<HTMLDivElement, SidebarProps>(({ collapsed, setCollapsed }, ref) => {
    const { pathname } = useLocation();

    const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
        const initialState: Record<string, boolean> = {};
        navbarLinks.forEach((group) => {
            const isActiveGroup = group.links.some((link) => pathname === link.path || (link.path !== "/" && pathname.startsWith(link.path)));

            initialState[group.title] = isActiveGroup;
        });
        return initialState;
    });

    const handleNavigation = () => {
        if (!collapsed && setCollapsed) {
            setCollapsed(true);
        }
    };

    const toggleGroup = (title: string) => {
        if (!collapsed) {
            setOpenGroups((prev) => ({
                ...prev,
                [title]: !prev[title],
            }));
        }
    };

    return (
        <aside
            ref={ref}
            className={cn(
                "fixed z-50 top-0 left-0 h-full flex flex-col overflow-x-hidden border-r border-slate-300 bg-slate-200 transition-all duration-300 dark:border-slate-700 dark:bg-slate-900",
                collapsed ? "md:w-[70px] md:items-center" : "md:w-60",
                collapsed ? "max-md:-left-full" : "max-md:left-0"
            )}
        >
            <div className="flex items-center gap-3 p-3">
                <img
                    src={logoDark}
                    alt="Dark Logo"
                    className="w-10 dark:hidden"
                />
                <img
                    src={logo}
                    alt="Logo"
                    className="w-10 hidden dark:block"
                />
                {!collapsed && <p className="text-lg font-black uppercase text-slate-900 dark:text-slate-50 my-auto">CreditJambo</p>}
            </div>

            <div className="flex flex-col gap-2 overflow-y-auto overflow-x-hidden p-3 scrollbar-thin dark:text-gray-200">
                {navbarLinks.map((navbarLink, index) => {
                    const isGroupOpen = openGroups[navbarLink.title];

                    return (
                        <nav
                            key={navbarLink.title}
                            className={cn("flex flex-col", collapsed && "md:items-center")}
                        >
                            <div
                                className={cn(
                                    "flex justify-between items-center p-2 transition-colors",

                                    !collapsed && "cursor-pointer hover:bg-slate-300 dark:hover:bg-slate-700 rounded-md"
                                )}
                                onClick={() => toggleGroup(navbarLink.title)}
                            >
                                {!collapsed ? (
                                    <p className="sidebar-group-title text-sm font-semibold text-slate-500 dark:text-slate-400">{navbarLink.title}</p>
                                ) : (
                                    index !== 0 && <div className="my-3 h-px w-full bg-slate-300 dark:bg-slate-700" />
                                )}

                                {!collapsed && (
                                    <CrownOutlined className={cn("text-xs text-slate-500 transition-transform", isGroupOpen && "rotate-180")} />
                                )}
                            </div>

                            <div
                                className={cn(
                                    "overflow-hidden transition-all duration-300",

                                    collapsed ? "max-h-[9999px]" : isGroupOpen ? "max-h-[500px] mt-1" : "max-h-0"
                                )}
                            >
                                <div className="flex flex-col gap-2">
                                    {navbarLink.links.map((link) => (
                                        <NavLink
                                            key={link.label}
                                            to={link.path}
                                            onClick={handleNavigation}
                                            className={({ isActive }) =>
                                                cn(
                                                    "sidebar-item flex items-center gap-3 rounded-md p-2 transition-colors",
                                                    isActive
                                                        ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-400 font-medium"
                                                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800",

                                                    collapsed && "md:w-full md:justify-center"
                                                )
                                            }
                                        >
                                            <link.icon
                                                size={22}
                                                className="shrink-0"
                                            />

                                            {!collapsed && <p className="whitespace-nowrap my-2">{link.label}</p>}
                                        </NavLink>
                                    ))}
                                </div>
                            </div>
                        </nav>
                    );
                })}
            </div>
        </aside>
    );
});

Sidebar.displayName = "Sidebar";
Sidebar.propTypes = { collapsed: PropTypes.bool };

export { Sidebar };
