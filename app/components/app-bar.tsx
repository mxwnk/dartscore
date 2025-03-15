import { Button } from "@/components/ui/button";
import { TargetIcon } from "lucide-react";

type NagivationProps = {
    title: string;
}

export function Navigation(props: NagivationProps) {
    return (
        <div className="bg-primary text-primary-foreground p-4 flex items-center">
            <Button variant="ghost" size="icon" asChild>
                <a href="/">
                    <TargetIcon className="h-6 w-6" />
                </a>
            </Button>
            <h1 className="text-lg font-semibold ml-4 flex-grow">{props.title}</h1>
        </div>
    );

}