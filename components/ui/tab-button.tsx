import {cn} from "@/lib/utils";
import * as React from "react";
import Image from "next/image";

export function TabButton({active, label, icon, onClick}: any) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "cursor-pointer flex flex-1 items-center justify-start px-2 gap-3 h-12 text-[#261A36] rounded-full border-2 border-black transition-all",
                active ? "bg-white": "bg-white/50 text-[#261A36]/50 border-black/50"
            )}
        >
            <div className={cn("p-1.5 rounded-full border-2 border-black shrink-0", active ? "bg-[#F7906E]" : "bg-[#F7906E]/50 border-black/50")}>
                <Image src={icon} width="20" height="20" alt="Icon"/>
            </div>
            <span className="font-extrabold font-display text-xl flex-1 text-center">{label}</span>
        </button>
    )
}
