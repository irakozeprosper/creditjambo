// src/components/layout/Sidebar.tsx

import { forwardRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { navbarLinks } from "../../constants";
// NOTE: PropTypes is only useful for non-TypeScript projects and can be removed, but kept here for 100% preservation
import PropTypes from "prop-types";
import { cn } from "../../utils/cn";
import logoDark from "../../assets/logoDark.png";
import logo from "../../assets/logo.png";

// 🚨 ADDED: Icon for toggling the collapsible state
import { CrownOutlined } from "@ant-design/icons";

interface SidebarProps {
    collapsed: boolean;
    setCollapsed?: (state: boolean) => void;
}

const Sidebar = forwardRef<HTMLDivElement, SidebarProps>(({ collapsed, setCollapsed }, ref) => {
    const { pathname } = useLocation(); // Get current path for default state check

    // 🚨 ADDED: State to manage which groups are open
    const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
        const initialState: Record<string, boolean> = {};
        navbarLinks.forEach((group) => {
            // Determine if the group contains the current active route
            const isActiveGroup = group.links.some(
                (link) =>
                    // Check if path is exact or starts with the link's path for nesting
                    pathname === link.path || (link.path !== "/" && pathname.startsWith(link.path))
            );

            // Default: Expand only the group that contains the active link.
            initialState[group.title] = isActiveGroup;
        });
        return initialState;
    });

    const handleNavigation = () => {
        if (!collapsed && setCollapsed) {
            setCollapsed(true);
        }
    };

    // Toggle handler for the group title
    const toggleGroup = (title: string) => {
        // Only allow toggling if the main sidebar is NOT collapsed
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
            {/* Logo */}
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

            {/* Navigation */}
            <div className="flex flex-col gap-2 overflow-y-auto overflow-x-hidden p-3 scrollbar-thin dark:text-gray-200">
                {navbarLinks.map((navbarLink, index) => {
                    const isGroupOpen = openGroups[navbarLink.title];

                    return (
                        <nav
                            key={navbarLink.title}
                            className={cn("flex flex-col", collapsed && "md:items-center")}
                        >
                            {/* Group Title and Toggle */}
                            <div
                                className={cn(
                                    "flex justify-between items-center p-2 transition-colors",
                                    // Use cursor pointer and hover styles only when NOT collapsed
                                    !collapsed && "cursor-pointer hover:bg-slate-300 dark:hover:bg-slate-700 rounded-md"
                                )}
                                onClick={() => toggleGroup(navbarLink.title)} // Only toggles when !collapsed
                            >
                                {/* Title Display */}
                                {!collapsed ? (
                                    <p className="sidebar-group-title text-sm font-semibold text-slate-500 dark:text-slate-400">{navbarLink.title}</p>
                                ) : (
                                    // Divider when main sidebar is collapsed
                                    index !== 0 && <div className="my-3 h-px w-full bg-slate-300 dark:bg-slate-700" />
                                )}

                                {/* Toggle Icon (Only visible when main sidebar is NOT collapsed) */}
                                {!collapsed && (
                                    <CrownOutlined className={cn("text-xs text-slate-500 transition-transform", isGroupOpen && "rotate-180")} />
                                )}
                            </div>

                            {/* 🚨 Links Container FIX */}
                            <div
                                className={cn(
                                    "overflow-hidden transition-all duration-300",
                                    // 🚨 FIX: If collapsed, set large max-height to show the icons.
                                    // If not collapsed, use the group toggle state (isGroupOpen).
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
                                                    // When collapsed, the link should be centered and wide
                                                    collapsed && "md:w-full md:justify-center"
                                                )
                                            }
                                        >
                                            <link.icon
                                                size={22}
                                                className="shrink-0"
                                            />
                                            {/* 🚨 PRESERVED: This correctly hides the text when collapsed */}
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
