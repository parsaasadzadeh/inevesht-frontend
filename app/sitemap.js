import { getAllPosts } from "./services/api";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://inevesht.ir";

export const revalidate = 60;

export default async function sitemap() {
  const staticPages = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
  ];

  let postPages = [];
  try {
    const data = await getAllPosts();
    postPages = (data?.posts || []).map((post) => ({
      // encodeURI کاراکترهای فارسی، ؟، و باقی موارد غیرمجاز توی URL/XML رو درست انکود می‌کند
      url: encodeURI(`${BASE_URL}/post/${post.slug}`),
      lastModified: new Date(post.updatedAt || post.createdAt),
      changeFrequency: "weekly",
      priority: 0.8,
    }));
  } catch {
    postPages = [];
  }

  return [...staticPages, ...postPages];
}
