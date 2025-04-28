import React, { useState, useEffect } from 'react';
import UniversityService from '../../services/university.service';
import { FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';

const UniversitiesList = () => {
    const [universities, setUniversities] = useState([]);
    const [currentUniversity, setCurrentUniversity] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        location: ''
    });
    const [error, setError] = useState('');
    const [noData, setNoData] = useState(false);

    useEffect(() => {
        retrieveUniversities();
    }, []);

    const retrieveUniversities = () => {
        UniversityService.getAllUniversities()
            .then(response => {
                if (response.data.length === 0) {
                    setNoData(true);
                } else {
                    setUniversities(response.data);
                    setNoData(false);
                }
                setError('');
            })
            .catch(e => {
                if (e.response && e.response.status === 401) {
                    setError('Вы не имеете права просматривать этот контент.У вас нету доступ.');
                } else {
                    setError('An error occurred while retrieving data.');
                }
                setNoData(false);
                console.log(e);
            });
    };

    const setActiveUniversity = (university, index) => {
        setCurrentUniversity(university);
        setCurrentIndex(index);
        setFormData({
            name: university.name,
            location: university.location
        });
        setEditMode(false);
    };

    const refreshList = () => {
        retrieveUniversities();
        setCurrentUniversity(null);
        setCurrentIndex(-1);
        setEditMode(false);
    };

    const handleDeleteUniversity = id => {
        UniversityService.deleteUniversity(id)
            .then(response => {
                refreshList();
            })
            .catch(e => {
                console.log(e);
            });
    };

    const handleEditChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleEditUniversity = (event) => {
        event.preventDefault();
        UniversityService.updateUniversity(currentUniversity.id, formData)
            .then(response => {
                refreshList();
                setEditMode(false);
            })
            .catch(e => {
                console.log(e);
            });
    };

    return (
        <div className="list row">
            <div className="col-md-6">
                <h4>Universities List</h4>
                {error && <div className="alert alert-danger">{error}</div>}
                {noData && <div className="alert alert-warning">No universities available.</div>}
                <ul className="list-group">
                    {universities.map((university, index) => (
                        <li
                            className={"list-group-item " + (index === currentIndex ? "active" : "")}
                            onClick={() => setActiveUniversity(university, index)}
                            key={index}
                        >
                            {university.name}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="col-md-6">
                {currentUniversity && !editMode ? (
                    <div>
                        <h4>University</h4>
                        <div>
                            <label><strong>Name:</strong></label> {currentUniversity.name}
                        </div>
                        <div>
                            <label><strong>Location:</strong></label> {currentUniversity.location}
                        </div>
                        <button className="badge badge-primary mr-2" onClick={() => setEditMode(true)}>
                            <FaEdit /> Edit
                        </button>
                        <button className="badge badge-danger mr-2" onClick={() => handleDeleteUniversity(currentUniversity.id)}>
                            <FaTrash />  Delete
                        </button>
                    </div>
                ) : currentUniversity && editMode ? (
                    <form onSubmit={handleEditUniversity}>
                        <h4>Edit University</h4>
                        <div className="form-group">
                            <label htmlFor="name">Name:</label>
                            <input
                                type="text"
                                className="form-control"
                                id="name"
                                required
                                value={formData.name}
                                onChange={handleEditChange}
                                name="name"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="location">Location:</label>
                            <input
                                type="text"
                                className="form-control"
                                id="location"
                                required
                                value={formData.location}
                                onChange={handleEditChange}
                                name="location"
                            />
                        </div>
                        <button className="btn btn-success">
                            Save Changes
                        </button>
                        <button className="btn btn-secondary" onClick={() => setEditMode(false)}>
                            Cancel
                        </button>
                    </form>
                ) : (
                    <div>
                        <br />
                        <p>Please click on a University...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UniversitiesList;
