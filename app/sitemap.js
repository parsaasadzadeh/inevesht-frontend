import { getAllPosts } from "./services/api";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://inevesht.ir";

export const revalidate = 60;
// یا
// export const dynamic = "force-dynamic";

export default async function sitemap() {
  const staticPages = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
  ];

  try {
    const data = await getAllPosts();

    const posts = data?.posts || [];

    const postPages = posts.map((post) => ({
      url: `${BASE_URL}/post/${post.slug}`,
      lastModified: new Date(post.updatedAt || post.createdAt),
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    return [...staticPages, ...postPages];
  } catch {
    return staticPages;
  }
}
