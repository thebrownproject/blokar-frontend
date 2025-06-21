import Link from "next/link";

export default function ErrorPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6">
      <div className="bg-card rounded-lg border p-6 max-w-sm w-full">
        <div className="text-center">
          <h1 className="text-xl font-medium mb-2">Authentication Error</h1>
          <p className="text-muted-foreground text-sm mb-4">
            There was an error with your login. Please check your credentials
            and try again.
          </p>
          <Link
            href="/login"
            className="bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 inline-block"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
