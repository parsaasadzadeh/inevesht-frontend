// Blog homepage - lists all articles with filter support
// This is a Server Component and fetches data directly from the API

import Link from "next/link";
import { getAllPosts } from "./services/api";
import SearchBox from "./components/searchBox";
import { Suspense } from "react";

// Page metadata for SEO
export const metadata = {
  title: "آخرین مقالات | وبلاگ من",
  description: "جدیدترین مطالب آموزشی و تحلیلی را اینجا بخوانید",
};

// Page revalidates every 60 seconds (ISR)
export const revalidate = 60;

export default async function HomePage({ searchParams }) {
  // We await searchParams because it became async in Next.js 15+
  const params = await searchParams;
  const filter = params?.filter || "";

  // Fetch all posts from the API
  const data = await getAllPosts();
  const posts = data?.posts || [];

  // If data is null, the server is offline or returned an error
  const isOffline = !data;

  // Filter posts based on search text (case-insensitive)
  const filteredPosts = posts.filter((post) =>
    post.title?.toLowerCase().includes(filter.toLowerCase())
  );

  // Strip HTML tags from post content and truncate for excerpt display
  function stripHtml(html) {
    return (html || "").replace(/<[^>]+>/g, "").substring(0, 110);
  }

  return (
    <div className="hp-page" dir="rtl">
      {/* Hero section - title and search box */}
      <div className="hp-hero">
        <h1 className="hp-hero-title">آخرین مقالات وبلاگ</h1>
        <p className="hp-hero-sub">جدیدترین مطالب آموزشی و تحلیلی را اینجا بخوانید</p>

        {/* SearchBox is wrapped in Suspense because it uses useSearchParams */}
        <Suspense fallback={null}>
          <SearchBox />
        </Suspense>
      </div>

      <div className="hp-container">
        {isOffline ? (
          // Server is unavailable
          <div className="hp-empty">
            <p>⏳ سرور در حال بروزرسانی است، به زودی برمی‌گردیم</p>
          </div>
        ) : filteredPosts.length > 0 ? (
          // Display article cards
          <div className="hp-grid">
            {filteredPosts.map((post) => (
              <article key={post._id} className="hp-card">
                {/* Post thumbnail image */}
                <div className="hp-card-img-wrap">
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/thumbnails/${post.thumbnail}`}
                    alt={post.title}
                    className="hp-card-img"
                    loading="lazy" // lazy load for better performance
                  />
                </div>

                <div className="hp-card-body">
                  <h2 className="hp-card-title">{post.title}</h2>

                  {/* Post excerpt with HTML tags stripped */}
                  <p className="hp-card-excerpt">{stripHtml(post.body)}...</p>

                  <div className="hp-card-footer">
                    {/* Publication date in Jalali (Persian) format */}
                    <span className="hp-card-meta">
                      {new Date(post.createdAt).toLocaleDateString("fa-IR")}
                    </span>

                    <Link href={`/post/${post.slug}`} className="hp-read-more">
                      ادامه مطلب ←
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          // No posts found for this filter
          <div className="hp-empty">
            <p>هیچ نتیجه‌ای برای &ldquo;{filter}&rdquo; یافت نشد</p>
          </div>
        )}
      </div>
    </div>
  );
}