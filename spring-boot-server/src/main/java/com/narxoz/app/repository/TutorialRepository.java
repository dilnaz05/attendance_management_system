package com.narxoz.app.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.narxoz.app.model.Tutorial;
import org.springframework.data.jpa.repository.Query;

public interface TutorialRepository extends JpaRepository<Tutorial, Long> {
	List<Tutorial> findByPublished(boolean published);
	List<Tutorial> findByTitleContaining(String title);

	@Query("SELECT t FROM Tutorial t JOIN FETCH t.university WHERE t.title LIKE %:title%")
	List<Tutorial> findByTitleContainingWithUniversity(String title);

	@Query("SELECT t FROM Tutorial t JOIN FETCH t.university")
	List<Tutorial> findAllWithUniversity();

	@Query("SELECT t FROM Tutorial t JOIN FETCH t.university u LEFT JOIN FETCH t.disciplines")
	List<Tutorial> findAllWithUniversityAndDisciplines();

	@Query("SELECT t FROM Tutorial t JOIN FETCH t.university u LEFT JOIN FETCH t.disciplines WHERE t.title LIKE %:title%")
	List<Tutorial> findByTitleContainingWithUniversityAndDisciplines(String title);
}
