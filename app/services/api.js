// services/api.js

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://inevesht-backend-weblog.vercel.app";

async function fetchApi(endpoint, options = {}) {
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...options.headers,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "خطایی رخ داده است");
        }

        return data;
    } catch (error) {
        return null; 
    }
}


export const registerUser = async (userData) => {
    return await fetchApi("/users/register", {
        method: "POST",
        body: JSON.stringify(userData),
    });
};

export const loginUser = async (credentials) => {
    return await fetchApi("/users/login", {
        method: "POST",
        body: JSON.stringify(credentials),
    });
};


export const forgotPassword = async (email) => {
    return await fetchApi("/users/forget-password", {
        method: "POST",
        body: JSON.stringify({ email }),
    });
};

export const resetPassword = async (token, newPassword) => {
    return await fetchApi(`/users/reset-password/${token}`, {
        method: "POST",
        body: JSON.stringify({ password: newPassword }),
    });
};



// Fetch all public posts
export const getAllPosts = async () => {
    return await fetchApi("/");
};

// Fetch a single post by slug
export const getSinglePost = async (slug) => {
    return await fetchApi(`/post/${slug}`);
};

// Send a contact form message
export const sendContactMessage = async (data) => {
    return await fetchApi("/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
};

// Fetch dashboard posts (requires auth token)
export const getDashboardPosts = async (token) => {
    // Changed http://localhost:5000 to BASE_URL
    const res = await fetch(`${BASE_URL}/dashboard`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
    const text = await res.text();
    try {
        const data = JSON.parse(text);
        if (!res.ok) throw new Error(data.message || "خطا در دریافت مقالات داشبورد");
        return data;
    } catch (err) {
        throw new Error(`پاسخ نامعتبر از سرور: ${text.substring(0, 50)}`);
    }
};

// Fetch captcha
export const getCaptcha = async () => {
    const res = await fetch(`${BASE_URL}/captcha.svg`);
    const data = await res.text();
    return data;
};




// Dashboard
export const createPost = async (token, formData) => {
    // Fixed: using BASE_URL instead of the environment variable directly
    const res = await fetch(`${BASE_URL}/dashboard/add-post`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}` 
        },
        body: formData,
    });

    // Read the raw response text first so we don't crash if the body isn't JSON
    const textResponse = await res.text();
    
    try {
        const data = JSON.parse(textResponse);
        if (!res.ok) throw new Error(data.message || "خطا در ساخت پست");
        return data;
    } catch (error) {
        // If the server returned something other than JSON (e.g. a plain error string), catch it here
        console.error("پاسخ سرور JSON نبود. جواب سرور این بود:", textResponse);
        throw new Error(`خطای بک‌اند: ${textResponse.substring(0, 60)}`);
    }
};

export const deletePost = async (token, slug) => {
  const res = await fetch(`${BASE_URL}/dashboard/delete-post/${slug}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
    const textResponse = await res.text();
    try {
        const data = JSON.parse(textResponse);
        if (!res.ok) throw new Error(data.message || "خطا در حذف پست");
        return data;
    } catch (error) {
        throw new Error("خطای نامشخص از سمت سرور هنگام حذف");
    }
};

export const uploadImage = async (token, file) => {
    const formData = new FormData();
    formData.append("image", file); // The key the backend expects for the image (usually "image")

    // Note: your BASE_URL for the API is likely http://localhost:5000
    const response = await fetch(`${BASE_URL}/dashboard/image-upload`, { 
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`
        },
        body: formData
    });

    const textResponse = await response.text();
    
    try {
        const data = JSON.parse(textResponse);
        
        if (!response.ok) {
            throw new Error(data.message || "آپلود تصویر شکست خورد");
        }

        // 1. Extract the image name or path returned by the backend
        let imagePath = data.imageUrl || data.url || data.path || data.image || data.name; 

        // 2. Build the full, correct URL for the editor
        if (imagePath && !imagePath.startsWith("http")) {
            // Fix backslashes on Windows paths
            imagePath = imagePath.replace(/\\/g, "/"); 
            
            // Remove leading slash if present
            if (imagePath.startsWith("/")) {
                imagePath = imagePath.substring(1);
            }

            // If the backend only returns the filename, prepend "uploads/"
            if (!imagePath.startsWith("uploads/")) {
                 imagePath = `uploads/${imagePath}`;
            }

            // Most important part: prepend the full backend URL (port 5000)
            // so the browser knows to load the image from the backend, not the frontend
            imagePath = `${BASE_URL}/${imagePath}`;
        }

        return imagePath; // This full URL is returned to the Quill editor
        
    } catch (error) {
        console.error("خطای سرور هنگام آپلود عکس:", textResponse);
        throw new Error("خطا در پردازش تصویر آپلود شده.");
    }
};


export const editPost = async (token, slug, formData) => {
    // Note: if your backend uses POST for updates, change "PUT" to "POST"
    const res = await fetch(`${BASE_URL}/dashboard/edit-post/${slug}`, {
        method: "PUT", 
        headers: {
            "Authorization": `Bearer ${token}`
        },
        body: formData,
    });

    const textResponse = await res.text();
    try {
        const data = JSON.parse(textResponse);
        if (!res.ok) throw new Error(data.message || "خطا در ویرایش پست");
        return data;
    } catch (error) {
        console.error("پاسخ سرور JSON نبود:", textResponse);
        throw new Error(`خطای بک‌اند در ویرایش: ${textResponse.substring(0, 60)}`);
    }
};
