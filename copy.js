import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "./Homepage.css";

const Homepage = () => {
    const [students, setStudents] = useState([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [newStudent, setNewStudent] = useState({ name: '', subject: '', marks: '' });
    const [editStudentId, setEditStudentId] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    };

    const fetchStudents = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/students/getAll');
            setStudents(response.data.data);
        } catch (error) {
            console.error('Error fetching student data:', error);
            if (error.response) {
                console.log("Error response status:", error.response.status);
                console.log("Error response message:", error.response.data.message);
            }
        }
    };

    useEffect(() => {
        const sessionCookie = getCookie('connect.sid');
        if (!sessionCookie) {
            navigate('/loginpage');
        } else {
            fetchStudents();
        }
    }, [navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewStudent(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleAddStudent = async (e) => {
        e.preventDefault();
        try {
            const studentData = {
                ...newStudent,
                marks: parseInt(newStudent.marks, 10)
            };

            await axios.post('http://localhost:5000/api/students/create', studentData);
            fetchStudents();
            setIsPopupOpen(false);
            setNewStudent({ name: '', subject: '', marks: '' });
            setSuccessMessage('Student added successfully.');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            console.error('Error adding student:', error);
            if (error.response) {
                console.log("Error response status:", error.response.status);
                console.log("Error response message:", error.response.data.message);
                setErrorMessage(`Error: ${error.response.data.message}`);
            }
        }
    };

    const handleEdit = (studentId) => {
        const studentToEdit = students.find(student => student._id === studentId);
        if (studentToEdit) {
            setEditStudentId(studentId);
            setNewStudent({
                name: studentToEdit.name,
                subject: studentToEdit.subject,
                marks: studentToEdit.marks.toString()
            });
            setIsPopupOpen(true);
        }
    };

    const handleDelete = async (studentId) => {
        try {
            await axios.delete(`http://localhost:5000/api/students/delete/${studentId}`);
            fetchStudents();
            setSuccessMessage('Student deleted successfully.');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            console.error('Error deleting student:', error);
            if (error.response) {
                console.log("Error response status:", error.response.status);
                console.log("Error response message:", error.response.data.message);
                setErrorMessage(`Error: ${error.response.data.message}`);
            }
        }
    };

    const handleUpdateStudent = async (e) => {
        e.preventDefault();
        try {
            const studentData = {
                ...newStudent,
                marks: parseInt(newStudent.marks, 10)
            };

            await axios.put(`http://localhost:5000/api/students/update/${editStudentId}`, studentData);
            fetchStudents();
            setIsPopupOpen(false);
            setEditStudentId(null);
            setNewStudent({ name: '', subject: '', marks: '' });
            setSuccessMessage('Student updated successfully.');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            console.error('Error updating student:', error);
            if (error.response) {
                console.log("Error response status:", error.response.status);
                console.log("Error response message:", error.response.data.message);
                setErrorMessage(`Error: ${error.response.data.message}`);
            }
        }
    };

    const handleLogout = () => {
        document.cookie = 'connect.sid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        navigate('/loginpage');
    };

    return (
        <div className="homepage-container">
            <button className="logout-button" onClick={handleLogout}>Logout</button>
            <h2>Student Records</h2>
            <button className="add-button" onClick={() => setIsPopupOpen(true)}>Add</button>
            <div className='viewtable'>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Subject</th>
                        <th>Marks</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map(student => (
                        <tr key={student._id}>
                            <td>{student._id}</td>
                            <td>{student.name}</td>
                            <td>{student.subject}</td>
                            <td>{student.marks}</td>
                            <td>
                                <button className="edit-button" onClick={() => handleEdit(student._id)}>Edit</button>
                                <button className="delete-button" onClick={() => handleDelete(student._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>

            {isPopupOpen && (
                <div className="popup">
                    <div className="popup-inner">
                        <h2>{editStudentId ? 'Edit Student' : 'Add Student'}</h2>
                        <form onSubmit={editStudentId ? handleUpdateStudent : handleAddStudent}>
                            <div>
                                <label>Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={newStudent.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div>
                                <label>Subject</label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={newStudent.subject}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div>
                                <label>Marks</label>
                                <input
                                    type="number"
                                    name="marks"
                                    value={newStudent.marks}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <button type="submit" className="submit-button">{editStudentId ? 'Update' : 'Add'}</button>
                            <button type="button" className="cancel-button" onClick={() => setIsPopupOpen(false)}>Cancel</button>
                        </form>
                    </div>
                </div>
            )}

            {successMessage && (
                <div className="success-message">
                    {successMessage}
                </div>
            )}

            {errorMessage && (
                <div className="error-message">
                    {errorMessage}
                </div>
            )}
        </div>
    );
};

export default Homepage;
