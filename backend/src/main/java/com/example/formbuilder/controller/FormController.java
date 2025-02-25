package com.example.formbuilder.controller;

import com.example.formbuilder.model.Form;
import com.example.formbuilder.repository.FormRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/forms")
@CrossOrigin(origins = "http://localhost:3000")
public class FormController {
    
    @Autowired
    private FormRepository formRepository;
    
    @GetMapping
    public List<Form> getAllForms() {
        return formRepository.findAll();
    }
    
    @PostMapping
    public Form createForm(@RequestBody Form form) {
        return formRepository.save(form);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Form> updateForm(@PathVariable Long id, @RequestBody Form formDetails) {
        Form form = formRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Form not found"));
            
        form.setName(formDetails.getName());
        form.setFields(formDetails.getFields());
        
        Form updatedForm = formRepository.save(form);
        return ResponseEntity.ok(updatedForm);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteForm(@PathVariable Long id) {
        Form form = formRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Form not found"));
            
        formRepository.delete(form);
        return ResponseEntity.ok().build();
    }
} 