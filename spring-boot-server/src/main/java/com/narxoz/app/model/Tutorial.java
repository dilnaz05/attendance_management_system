package com.narxoz.app.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
@Table(name = "tutorials")
public class Tutorial {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private long id;

	@Column(name = "title")
	private String title;

	@Column(name = "description")
	private String description;

	@Column(name = "published")
	private boolean published;

	@Column(name = "course")
	private String course;

	@Column(name = "semester")
	private Integer semester;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "university_id")
	@JsonBackReference
	private University university;

	@ManyToMany(fetch = FetchType.LAZY, cascade = { CascadeType.PERSIST, CascadeType.MERGE })
	@JoinTable(name = "tutorial_discipline",
			joinColumns = @JoinColumn(name = "tutorial_id"),
			inverseJoinColumns = @JoinColumn(name = "discipline_id"))
	private Set<Discipline> disciplines = new HashSet<>();

	public Tutorial() {
	}

	public Tutorial(String title, String description, boolean published, String course, Integer semester, University university) {
		this.title = title;
		this.description = description;
		this.published = published;
		this.course = course;
		this.semester = semester;
		this.university = university;
	}

	public Tutorial(String title, String description, boolean published, String course, Integer semester) {
		this.title = title;
		this.description = description;
		this.published = published;
		this.course = course;
		this.semester = semester;
		this.university = null;
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public boolean isPublished() {
		return published;
	}

	public void setPublished(boolean published) {
		this.published = published;
	}

	public String getCourse() {
		return course;
	}

	public void setCourse(String course) {
		this.course = course;
	}

	public Integer getSemester() {
		return semester;
	}

	public void setSemester(Integer semester) {
		this.semester = semester;
	}
	public Set<Discipline> getDisciplines() {
		return disciplines;
	}

	public void setDisciplines(Set<Discipline> disciplines) {
		this.disciplines = disciplines;
	}

	public void addDiscipline(Discipline discipline) {
		this.disciplines.add(discipline);

	}
	public void removeDiscipline(Discipline discipline) {
		this.disciplines.remove(discipline);
	}

	public University getUniversity() {
		return university;
	}

	public void setUniversity(University university) {
		this.university = university;
	}

	@Override
	public String toString() {
		return "Tutorial [id=" + id + ", title=" + title + ", description=" + description + ", published=" + published +
				", course=" + course + ", semester=" + semester + ", university=" + (university != null ? university.getName() : "No University") + "]";
	}
}
