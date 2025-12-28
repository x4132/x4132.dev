import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CircleQuestionMark } from "lucide-react";

export default function HelpTooltip() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="fixed right-4 bottom-4 cursor-pointer">
          <CircleQuestionMark />
        </div>
      </TooltipTrigger>
      <TooltipContent className="bg-background text-foreground max-w-64">
        <p>
          What you're seeing is a simulation of a particle detector, inspired by
          the visual tracks on a bubble or cloud chamber.
        </p>
        <p className="text-muted-foreground mt-1">
          Animation made with 🩵 by me,{" "}
          <a
            href="https://github.com/x4132"
            target="_blank"
            className="text-foreground decoration-muted-foreground hover:decoration-foreground underline underline-offset-[3px] transition-colors duration-300 ease-in-out"
          >
            x4132
          </a>
          !
        </p>
        <p className="text-muted-foreground mt-1">
          Blog template made with 🤍 by{" "}
          <a
            href="https://github.com/jktrn"
            target="_blank"
            className="text-foreground decoration-muted-foreground hover:decoration-foreground underline underline-offset-[3px] transition-colors duration-300 ease-in-out"
          >
            enscribe
          </a>
          ! - (astro-erudite)
        </p>
      </TooltipContent>
    </Tooltip>
  );
}
