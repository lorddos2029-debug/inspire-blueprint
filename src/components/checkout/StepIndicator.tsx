import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  currentStep: number;
  steps: string[];
}

const StepIndicator = ({ currentStep, steps }: StepIndicatorProps) => (
  <div className="flex items-center justify-center gap-2 mb-10">
    {steps.map((label, i) => {
      const step = i + 1;
      const isCompleted = currentStep > step;
      const isActive = currentStep === step;
      return (
        <div key={step} className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors",
                isCompleted && "bg-primary text-primary-foreground",
                isActive && "bg-primary text-primary-foreground",
                !isCompleted && !isActive && "bg-muted text-muted-foreground"
              )}
            >
              {isCompleted ? <Check className="w-4 h-4" /> : step}
            </div>
            <span
              className={cn(
                "text-sm font-medium hidden sm:inline",
                isActive ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={cn(
                "w-8 sm:w-12 h-0.5",
                currentStep > step ? "bg-primary" : "bg-muted"
              )}
            />
          )}
        </div>
      );
    })}
  </div>
);

export default StepIndicator;
