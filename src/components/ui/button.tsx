import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#635BDB] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none active:scale-[0.98]',
  {
    variants: {
      variant: {
        default:
          'bg-[#635BDB] text-white hover:bg-[#5249CE] shadow-sm hover:shadow-md hover:shadow-[#635BDB]/20',
        primary:
          'bg-gradient-to-r from-[#635BDB] to-[#8B5CF6] text-white hover:opacity-95 shadow-md shadow-[#635BDB]/25',
        secondary:
          'bg-[#EEF2FF] text-[#635BDB] hover:bg-[#E0E7FF] border border-[#C7D2FE]',
        outline:
          'border border-[#CBD5E1] bg-white text-[#111B35] hover:bg-[#F8FAFC] hover:border-[#94A3B8] shadow-xs',
        ghost:
          'text-[#111B35]/70 hover:text-[#111B35] hover:bg-gray-100/80',
        destructive:
          'bg-[#DC2626] text-white hover:bg-[#B91C1C] shadow-sm shadow-[#DC2626]/20',
        shimmer:
          'relative overflow-hidden bg-gradient-to-r from-[#635BDB] via-[#8B5CF6] to-[#635BDB] bg-[length:200%_auto] text-white hover:bg-[position:right_center] transition-[background-position] duration-500 shadow-md',
        dark:
          'bg-[#121520] text-[#F8F9FA] border border-white/15 hover:border-[#9D85FF]/50 hover:bg-[#171B2B] shadow-sm',
      },
      size: {
        default: 'h-10 px-4 py-2 text-sm',
        sm: 'h-8 rounded-lg px-3 text-xs',
        lg: 'h-12 rounded-xl px-6 text-base font-bold',
        icon: 'h-9 w-9 p-0 rounded-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };

