package com.narxoz.app.controller;

import java.util.*;
import java.util.stream.Collectors;

import com.narxoz.app.model.Discipline;
import com.narxoz.app.model.University;
import com.narxoz.app.repository.DisciplineRepository;
import com.narxoz.app.repository.UniversityRepository;
import com.narxoz.app.service.UniversityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.ui.Model;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.narxoz.app.model.Tutorial;
import com.narxoz.app.repository.TutorialRepository;

@CrossOrigin(origins = "http://localhost:8081")
@RestController
@RequestMapping("/api")
public class TutorialController {

	@Autowired
	TutorialRepository tutorialRepository;

	@Autowired
	UniversityRepository universityRepository;

	@Autowired
	DisciplineRepository disciplineRepository;

	@Autowired
	private UniversityService universityService;

	@GetMapping("/tutorials")
	public ResponseEntity<List<Map<String, Object>>> getAllTutorials(@RequestParam(required = false) String title) {
		try {
			List<Tutorial> tutorials = title == null ?
					tutorialRepository.findAllWithUniversityAndDisciplines() :
					tutorialRepository.findByTitleContainingWithUniversity(title);

			if (tutorials.isEmpty()) {
				return new ResponseEntity<>(HttpStatus.NO_CONTENT);
			}

			List<Map<String, Object>> tutorialsWithDetails = tutorials.stream().map(tutorial -> {
				Map<String, Object> tutorialData = new HashMap<>();
				tutorialData.put("id", tutorial.getId());
				tutorialData.put("title", tutorial.getTitle());
				tutorialData.put("description", tutorial.getDescription());
				tutorialData.put("published", tutorial.isPublished());
				tutorialData.put("course", tutorial.getCourse());
				tutorialData.put("semester", tutorial.getSemester());
				tutorialData.put("university", tutorial.getUniversity() != null ? Map.of(
						"id", tutorial.getUniversity().getId(),
						"name", tutorial.getUniversity().getName(),
						"location", tutorial.getUniversity().getLocation()
				) : "No University");
				tutorialData.put("disciplines", tutorial.getDisciplines().stream().map(d -> Map.of(
						"id", d.getId(),
						"name", d.getName()
				)).collect(Collectors.toList()));
				return tutorialData;
			}).collect(Collectors.toList());

			return new ResponseEntity<>(tutorialsWithDetails, HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}






	@GetMapping("/tutorials/{id}")
	public ResponseEntity<Tutorial> getTutorialById(@PathVariable("id") long id) {
		Optional<Tutorial> tutorialData = tutorialRepository.findById(id);

		if (tutorialData.isPresent()) {
			return new ResponseEntity<>(tutorialData.get(), HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}

	@PostMapping("/tutorials")
	public ResponseEntity<Tutorial> createTutorial(@RequestBody Tutorial tutorial) {
		try {
			University university = universityRepository.findById(tutorial.getUniversity().getId())
					.orElseThrow(() -> new RuntimeException("University not found"));

			Set<Discipline> disciplines = new HashSet<>();
			for (Discipline discipline : tutorial.getDisciplines()) {
				Discipline existingDiscipline = disciplineRepository.findById(discipline.getId())
						.orElseThrow(() -> new RuntimeException("Discipline not found: " + discipline.getId()));
				disciplines.add(existingDiscipline);
			}

			Tutorial newTutorial = new Tutorial(
					tutorial.getTitle(),
					tutorial.getDescription(),
					tutorial.isPublished(),
					tutorial.getCourse(),
					tutorial.getSemester(),
					university
			);
			newTutorial.setDisciplines(disciplines);

			Tutorial _tutorial = tutorialRepository.save(newTutorial);
			return new ResponseEntity<>(_tutorial, HttpStatus.CREATED);
		} catch (Exception e) {
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}



	@PutMapping("/tutorials/{id}")
	public ResponseEntity<Tutorial> updateTutorial(@PathVariable("id") long id, @RequestBody Tutorial tutorial) {
		Optional<Tutorial> tutorialData = tutorialRepository.findById(id);

		if (tutorialData.isPresent()) {
			Tutorial _tutorial = tutorialData.get();
			_tutorial.setTitle(tutorial.getTitle());
			_tutorial.setDescription(tutorial.getDescription());
			_tutorial.setPublished(tutorial.isPublished());
			return new ResponseEntity<>(tutorialRepository.save(_tutorial), HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}

	@DeleteMapping("/tutorials/{id}")
	public ResponseEntity<HttpStatus> deleteTutorial(@PathVariable("id") long id) {
		try {
			tutorialRepository.deleteById(id);
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@DeleteMapping("/tutorials")
	public ResponseEntity<HttpStatus> deleteAllTutorials() {
		try {
			tutorialRepository.deleteAll();
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}

	}

	@GetMapping("/tutorials/published")
	public ResponseEntity<List<Tutorial>> findByPublished() {
		try {
			List<Tutorial> tutorials = tutorialRepository.findByPublished(true);

			if (tutorials.isEmpty()) {
				return new ResponseEntity<>(HttpStatus.NO_CONTENT);
			}
			return new ResponseEntity<>(tutorials, HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

}
