export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  tags: string[];
  imageUrl: string;
}

export const mockBlogs: BlogPost[] = [
  {
    id: "1",
    title: "Building Decoupled Next.js 15 & Spring Boot Architectures",
    slug: "nextjs-spring-boot-architecture",
    summary: "A comprehensive guide on structuring enterprise-ready web platforms with custom JWT configurations, CORS rules, and docker staging.",
    date: "July 8, 2026",
    readTime: "8 min read",
    author: "Roshan Gupta",
    category: "Architecture",
    tags: ["Next.js 15", "Spring Boot", "Security", "JWT"],
    imageUrl: "/blog-arch.jpg",
    content: `
# Building Decoupled Next.js 15 & Spring Boot Architectures

Enterprise web applications demand high security, swift hot-reloading, and robust database persistence layers. Combining Next.js 15 (for rendering layouts) with Spring Boot 3.x (for data safety and microservice APIs) represents a premium software stack.

In this guide, we dive deep into configuring the decoupled mono-repo architecture.

## Why decoupling Next.js and Spring Boot?

1. **Optimal User Experience**: Next.js compiles pages using static site generation (SSG) or server-side rendering (SSR), fetching data from Spring Boot REST endpoints.
2. **Stateless Scalability**: Using JSON Web Tokens (JWT) for authentication eliminates server-side session stores, enabling easy load-balancing.
3. **Clean Coding Boundaries**: Frontend designers write React components while backend engineers secure databases and handle entity logic.

## Security Controls (CORS and CSRF)

When separating frontend and backend servers, handling Cross-Origin Resource Sharing (CORS) is mandatory. We configure Spring Security to permit incoming origins from localhost:3000:

\`\`\`java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(List.of("http://localhost:3000"));
    configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE"));
    // ...
}
\`\`\`

In stateless JWT systems, CSRF protection is disabled because tokens are stored as Authorization bearer headers rather than session cookies.

---
Stay tuned for part two, where we build interactive GSAP scroll timelines.
`
  },
  {
    id: "2",
    title: "The Power of Tailwind CSS v4 in Modern Web Design",
    slug: "tailwindcss-v4-benefits",
    summary: "Discover the new CSS-first configuration layer in Tailwind CSS v4 and how it simplifies glassmorphic UI setups.",
    date: "July 2, 2026",
    readTime: "5 min read",
    author: "Elena Petrova",
    category: "UI/UX Design",
    tags: ["CSS", "Tailwind CSS", "Design System"],
    imageUrl: "/blog-design.jpg",
    content: `
# The Power of Tailwind CSS v4 in Modern Web Design

Tailwind CSS v4 introduces compilation speed improvements using Rust-based parsing engines and introduces a clean '@theme' syntax that simplifies stylesheet configurations.

## Visual Design Highlights:
- **No tailwind.config.js needed**: Customize colors, spacing, and fonts natively inside your global stylesheet.
- **Improved Performance**: Smaller CSS outputs and optimized style mappings.
- **Glassmorphism Made Simple**: Combine backdrop-blur properties with thin transparent border colors.
`
  }
];
