"use client";

import { useEffect } from "react";
import Error from "next/error";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { RefreshCw } from "lucide-react";

export default function OrdersError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Orders page error:", error);
    }, [error]);

    return (
        <div className="flex min-h-[400px] items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-destructive">
                        Orders Error
                    </CardTitle>
                    <CardDescription>
                        Failed to load orders. Please try again.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        {error.message || "Unable to fetch orders data. Please refresh to try again."}
                    </p>
                    {error.digest && (
                        <p className="mt-2 text-xs text-muted-foreground">
                            Error ID: {error.digest}
                        </p>
                    )}
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                    <Button onClick={reset} variant="default">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Try Again
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
