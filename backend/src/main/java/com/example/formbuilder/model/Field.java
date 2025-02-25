package com.example.formbuilder.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "fields")
public class Field {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private String type;
    
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Option> options;

    // Getters and setters
} 