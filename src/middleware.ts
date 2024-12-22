import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("@token");

  // Rota protegida: redirecionar se o usuário não estiver autenticado
  if (!token && req.nextUrl.pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Impedir acesso à página de login se o usuário estiver autenticado
  if (token && req.nextUrl.pathname === "/login") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/", "/login"], // Rotas afetadas pelo middleware
};
