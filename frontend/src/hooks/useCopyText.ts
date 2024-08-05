import { useState } from "react"

import { copyText } from "@/lib/utils";


export const useCopyText = () => {
    const [isCopy, setIsCopy] = useState(false);

    const onCopy = (value: string) => {
        setIsCopy(true);
        copyText(value);

        setTimeout(() => {
            setIsCopy(false);
        }, 3000);
    }

    return { isCopy, onCopy };
}