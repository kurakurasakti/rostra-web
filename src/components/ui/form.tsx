"use client"

import * as React from "react"
import { useFormContext, Controller, type UseFormReturn } from "react-hook-form"
import { cn } from "@/lib/utils"

const Form = React.forwardRef<
  HTMLFormElement,
  React.ComponentProps<"form"> & {
    form: UseFormReturn<any>
    onSubmit?: (values: any) => void | Promise<void>
  }
>(({ className, form, onSubmit, children, ...props }, ref) => {
  const handleSubmit = onSubmit ? form.handleSubmit(onSubmit) : undefined
  return (
    <form
      ref={ref}
      className={cn("space-y-6", className)}
      onSubmit={handleSubmit}
      {...props}
    >
      {children}
    </form>
  )
})
Form.displayName = "Form"

const FormField = Controller

const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("space-y-2", className)} {...props} />
))
FormItem.displayName = "FormItem"

const FormLabel = React.forwardRef<
  HTMLLabelElement,
  React.ComponentProps<"label">
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)}
    {...props}
  />
))
FormLabel.displayName = "FormLabel"

const FormControl = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ ...props }, ref) => <div ref={ref} {...props} />)
FormControl.displayName = "FormControl"

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
FormDescription.displayName = "FormDescription"

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> & {
    children?: React.ReactNode | ((props: { errors: any }) => React.ReactNode)
  }
>(({ className, children, ...props }, ref) => {
  const context = useFormContext()
  const formState = context?.formState
  const message = typeof children === "function" ? children({ errors: formState?.errors }) : children

  return (
    <p
      ref={ref}
      className={cn("text-sm font-medium text-red-500", className)}
      {...props}
    >
      {message}
    </p>
  )
})
FormMessage.displayName = "FormMessage"

export {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
}
