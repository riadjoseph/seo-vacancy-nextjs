export default function Custom404() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold">404</h1>
        <p className="mt-2">Page Not Found</p>
        <a href="/" className="text-blue-600 hover:underline mt-4 inline-block">
          Return Home
        </a>
      </div>
    </div>
  );
}
