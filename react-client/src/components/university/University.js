// src/components/University.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import UniversityService from '../../services/university.service';

export default function University() {
    const [university, setUniversity] = useState(null);
    const { id } = useParams(); // Get the university ID from URL parameters

    useEffect(() => {
        UniversityService.getUniversityById(id)
            .then(response => {
                setUniversity(response.data);
            })
            .catch(e => {
                console.log("Error fetching university details:", e);
            });
    }, [id]);

    return (
        <div>
            {university ? (
                <div>
                    <h3>{university.name}</h3>
                    <p>Location: {university.location}</p>
                </div>
            ) : (
                <p>Loading university details...</p>
            )}
        </div>
    );
}
