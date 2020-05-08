package com.site.blog.my.core.entity;

/**
 * 封装Tag的类
 * 记录BlogTag 的 id，name，count 信息类(blogTag火热程度)
 */
public class BlogTagCount {
    private Integer tagId;

    private String tagName;

    private Integer tagCount;

    public Integer getTagId() {
        return tagId;
    }

    public void setTagId(Integer tagId) {
        this.tagId = tagId;
    }

    public String getTagName() {
        return tagName;
    }

    public void setTagName(String tagName) {
        this.tagName = tagName;
    }

    public Integer getTagCount() {
        return tagCount;
    }

    public void setTagCount(Integer tagCount) {
        this.tagCount = tagCount;
    }
}
