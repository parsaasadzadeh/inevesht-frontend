import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request) {
  const secret = request.nextUrl.searchParams.get("secret");

  // یک رمز ساده برای اینکه هرکسی نتونه این روت رو الکی صدا بزنه
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ revalidated: false, message: "رمز نامعتبر" }, { status: 401 });
  }

  try {
    revalidatePath("/");            // صفحه‌ی اصلی
    revalidatePath("/sitemap.xml"); // خود سایت‌مپ

    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (err) {
    return NextResponse.json({ revalidated: false, error: err.message }, { status: 500 });
  }
}
