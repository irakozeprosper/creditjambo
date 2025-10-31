import { useEffect } from "react";

export const useClickOutside = (refs: any, callback: any) => {
    useEffect(() => {
        const handleOutsideClick = (event: any) => {
            const isOutside = refs.every((ref: any) => !ref?.current?.contains(event.target));

            if (isOutside && typeof callback === "function") {
                callback(event);
            }
        };

        window.addEventListener("mousedown", handleOutsideClick);

        return () => {
            window.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [callback, refs]);
};
