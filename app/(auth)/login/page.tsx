import { GalleryVerticalEnd } from "lucide-react";
import { login } from "./actions";

export default function LoginPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Acme Inc.
        </a>
        <form>
          <div className="bg-card rounded-lg border p-6">
            <div className="mb-6 text-center">
              <h1 className="text-xl font-medium">Welcome back</h1>
              <p className="text-muted-foreground text-sm">
                Login with your email and password
              </p>
            </div>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-2"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  className="w-full px-3 py-2 border border-input rounded-md"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium mb-2"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  className="w-full px-3 py-2 border border-input rounded-md"
                  required
                />
              </div>
              <button
                formAction={login}
                className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90"
              >
                Login
              </button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <a href="/register" className="underline">
                Sign up
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
