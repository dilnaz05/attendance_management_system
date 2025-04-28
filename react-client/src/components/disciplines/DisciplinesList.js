import React, { useState, useEffect } from 'react';
import DisciplineService from '../../services/discipline.service';
import { FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';

function DisciplinesList() {
    const [disciplines, setDisciplines] = useState([]);
    const [currentDiscipline, setCurrentDiscipline] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [editing, setEditing] = useState(false);
    const [editName, setEditName] = useState('');
    const [error, setError] = useState('');
    const [noData, setNoData] = useState(false);

    useEffect(() => {
        retrieveDisciplines();
    }, []);

    const retrieveDisciplines = () => {
        DisciplineService.getAll()
            .then(response => {
                if (response.data.length === 0) {
                    setNoData(true);
                } else {
                    setDisciplines(response.data);
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

    const setActiveDiscipline = (discipline, index) => {
        setCurrentDiscipline(discipline);
        setCurrentIndex(index);
        setEditName(discipline.name);
        setEditing(false);
    };

    const deleteDiscipline = (id) => {
        DisciplineService.delete(id)
            .then(() => {
                retrieveDisciplines();
            })
            .catch(e => {
                console.log(e);
            });
    };

    const updateDiscipline = (id, updatedName) => {
        DisciplineService.update(id, { name: updatedName })
            .then(() => {
                retrieveDisciplines();
            })
            .catch(e => {
                console.log(e);
            });
    };

    const handleEditInputChange = (event) => {
        setEditName(event.target.value);
    };

    const handleUpdateClick = () => {
        updateDiscipline(currentDiscipline.id, editName);
        setEditing(false);
    };

    return (
        <div className="list row">
            <div className="col-md-6">
                <h4>Disciplines List</h4>
                {error && <div className="alert alert-danger">{error}</div>}
                {noData && <div className="alert alert-warning">No disciplines available.</div>}
                <ul className="list-group">
                    {disciplines.map((discipline, index) => (
                        <li
                            className={"list-group-item " + (index === currentIndex ? "active" : "")}
                            onClick={() => setActiveDiscipline(discipline, index)}
                            key={index}>
                            {discipline.name}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="col-md-6">
                {currentDiscipline && (
                    <div className="card">
                        {editing ? (
                            <div className="card-body">
                                <h4>Edit Discipline</h4>
                                <div className="form-group">
                                    <label htmlFor="name">Name</label>
                                    <input type="text" className="form-control" id="name" required value={editName} onChange={handleEditInputChange} />
                                </div>
                                <button onClick={handleUpdateClick} className="btn btn-success">
                                    <FaSave /> Update
                                </button>
                                <button onClick={() => setEditing(false)} className="btn btn-secondary">
                                    <FaTimes /> Cancel
                                </button>
                            </div>
                        ) : (
                            <div className="card-body">
                                <h4>Discipline</h4>
                                <div>
                                    <label><strong>Name:</strong></label> {currentDiscipline.name}
                                </div>
                                <button onClick={() => setEditing(true)} className="btn btn-primary">
                                    <FaEdit /> Edit
                                </button>
                                <button onClick={() => deleteDiscipline(currentDiscipline.id)} className="btn btn-danger">
                                    <FaTrash /> Delete
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default DisciplinesList;
