import Link from "next/link";
import { getSinglePost, getAllPosts } from "../../services/api";
import { notFound } from "next/navigation";

// ✅ Pre-generate all routes statically (for sitemap and performance)
export async function generateStaticParams() {
  const data = await getAllPosts();
  return (data?.posts || []).map((post) => ({
    slug: post.slug,
  }));
}

// ✅ Dynamic metadata for SEO
export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    const data = await getSinglePost(decodeURIComponent(slug));
    const post = data.post;
    return {
      title: `${post.title} | وبلاگ من`,
      description: post.body?.replace(/<[^>]+>/g, "").substring(0, 160),
      openGraph: {
        title: post.title,
        images: [`${process.env.NEXT_PUBLIC_API_URL}/uploads/thumbnails/${post.thumbnail}`],
      },
    };
  } catch {
    return { title: "مقاله یافت نشد" };
  }
}

export const revalidate = 60;

export default async function SinglePost({ params }) {
  const { slug } = await params;

  let post;
  try {
    const data = await getSinglePost(decodeURIComponent(slug));
    post = data.post;
  } catch {
    notFound();
  }

  if (!post) notFound();

  // JSON-LD structured data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    image: `${process.env.NEXT_PUBLIC_API_URL}/uploads/thumbnails/${post.thumbnail}`,
    datePublished: post.createdAt,
    author: { "@type": "Person", name: post.user?.fullname || "مدیر سایت" },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="sp-page" dir="rtl">
        <div className="sp-body">
          <aside className="sp-sidebar">
            <div className="sp-sidebar-card">
              <h2 className="sp-sidebar-title">عضویت در خبرنامه</h2>
              <input className="sp-input" type="text" placeholder="نام" aria-label="نام" />
              <input className="sp-input" type="email" placeholder="ایمیل" aria-label="ایمیل" />
              <button className="sp-subscribe-btn">ثبت</button>
            </div>
          </aside>

          <main className="sp-main">
            <figure className="sp-hero-figure">
              <img
                src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/thumbnails/${post.thumbnail}`}
                alt={post.title}
                className="sp-hero-img"
              />
            </figure>

            <article className="sp-article">
              <h1 className="sp-article-title">{post.title}</h1>
              <div className="sp-article-meta">
                <span>توسط {post.user?.fullname || "مدیر سایت"}</span>
                <span>{new Date(post.createdAt).toLocaleDateString("fa-IR")}</span>
              </div>
              <div
                className="sp-content"
                dangerouslySetInnerHTML={{ __html: post.body }}
              />
            </article>

            <Link href="/" className="sp-back-link">
              → بازگشت به لیست مقالات
            </Link>
          </main>
        </div>
      </div>
    </>
  );
}