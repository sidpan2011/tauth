import { Loader } from "lucide-react";

export const Spinner = () => {
    return (
        <div className="flex flex-row min-h-screen justify-center items-center bg-black">
            <Loader className="animate-spin dark:text-white"/>
        </div>
    )
}