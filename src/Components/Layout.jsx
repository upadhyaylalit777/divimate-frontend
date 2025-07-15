import { Link } from "react-router-dom";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-blue-600 text-white p-4 flex justify-between">

      </header>

      <main className="flex-grow p-4 max-w-3xl mx-auto">
        {children}
      </main>

      
    </div>
  );
}
