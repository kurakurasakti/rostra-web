import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

import { CheckIcon, ChevronDown } from "lucide-react"

const Select = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    value?: string
    onValueChange?: (value: string) => void
    children: React.ReactNode
    disabled?: boolean
  }
>(({ className, children, value, onValueChange, disabled, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="select"
    className={cn("relative", className)}
    {...props}
  >
    {children}
  </div>
))
Select.displayName = "Select"

const SelectTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button">
>(({ className, children, ...props }, ref) => (
  <button
    ref={ref}
    data-slot="select-trigger"
    className={cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className
    )}
    {...props}
  >
    {children}
    <ChevronDown className="h-4 w-4 opacity-50" />
  </button>
))
SelectTrigger.displayName = "SelectTrigger"

const SelectValue = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<"span"> & { placeholder?: string }
>(({ className, placeholder, ...props }, ref) => (
  <span
    ref={ref}
    data-slot="select-value"
    className={cn("block truncate", className)}
    {...props}
  >
    {placeholder}
  </span>
))
SelectValue.displayName = "SelectValue"

const SelectContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & { position?: "popper" | "item-aligned" }
>(({ className, children, position = "popper", ...props }, ref) => (
  <div
    ref={ref}
    data-slot="select-content"
    className={cn(
      "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      position === "popper" &&
        "radix-select-content:data-[side=bottom]:translate-y-1 radix-select-content:data-[side=left]:-translate-x-1 radix-select-content:data-[side=right]:translate-x-1 radix-select-content:data-[side=top]:-translate-y-1",
      className
    )}
    {...props}
  >
    <div className="overflow-y-auto p-1">
      <SelectViewport>{children}</SelectViewport>
    </div>
  </div>
))
SelectContent.displayName = "SelectContent"

const SelectViewport = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="select-viewport"
    className={cn("p-1", className)}
    {...props}
  />
))
SelectViewport.displayName = "SelectViewport"

const SelectItem = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & { value: string }
>(({ className, children, value, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="select-item"
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
    data-value={value}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <CheckIcon className="h-4 w-4 opacity-0 data-[selected]:opacity-100" />
    </span>
    <span className="truncate">{children}</span>
  </div>
))
SelectItem.displayName = "SelectItem"

const SelectSeparator = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="select-separator"
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
))
SelectSeparator.displayName = "SelectSeparator"

const SelectScrollUpButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button">
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    data-slot="select-scroll-up-button"
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronDown className="h-4 w-4 rotate-180" />
  </button>
))
SelectScrollUpButton.displayName = "SelectScrollUpButton"

const SelectScrollDownButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button">
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    data-slot="select-scroll-down-button"
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </button>
))
SelectScrollDownButton.displayName = "SelectScrollDownButton"

export {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectViewport,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
}
