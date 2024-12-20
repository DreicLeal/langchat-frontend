"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/input";
import api from "@/services/api";
import { loginSchema } from "@/schemas/loginSchema";
import { ZodError } from "zod";
import { useAuth } from "@/context/AuthContext";

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();

  // const { token } = useAuth(); // Obtém o token do contexto

  useEffect(() => {
    // if (typeof window !== "undefined") {
    const token = localStorage.getItem("@token");
    console.log(token);
    if (token) {
      router.push("/dashboard");
      // }
    }
  }, [router]);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      loginSchema.parse(formData);
      const res = await api.post("/login", formData);
      login(res.data.user, res.data.token);
      router.push("/dashboard"); // Redireciona após login bem-sucedido
    } catch (err: unknown) {
      if (err instanceof ZodError) {
        setError(err.errors[0].message); // Captura a mensagem de erro do Zod
      } else if (err instanceof Error) {
        setError(err.message); // Captura a mensagem genérica
      } else {
        setError("Credenciais inválidas. Tente novamente.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-center text-gray-700 mb-6">
          Login
        </h2>

        {/* Feedback de erro */}
        {error && (
          <div className="text-red-600 text-sm text-center mb-4">{error}</div>
        )}

        {/* Input de Email */}
        <Input
          id="email"
          name="email"
          type="email"
          label="Email"
          placeholder="Digite seu email"
          value={formData.email}
          onChange={handleChange}
          error={error ? "Email ou senha inválidos" : ""}
        />

        {/* Input de Senha */}
        <Input
          id="password"
          name="password"
          type="password"
          label="Senha"
          placeholder="Digite sua senha"
          value={formData.password}
          onChange={handleChange}
        />

        {/* Botão de Login */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
