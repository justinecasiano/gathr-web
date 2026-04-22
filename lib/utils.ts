import {clsx, type ClassValue} from "clsx"
import {twMerge} from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const getURL = () => {
    const envUrl = process.env.NEXT_PUBLIC_SITE_URL;

    let url = envUrl ||
        (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');

    url = url.includes('http') ? url : `https://${url}`;
    url = url.charAt(url.length - 1) === '/' ? url.slice(0, -1) : url;
    return url;
};