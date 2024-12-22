"use client";

import Login from "./login/page";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext"; // Importa o hook do AuthContext

export default function Home() {
  const router = useRouter();
  const { token } = useAuth(); // Obtém o token do contexto

  useEffect(() => {
    if (token) {
      router.push("/dashboard"); // Redireciona caso o usuário já esteja autenticado
    }
  }, [token, router]);

  return (
    <main>
      <Login />
    </main>
  );
}
