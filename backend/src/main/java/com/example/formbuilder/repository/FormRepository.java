package com.example.formbuilder.repository;

import com.example.formbuilder.model.Form;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FormRepository extends JpaRepository<Form, Long> {
} 