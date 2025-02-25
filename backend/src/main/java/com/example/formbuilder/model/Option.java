package com.example.formbuilder.model;

import jakarta.persistence.*;

@Entity
@Table(name = "options")
public class Option {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String value;

    // Getters and setters
} 