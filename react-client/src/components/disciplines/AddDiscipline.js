import React, { useState } from 'react';
import DisciplineService from '../../services/discipline.service';

function AddDiscipline() {
    const [name, setName] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleInputChange = event => {
        setName(event.target.value);
    };

    const saveDiscipline = () => {
        var data = {
            name: name
        };

        DisciplineService.create(data)
            .then(response => {
                setSubmitted(true);
                console.log(response.data);
            })
            .catch(e => {
                console.log(e);
            });
    };

    const newDiscipline = () => {
        setName('');
        setSubmitted(false);
    };

    return (
        <div className="submit-form">
            {submitted ? (
                <div>
                    <h4>You submitted successfully!</h4>
                    <button className="btn btn-success" onClick={newDiscipline}>
                        Add
                    </button>
                </div>
            ) : (
                <div>
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="name"
                            required
                            value={name}
                            onChange={handleInputChange}
                            name="name"
                        />
                    </div>

                    <button onClick={saveDiscipline} className="btn btn-success">
                        Submit
                    </button>
                </div>
            )}
        </div>
    );
}

export default AddDiscipline;
