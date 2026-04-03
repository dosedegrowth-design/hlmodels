import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

async function getUserRole(supabase: any, userId: string): Promise<string | null> {
  const { data } = await supabase.rpc("get_user_role", { user_id: userId });
  return data ?? null;
}

async function getMarcaStatus(supabase: any, userId: string): Promise<string | null> {
  const { data } = await supabase.rpc("get_marca_status", { p_user_id: userId });
  return data ?? null;
}

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // --- ADMIN ROUTES ---
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    if (!user) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    const role = await getUserRole(supabase, user.id);
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Redirect logged-in admins away from admin login
  if (pathname === "/admin/login" && user) {
    const role = await getUserRole(supabase, user.id);
    if (role === "admin") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  // --- MARCAS ROUTES ---
  const publicMarcasRoutes = ["/marcas/login", "/marcas/registro"];
  const isMarcasProtected =
    pathname.startsWith("/marcas") && !publicMarcasRoutes.includes(pathname);

  if (isMarcasProtected) {
    if (!user) {
      return NextResponse.redirect(new URL("/marcas/login", request.url));
    }

    // Admins should NOT be redirected to aguardando - send them to admin panel
    const role = await getUserRole(supabase, user.id);
    if (role === "admin") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    // Allow aguardando page always for logged-in brand users
    if (pathname === "/marcas/aguardando") {
      return supabaseResponse;
    }

    // Check marca status using SECURITY DEFINER function (bypasses RLS)
    const marcaStatus = await getMarcaStatus(supabase, user.id);

    if (!marcaStatus || marcaStatus !== "aprovada") {
      return NextResponse.redirect(
        new URL("/marcas/aguardando", request.url)
      );
    }
  }

  // Redirect logged-in brands away from marcas login
  if (pathname === "/marcas/login" && user) {
    const role = await getUserRole(supabase, user.id);
    // If admin is on marcas login, redirect to admin
    if (role === "admin") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    // If approved brand, redirect to dashboard
    const marcaStatus = await getMarcaStatus(supabase, user.id);
    if (marcaStatus === "aprovada") {
      return NextResponse.redirect(new URL("/marcas", request.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/admin/:path*", "/marcas/:path*"],
};
