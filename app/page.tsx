"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-white dark:bg-black">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
        Welcome
      </h1>
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => router.push("/login")}
          className="rounded-full bg-blue-600 text-white px-6 py-2 hover:bg-blue-700 transition"
        >
          Login
        </button>
        <button
          onClick={() => router.push("/register")}
          className="rounded-full border border-blue-600 text-blue-600 px-6 py-2 hover:bg-blue-100 transition"
        >
          Register
        </button>
      </div>
    </div>
  );
}
