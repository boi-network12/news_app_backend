export const API_DOCUMENTATION = `
# 🌍 Open Source News API Documentation

Welcome to the Open Source News API! This API allows you to fetch the latest news articles from various sources.

## 🔹 Base URL
\`\`\`
## copied url
\`\`\`

---

## 📌 Endpoints

### ✅ Get Latest News
Retrieve the latest news articles.

#### **Request**
\`\`\`http
GET /api/news
\`\`\`

#### **Query Parameters (Optional)**
| Parameter   | Type   | Description |
|------------|--------|-------------|
| category   | string | Filter news by category (e.g., tech, business, sports) |
| country    | string | Filter news by country Name (e.g., united state, Nigeria, Hong Kong) |
| limit      | number | Limit the number of returned news articles |

#### **Example Request**
\`\`\`http
GET /api/news?category=tech&limit=5
\`\`\`

#### **Example Response**
\`\`\`json
[
  {
    "title": "New Tech Breakthrough",
    "content": "A new technology has been developed...",
    "category": "tech",
    "country": "US",
    "createdAt": "2024-03-06T12:00:00Z",
    "likeCount": 120
  }
]
\`\`\`

---

## 🚀 How to Use
You can fetch data using JavaScript's \`fetch()\` function, Postman, or any HTTP client.

**Example using JavaScript (Fetch API):**
\`\`\`javascript
fetch("https://##copiad_url?limit=5")
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error("Error fetching news:", error));
\`\`\`

---

## ⚡ Features
- Get real-time news updates
- Filter news by category and country
- Supports pagination with limits

---

## 📩 Contact & Support
For any issues or contributions, reach out via:
- GitHub: [Your Profile](https://github.com/boi-network12/news_app_backend/blob/main/routes/NewsRoute.js)
- Twitter: [Your Twitter](https://twitter.com/Echowire_News)

---
© ${new Date().getFullYear()} Your Name. All rights reserved.
`;
