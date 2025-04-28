import React, { useState } from 'react';
import UniversityService from '../../services/university.service';

export default function AddUniversity() {
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');

    const handleSave = () => {
        UniversityService.createUniversity({ name, location })
            .then(response => {
                console.log("University added:", response.data);
                setName('');
                setLocation('');
            })
            .catch(e => {
                console.error("Error adding university:", e);
            });
    };

    return (
        <div>
            <h4>Add University</h4>
            <div>
                <label>Name:</label>
                <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                />
            </div>
            <div>
                <label>Location:</label>
                <input
                    type="text"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                />
            </div>
            <button onClick={handleSave}>Save</button>
        </div>
    );
}
