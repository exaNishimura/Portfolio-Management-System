import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  text?: string;
  variant?: "default" | "dots" | "pulse" | "bounce";
}

export function LoadingSpinner({ 
  size = "md", 
  className, 
  text,
  variant = "default"
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8", 
    lg: "h-12 w-12",
    xl: "h-16 w-16"
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg", 
    xl: "text-xl"
  };

  if (variant === "dots") {
    return (
      <div className={cn("flex flex-col items-center justify-center space-y-4", className)}>
        <div className="flex space-x-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={cn(
                "rounded-full bg-primary animate-bounce",
                size === "sm" ? "h-2 w-2" : 
                size === "md" ? "h-3 w-3" :
                size === "lg" ? "h-4 w-4" : "h-5 w-5"
              )}
              style={{
                animationDelay: `${i * 0.1}s`,
                animationDuration: "0.6s"
              }}
            />
          ))}
        </div>
        {text && (
          <p className={cn("text-muted-foreground", textSizeClasses[size])}>
            {text}
          </p>
        )}
      </div>
    );
  }

  if (variant === "pulse") {
    return (
      <div className={cn("flex flex-col items-center justify-center space-y-4", className)}>
        <div
          className={cn(
            "rounded-full bg-primary animate-pulse",
            sizeClasses[size]
          )}
        />
        {text && (
          <p className={cn("text-muted-foreground animate-pulse", textSizeClasses[size])}>
            {text}
          </p>
        )}
      </div>
    );
  }

  if (variant === "bounce") {
    return (
      <div className={cn("flex flex-col items-center justify-center space-y-4", className)}>
        <div
          className={cn(
            "rounded-full bg-primary animate-bounce",
            sizeClasses[size]
          )}
        />
        {text && (
          <p className={cn("text-muted-foreground", textSizeClasses[size])}>
            {text}
          </p>
        )}
      </div>
    );
  }

  // Default spinner
  return (
    <div className={cn("flex flex-col items-center justify-center space-y-4", className)}>
      <div
        className={cn(
          "animate-spin rounded-full border-2 border-muted border-t-primary",
          sizeClasses[size]
        )}
      />
      {text && (
        <p className={cn("text-muted-foreground", textSizeClasses[size])}>
          {text}
        </p>
      )}
    </div>
  );
} 