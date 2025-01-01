"use client"
import Header from "@/components/header";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  const navigateToChat = () => {
    router.push("/chat");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Header title="Dashboard" />
      <main className="flex flex-col items-center justify-center flex-1 w-full max-w-4xl p-4">
        <h1 className="text-4xl font-bold text-gray-700 text-center mb-4">
          Bem-vindo ao Dashboard!
        </h1>
        <p className="text-gray-500 text-center text-lg mb-4">
          Aqui você pode gerenciar suas informações e acessar funcionalidades.
        </p>
        <button
          onClick={navigateToChat}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          Inicie um chat
        </button>
      </main>
      <footer className="w-full text-center p-4 bg-gray-200 text-gray-600">
        © 2024 LangChat. Todos os direitos reservados.
      </footer>
    </div>
  );
}