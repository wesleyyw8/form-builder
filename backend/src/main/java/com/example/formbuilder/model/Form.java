package com.example.formbuilder.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "forms")
public class Form {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Field> fields;

    // Getters and setters
} 