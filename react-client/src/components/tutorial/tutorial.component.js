import React, { Component } from "react";
import TutorialDataService from "../../services/tutorial.service";
import { withRouter } from '../../common/with-router';

class Tutorial extends Component {
  constructor(props) {
    super(props);
    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onChangeCourse = this.onChangeCourse.bind(this);
    this.onChangeSemester = this.onChangeSemester.bind(this);
    this.getTutorial = this.getTutorial.bind(this);
    this.updatePublished = this.updatePublished.bind(this);
    this.updateTutorial = this.updateTutorial.bind(this);
    this.deleteTutorial = this.deleteTutorial.bind(this);

    this.state = {
      currentTutorial: {
        id: null,
        title: "",
        description: "",
        course: "",
        semester: "",
        published: false
      },
      message: ""
    };
  }

  componentDidMount() {
    this.getTutorial(this.props.router.params.id);
  }

  onChangeTitle(e) {
    const title = e.target.value;
    this.setState(prevState => ({
      currentTutorial: {
        ...prevState.currentTutorial,
        title: title
      }
    }));
  }

  onChangeDescription(e) {
    const description = e.target.value;
    this.setState(prevState => ({
      currentTutorial: {
        ...prevState.currentTutorial,
        description: description
      }
    }));
  }

  onChangeCourse(e) {
    const course = e.target.value;
    this.setState(prevState => ({
      currentTutorial: {
        ...prevState.currentTutorial,
        course: course
      }
    }));
  }

  onChangeSemester(e) {
    const semester = e.target.value;
    this.setState(prevState => ({
      currentTutorial: {
        ...prevState.currentTutorial,
        semester: semester
      }
    }));
  }

  getTutorial(id) {
    TutorialDataService.get(id)
        .then(response => {
          this.setState({
            currentTutorial: response.data
          });
        })
        .catch(e => {
          console.error(e);
        });
  }

  updatePublished(status) {
    const data = {
      ...this.state.currentTutorial,
      published: status
    };

    TutorialDataService.update(this.state.currentTutorial.id, data)
        .then(() => {
          this.setState(prevState => ({
            currentTutorial: {
              ...prevState.currentTutorial,
              published: status
            },
            message: "Status updated successfully!"
          }));
        })
        .catch(e => {
          console.error(e);
          this.setState({ message: "Failed to update status!" });
        });
  }

  updateTutorial() {
    TutorialDataService.update(this.state.currentTutorial.id, this.state.currentTutorial)
        .then(() => {
          this.setState({ message: "Tutorial updated successfully!" });
          this.props.router.navigate('/tutorials'); // Redirect to /tutorials
        })
        .catch(e => {
          console.error(e);
          this.setState({ message: "Failed to update tutorial!" });
        });
  }

  deleteTutorial() {
    TutorialDataService.delete(this.state.currentTutorial.id)
        .then(() => {
          this.props.router.navigate('/tutorials');
        })
        .catch(e => {
          console.error(e);
          this.setState({ message: "Failed to delete tutorial!" });
        });
  }

  render() {
    const { currentTutorial } = this.state;

    return (
        <div className="container mt-5">
          {currentTutorial ? (
              <div className="card">
                <h5 className="card-header">Edit Student</h5>
                <div className="card-body">
                  <form>
                    <div className="form-group">
                      <label htmlFor="title">Student Name</label>
                      <input
                          type="text"
                          className="form-control"
                          id="title"
                          value={currentTutorial.title}
                          onChange={this.onChangeTitle}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="description">Description</label>
                      <input
                          type="text"
                          className="form-control"
                          id="description"
                          value={currentTutorial.description}
                          onChange={this.onChangeDescription}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="course">Course</label>
                      <input
                          type="text"
                          className="form-control"
                          id="course"
                          value={currentTutorial.course}
                          onChange={this.onChangeCourse}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="semester">Semester</label>
                      <input
                          type="number"
                          className="form-control"
                          id="semester"
                          value={currentTutorial.semester}
                          onChange={this.onChangeSemester}
                      />
                    </div>

                    <div className="form-group">
                      <label><strong>Status:</strong></label>
                      <p className="form-control-static">
                        {currentTutorial.published ? "Published" : "Pending"}
                      </p>
                    </div>
                  </form>

                  <div className="btn-group" role="group" aria-label="Tutorial Actions">
                    {currentTutorial.published ? (
                        <button className="btn btn-info" onClick={() => this.updatePublished(false)}>
                          Set as Pending
                        </button>
                    ) : (
                        <button className="btn btn-primary" onClick={() => this.updatePublished(true)}>
                          Publish
                        </button>
                    )}

                    <button className="btn btn-success" onClick={this.updateTutorial}>
                      Update
                    </button>

                    <button className="btn btn-danger" onClick={this.deleteTutorial}>
                      Delete
                    </button>
                  </div>

                  {this.state.message && (
                      <div className="alert alert-info mt-2" role="alert">
                        {this.state.message}
                      </div>
                  )}
                </div>
              </div>
          ) : (
              <div>
                <br />
                <p>Please select a Tutorial...</p>
              </div>
          )}
        </div>
    );
  }
}

export default withRouter(Tutorial);
