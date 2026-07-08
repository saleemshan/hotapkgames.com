import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const sp = await searchParams;
  const safeNext = sp.next?.startsWith("/admin") ? sp.next : "/admin/analytics";

  return (
    <div className="flex min-h-[70vh] items-center justify-center p-6">
      <Card className="w-full max-w-md border-border/80 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="font-heading text-xl">Analytics admin</CardTitle>
          <CardDescription>Sign in to view Supabase event aggregates.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action="/api/admin/login" method="post" className="space-y-4">
            <input type="hidden" name="next" value={safeNext} />
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="bg-background/60"
              />
            </div>
            {sp.error ? (
              <p className="text-sm text-destructive" role="alert">
                Invalid password.
              </p>
            ) : null}
            <Button type="submit" className="w-full font-heading font-semibold">
              Continue
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center border-t border-border/60 pt-4">
          <Link href="/" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
            Back to site
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
