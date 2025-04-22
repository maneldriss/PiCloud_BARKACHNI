package com.barkachni.barkachni.entities.brand;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.util.Date;

@Entity
public class Ad {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    // string lel URL
    private String image;

    // string lel URL
    @Column(nullable = false)
    private String link;

    @Temporal(TemporalType.DATE)
    @Column(nullable = false)
    private Date expDate;

    @Column(nullable = false)
    private int nbClicks;

    // Many-to-One relationship with Brand
    @ManyToOne
    @JsonIgnoreProperties({"ads", "address", "email"})
    private Brand brand;
    @Enumerated(EnumType.STRING)
    private AdStatus status = AdStatus.PENDING;

    @Temporal(TemporalType.TIMESTAMP)
    private Date approvalDate;

    private String rejectionReason;
    @Column(nullable = false)
    private boolean deleted = false;

    // Constructors
    public Ad() {}

    public Ad(Long id, String title, String description, String image, String link, Date expDate, int nbClicks, Brand brand) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.image = image;
        this.link = link;
        this.expDate = expDate;
        this.nbClicks = nbClicks;
        this.brand = brand;
    }

    // Getters
    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public String getImage() {
        return image;
    }

    public String getLink() {
        return link;
    }

    public Date getExpDate() {
        return expDate;
    }

    public int getNbClicks() {
        return nbClicks;
    }

    public Brand getBrand() {
        return brand;
    }

    // Setters
    public void setId(Long id) {
        this.id = id;
    }

    public void setTitle(String title) {
        if (title == null || title.trim().isEmpty()) {
            throw new IllegalArgumentException("Ad title cannot be empty");
        }
        this.title = title;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public void setLink(String link) {
        if (link == null || link.trim().isEmpty()) {
            throw new IllegalArgumentException("Ad link cannot be empty");
        }
        this.link = link;
    }

    public void setExpDate(Date expDate) {
        if (expDate == null) {
            throw new IllegalArgumentException("Expiration date cannot be null");
        }
        this.expDate = expDate;
    }

    public void setNbClicks(int nbClicks) {
        if (nbClicks < 0) {
            throw new IllegalArgumentException("Number of clicks cannot be negative");
        }
        this.nbClicks = nbClicks;
    }

    public void setBrand(Brand brand) {
        if (brand == null) {
            throw new IllegalArgumentException("Brand cannot be null");
        }
        this.brand = brand;
    }
    public AdStatus getStatus() {
        return status;
    }

    public void setStatus(AdStatus status) {
        this.status = status;
    }

    public Date getApprovalDate() {
        return approvalDate;
    }

    public void setApprovalDate(Date approvalDate) {
        this.approvalDate = approvalDate;
    }

    public String getRejectionReason() {
        return rejectionReason;
    }

    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }
    public boolean isDeleted() { return deleted; }
    public void setDeleted(boolean deleted) { this.deleted = deleted; }
}