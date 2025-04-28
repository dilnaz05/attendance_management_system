package com.narxoz.app.service;

import com.narxoz.app.model.Discipline;
import com.narxoz.app.repository.DisciplineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DisciplineService {
    @Autowired
    private DisciplineRepository disciplineRepository;

    public List<Discipline> findAll() {
        return disciplineRepository.findAll();
    }

    public Optional<Discipline> findById(Long id) {
        return disciplineRepository.findById(id);
    }

    public Discipline save(Discipline discipline) {
        return disciplineRepository.save(discipline);
    }

    public void deleteById(Long id) {
        disciplineRepository.deleteById(id);
    }
}
