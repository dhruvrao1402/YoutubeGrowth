import React from 'react';
import { Button } from './button';
import { cn } from '@/lib/utils';

interface RatingButtonProps {
  value: number;
  onChange: (value: number) => void;
  label: string;
  className?: string;
}

export const RatingButton: React.FC<RatingButtonProps> = ({ value, onChange, label, className }) => {
  return (
    <div className={cn("space-y-2", className)}>
      <label className="text-sm font-medium text-foreground">{label}</label>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((rating) => (
          <Button
            key={rating}
            type="button"
            variant={value === rating ? "default" : "outline"}
            size="sm"
            className={cn(
              "h-8 w-8 p-0 text-xs font-medium transition-all",
              value === rating 
                ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                : "hover:bg-muted"
            )}
            onClick={() => onChange(rating)}
          >
            {rating}
          </Button>
        ))}
      </div>
    </div>
  );
};
