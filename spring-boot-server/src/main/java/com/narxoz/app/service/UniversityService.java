package com.narxoz.app.service;

import com.narxoz.app.model.University;
import com.narxoz.app.repository.UniversityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UniversityService {

    @Autowired
    private UniversityRepository universityRepository;

    public List<University> findAllUniversities() {
        return universityRepository.findAll();
    }

    public Optional<University> findUniversityById(Long id) {
        return universityRepository.findById(id);
    }

    public University saveUniversity(University university) {
        return universityRepository.save(university);
    }

    public void deleteUniversity(Long id) {
        universityRepository.deleteById(id);
    }

    public University updateUniversity(Long id, University updatedUniversity) {
        return universityRepository.findById(id)
                .map(university -> {
                    university.setName(updatedUniversity.getName());
                    university.setLocation(updatedUniversity.getLocation());
                    return universityRepository.save(university);
                }).orElseGet(() -> {
                    updatedUniversity.setId(id);
                    return universityRepository.save(updatedUniversity);
                });
    }
}
