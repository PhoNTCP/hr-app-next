export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-4">Welcome to HR App</h1>
      <p className="mb-6">Start by editing <code>src/app/page.tsx</code></p>
      <div className="bg-red-500 text-white p-4">
      Tailwind is working!
      </div>
      <div className="flex gap-4">
        <a
          href="/register"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Register
        </a>
        <a
          href="/login"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Login
        </a>
      </div>
    </div>
  );
}
