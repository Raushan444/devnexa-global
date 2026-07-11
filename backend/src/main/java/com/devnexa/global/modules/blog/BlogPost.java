package com.devnexa.global.modules.blog;

import com.devnexa.global.modules.auth.User;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "blog_posts", uniqueConstraints = {
    @UniqueConstraint(columnNames = "slug")
})
public class BlogPost {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(columnDefinition = "TEXT")
    private String summary;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "author_id", nullable = false)
    private User author;

    private String category;

    private String tags; // Comma-separated tags

    private String seoTitle;

    @Column(columnDefinition = "TEXT")
    private String seoDescription;

    private String featuredImageUrl;

    private boolean published = false;

    private LocalDateTime publishedAt;

    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt = LocalDateTime.now();

    public BlogPost() {}

    public BlogPost(String title, String slug, String content, String summary, User author, String category, String tags, String seoTitle, String seoDescription, String featuredImageUrl, boolean published) {
        this.title = title;
        this.slug = slug;
        this.content = content;
        this.summary = summary;
        this.author = author;
        this.category = category;
        this.tags = tags;
        this.seoTitle = seoTitle;
        this.seoDescription = seoDescription;
        this.featuredImageUrl = featuredImageUrl;
        this.published = published;
        if (published) {
            this.publishedAt = LocalDateTime.now();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public User getAuthor() { return author; }
    public void setAuthor(User author) { this.author = author; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getTags() { return tags; }
    public void setTags(String tags) { this.tags = tags; }

    public String getSeoTitle() { return seoTitle; }
    public void setSeoTitle(String seoTitle) { this.seoTitle = seoTitle; }

    public String getSeoDescription() { return seoDescription; }
    public void setSeoDescription(String seoDescription) { this.seoDescription = seoDescription; }

    public String getFeaturedImageUrl() { return featuredImageUrl; }
    public void setFeaturedImageUrl(String featuredImageUrl) { this.featuredImageUrl = featuredImageUrl; }

    public boolean isPublished() { return published; }
    public void setPublished(boolean published) {
        this.published = published;
        if (published && this.publishedAt == null) {
            this.publishedAt = LocalDateTime.now();
        }
    }

    public LocalDateTime getPublishedAt() { return publishedAt; }
    public void setPublishedAt(LocalDateTime publishedAt) { this.publishedAt = publishedAt; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
