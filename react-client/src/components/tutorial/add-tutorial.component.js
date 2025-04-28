import React, { Component } from "react";
import TutorialDataService from "../../services/tutorial.service";
import UniversityService from '../../services/university.service';
import DisciplineService from "../../services/discipline.service";

export default class AddTutorial extends Component {
  constructor(props) {
    super(props);
    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onChangeCourse = this.onChangeCourse.bind(this);
    this.onChangeSemester = this.onChangeSemester.bind(this);
    this.saveTutorial = this.saveTutorial.bind(this);
    this.newTutorial = this.newTutorial.bind(this);
    this.onChangeUniversity = this.onChangeUniversity.bind(this);
    this.state = {
      id: null,
      title: "",
      description: "",
      course: "1",
      semester: 1,
      universityId: null,
      universities: [],
      disciplines: [],
      selectedDisciplines: [],
      published: false,
      submitted: false
    };
  }

  onChangeTitle(e) {
    this.setState({
      title: e.target.value
    });
  }

  onChangeDescription(e) {
    this.setState({
      description: e.target.value
    });
  }

  onChangeCourse(e) {
    this.setState({
      course: e.target.value
    });
  }
  componentDidMount() {
    UniversityService.getAllUniversities()
        .then(response => {
          this.setState({ universities: response.data });
        })
        .catch(e => {
          console.log(e);
        });

    // Fetch disciplines
    DisciplineService.getAll()
        .then(response => {
          this.setState({ disciplines: response.data });
        })
        .catch(e => {
          console.log(e);
        });
  }

  onChangeSemester(e) {
    this.setState({
      semester: Number(e.target.value)
    });
  }

  onChangeUniversity(e) {
    this.setState({
      universityId: e.target.value
    });
  }
  onChangeDiscipline = (event) => {
    const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
    this.setState({ selectedDisciplines: selectedOptions });
  };



  saveTutorial() {
    var data = {
      title: this.state.title,
      description: this.state.description,
      course: this.state.course,
      semester: this.state.semester,
      university: { id: this.state.universityId },
      disciplines: this.state.selectedDisciplines.map(id => ({ id }))
    };

    TutorialDataService.create(data)
        .then(response => {
          this.setState({
            id: response.data.id,
            title: response.data.title,
            description: response.data.description,
            course: response.data.course,
            semester: response.data.semester,
            universityId: response.data.universityId,
            published: response.data.published,
            submitted: true
          });
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
  }


  newTutorial() {
    this.setState({
      id: null,
      title: "",
      description: "",
      course: "1",
      semester: 1,
      published: false,

      submitted: false
    });
  }


  render() {
    return (
        <div className="container mt-4">
          {this.state.submitted ? (
              <div className="alert alert-success">
                <h4>You submitted successfully!</h4>
                <button className="btn btn-success" onClick={this.newTutorial}>
                  Add Another
                </button>
              </div>
          ) : (
              <div>
                <h3>Add New Student Tutorial</h3>
                <form>
                  <div className="form-group">
                    <label htmlFor="title">Student Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="title"
                        required
                        value={this.state.title}
                        onChange={this.onChangeTitle}
                        name="title"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <input
                        type="text"
                        className="form-control"
                        id="description"
                        required
                        value={this.state.description}
                        onChange={this.onChangeDescription}
                        name="description"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="course">Course</label>
                    <select
                        className="form-control"
                        id="course"
                        required
                        value={this.state.course}
                        onChange={this.onChangeCourse}
                        name="course"
                    >
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="semester">Semester</label>
                    <input
                        type="number"
                        className="form-control"
                        id="semester"
                        required
                        value={this.state.semester}
                        onChange={this.onChangeSemester}
                        name="semester"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="university">University</label>
                    <select
                        className="form-control"
                        id="university"
                        required
                        value={this.state.universityId}
                        onChange={this.onChangeUniversity}
                        name="university"
                    >
                      <option value="">Select University</option>
                      {this.state.universities.map(university => (
                          <option key={university.id} value={university.id}>
                            {university.name}
                          </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="disciplines">Disciplines</label>
                    <select multiple className="form-control" id="disciplines" onChange={this.onChangeDiscipline}>
                      {this.state.disciplines.map((discipline) => (
                          <option key={discipline.id} value={discipline.id}>
                            {discipline.name}
                          </option>
                      ))}
                    </select>
                  </div>

                  <button type="button" onClick={this.saveTutorial} className="btn btn-primary">
                    Submit
                  </button>
                </form>
              </div>
          )}
        </div>
    );
  }

}
