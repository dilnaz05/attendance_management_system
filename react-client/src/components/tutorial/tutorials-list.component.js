import React, { Component } from 'react';
import TutorialDataService from '../../services/tutorial.service';
import DisciplineService from "../../services/discipline.service";
import { Link } from 'react-router-dom';
import UniversityService from "../../services/university.service";

export default class TutorialsList extends Component {
    constructor(props) {
        super(props);
        this.onChangeSearchTitle = this.onChangeSearchTitle.bind(this);
        this.onChangeCourse = this.onChangeCourse.bind(this);
        this.retrieveTutorials = this.retrieveTutorials.bind(this);
        this.refreshList = this.refreshList.bind(this);
        this.setActiveTutorial = this.setActiveTutorial.bind(this);
        this.removeAllTutorials = this.removeAllTutorials.bind(this);
        this.searchTitle = this.searchTitle.bind(this);
        this.updateStatus = this.updateStatus.bind(this);
        this.state = {
            tutorials: [],
            disciplines: [],
            universities: [],
            selectedDiscipline: "",
            selectedUniversity: "",
            filteredTutorials: [],
            currentTutorial: null,
            currentIndex: -1,
            searchTitle: "",
            courseFilter: "",
            loggedIn: false,
            username: ''
        };
    }

    componentDidMount() {
        this.retrieveTutorials();
        this.retrieveDisciplines();
        this.retrieveUniversities();
    }

    retrieveUniversities() {
        UniversityService.getAllUniversities()
            .then(response => {
                this.setState({ universities: response.data });
            })
            .catch(e => {
                console.error(e);
            });
    }

    retrieveDisciplines() {
        DisciplineService.getAll()
            .then(response => {
                this.setState({ disciplines: response.data });
            })
            .catch(e => {
                console.log(e);
            });
    }

    onChangeSearchTitle(e) {
        this.setState({ searchTitle: e.target.value }, this.filterTutorials);
    }

    onChangeCourse(e) {
        this.setState({ courseFilter: e.target.value }, this.filterTutorials);
    }

    filterTutorials = () => {
        let filtered = this.state.tutorials.filter(tutorial => {
            const disciplineMatch = this.state.selectedDiscipline ? tutorial.disciplines.some(d => d.id === Number(this.state.selectedDiscipline)) : true;
            const universityMatch = this.state.selectedUniversity ? tutorial.university.id === Number(this.state.selectedUniversity) : true;
            const courseMatch = this.state.courseFilter ? tutorial.course.toString().includes(this.state.courseFilter) : true;
            const titleMatch = this.state.searchTitle ? tutorial.title.toLowerCase().includes(this.state.searchTitle.toLowerCase()) : true;
            return disciplineMatch && universityMatch && courseMatch && titleMatch;
        });
        this.setState({
            filteredTutorials: filtered,
            currentTutorial: null,
            currentIndex: -1,
        });
    };
    retrieveTutorials() {
        TutorialDataService.getAll()
            .then(response => {
                this.setState({ tutorials: response.data, filteredTutorials: response.data });
            })
            .catch(e => {
                console.error(e);
            });
    }

    refreshList() {
        this.retrieveTutorials();
        this.setState({
            currentTutorial: null,
            currentIndex: -1,
        });
    }

    setActiveTutorial(tutorial, index) {
        this.setState({
            currentTutorial: tutorial,
            currentIndex: index,
        });
    }

    removeAllTutorials() {
        TutorialDataService.deleteAll()
            .then(() => {
                this.refreshList();
            })
            .catch(e => {
                console.error(e);
            });
    }

    searchTitle() {
        this.filterTutorials();
    }

    updateStatus(tutorial, status) {
        const updatedTutorial = { ...tutorial, published: status };
        TutorialDataService.update(tutorial.id, updatedTutorial)
            .then(() => {
                this.retrieveTutorials();  // Refresh the list to reflect the update
            })
            .catch(e => {
                console.error(e);
            });
    }

    render() {
        const { searchTitle, filteredTutorials, courseFilter, selectedDiscipline, universities, selectedUniversity } = this.state;
        const { loggedIn } = this.props;
        return (
            <div className="container mt-3">
                <div className="row mb-3">
                    <div className="col">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search by name"
                            value={searchTitle}
                            onChange={this.onChangeSearchTitle}
                        />
                    </div>
                    <div className="col">
                        <select className="form-control" value={courseFilter} onChange={this.onChangeCourse}>
                            <option value="">All Courses</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                        </select>
                    </div>
                    <div className="col">
                        <select className="form-control" value={selectedUniversity} onChange={e => this.setState({ selectedUniversity: e.target.value }, this.filterTutorials)}>
                            <option value="">All Universities</option>
                            {universities.map((university) => (
                                <option key={university.id} value={university.id}>{university.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col">
                        <select className="form-control" value={selectedDiscipline} onChange={e => this.setState({ selectedDiscipline: e.target.value }, this.filterTutorials)}>
                            <option value="">All Disciplines</option>
                            {this.state.disciplines.map((discipline) => (
                                <option key={discipline.id} value={discipline.id}>{discipline.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col-auto">
                        <button className="btn btn-outline-secondary" onClick={this.searchTitle}>
                            Search
                        </button>
                    </div>
                </div>

                {filteredTutorials.length > 0 ? (
                    <table className="table table-bordered table-hover">
                        <thead className="thead-dark">
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Student Name</th>
                            <th scope="col">Course</th>
                            <th scope="col">Semester</th>
                            <th scope="col">Description</th>
                            <th scope="col">University</th>
                            <th scope="col">Disciplines</th>
                            { loggedIn && (
                                <th scope="col">Status</th>
                            )}
                            { loggedIn && (
                                <th scope="col">Actions</th>
                            )}

                        </tr>
                        </thead>
                        <tbody>
                        {filteredTutorials.map((tutorial, index) => (
                            <tr key={index} className={index === this.state.currentIndex ? "table-primary" : ""} onClick={() => this.setActiveTutorial(tutorial, index)}>
                                <th scope="row">{index + 1}</th>
                                <td>{tutorial.title}</td>
                                <td>{tutorial.course}</td>
                                <td>{tutorial.semester}</td>
                                <td>{tutorial.description}</td>
                                <td>{tutorial.university ? tutorial.university.name : 'No University'}</td>
                                <td>
                                    {tutorial.disciplines && tutorial.disciplines.length > 0
                                        ? tutorial.disciplines.map(d => d.name).join(', ')
                                        : 'No Disciplines'
                                    }
                                </td>

                                {loggedIn && (
                                    <td>
                                        {tutorial.published ? (
                                            <button onClick={() => this.updateStatus(tutorial, false)} className="btn btn-warning btn-sm">
                                                Set Pending
                                            </button>
                                        ) : (
                                            <button onClick={() => this.updateStatus(tutorial, true)} className="btn btn-success btn-sm">
                                                Set Published
                                            </button>
                                        )}
                                    </td>
                                )}
                                {loggedIn && (
                                    <td>
                                        <Link to={`/tutorials/${tutorial.id}`} className="btn btn-warning btn-sm">Edit</Link>
                                    </td>
                                )}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="alert alert-info" role="alert">
                        No tutorials found.
                    </div>
                )}

                <button className="btn btn-danger" onClick={this.removeAllTutorials}>
                    Remove All
                </button>
            </div>
        );
    }
}
