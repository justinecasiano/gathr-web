import { useState, useEffect } from 'react';

export const useSkeleton = (isFetching: boolean, delay: number = 400) => {
    const [showSkeleton, setShowSkeleton] = useState(true);

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;

        if (isFetching) {
            setShowSkeleton(true);
        } else {
            timer = setTimeout(() => {
                setShowSkeleton(false);
            }, delay);
        }

        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [isFetching, delay]);

    return showSkeleton;
};