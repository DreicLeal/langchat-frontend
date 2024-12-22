"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { HeaderProps } from "./interfaces";


export default function Header({ title }: HeaderProps) {
    const router = useRouter()
  const { logout } = useAuth();

  const homePage = () => {
    router.push("/dashboard")
  }
  return (
    <header className="bg-blue-600 text-white p-4 flex items-center justify-between shadow-md w-full">
        <button onClick={homePage}>Início</button>
    <h1 className="text-xl font-bold">{title}</h1>
    <button
      onClick={logout}
      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition duration-200"
    >
      Sair
    </button>
  </header>
  );
}
