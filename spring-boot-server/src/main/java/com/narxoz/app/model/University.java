    package com.narxoz.app.model;

    import com.fasterxml.jackson.annotation.JsonIdentityInfo;
    import com.fasterxml.jackson.annotation.JsonManagedReference;
    import com.fasterxml.jackson.annotation.ObjectIdGenerators;
    import jakarta.persistence.*;

    import java.util.ArrayList;
    import java.util.List;

    @Entity
    @JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
    @Table(name = "universities")
    public class University {

        @Id
        @GeneratedValue(strategy = GenerationType.AUTO)
        private long id;

        @Column(name = "name")
        private String name;

        @Column(name = "location")
        private String location;

//        @OneToMany(mappedBy = "university", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
//        private Tutorial tutorials;


        public University() {
        }

        public University(String name, String location) {
            this.name = name;
            this.location = location;
        }

        public long getId() {
            return id;
        }

        public void setId(long id) {
            this.id = id;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getLocation() {
            return location;
        }

        public void setLocation(String location) {
            this.location = location;
        }

//        public List<Tutorial> getTutorials() {
//            return tutorials;
//        }
//
//        public void setTutorials(List<Tutorial> tutorials) {
//            this.tutorials = tutorials;
//        }
        public void addTutorial(Tutorial tutorial) {
//            tutorials.add(tutorial);
            tutorial.setUniversity(this);
        }

        public void removeTutorial(Tutorial tutorial) {
//            tutorials.remove(tutorial);
            tutorial.setUniversity(null);
        }

        @Override
        public String toString() {
            return "University [id=" + id + ", name=" + name + ", location=" + location + "]";
        }
    }
