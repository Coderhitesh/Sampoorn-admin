import React, { useEffect, useState } from 'react';
import Form from '../../components/Form/Form';
import { CCol, CFormInput, CFormLabel, CButton } from '@coreui/react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const EditNewsRoom = () => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        url: '',
    });

    const { id } = useParams(); // Get the NewsRoom ID from the route
    const navigate = useNavigate(); // Navigation after update

    // Fetch existing NewsRoom details
    const fetchNewsRoomDetails = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`http://localhost:5001/api/v1/get_single_news/${id}`);
            setFormData({
                title: data.data.title,
                url: data.data.url,
            });
        } catch (error) {
            console.error('Error fetching NewsRoom details:', error);
            toast.error('Failed to load NewsRoom details. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchNewsRoomDetails();
        }
    }, [id]);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    };

    // Submit the form
    const handleSubmit = async (e) => {
        e.preventDefault();
        const { title, url } = formData;

        // Validate input
        if (!title || !url) {
            toast.error('Title and URL are required');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.put(`http://localhost:5001/api/v1/update_news/${id}`, { title, url });
            toast.success(response.data.message || 'NewsRoom updated successfully!');
            navigate('#/news-room/all-news-room'); // Redirect to the list page after update
        } catch (error) {
            console.error('Error updating NewsRoom:', error);
            toast.error(
                error?.response?.data?.message || 'Failed to update NewsRoom. Please try again later.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form
            heading="Edit NewsRoom"
            btnText="Back"
            btnURL="/news-room/all-news-room"
            onSubmit={handleSubmit}
            formContent={
                <>
                    {/* Title Field */}
                    <CCol md={6} lg={6} xl={6} sm={12}>
                        <CFormLabel className="form_label" htmlFor="title">
                            News Title
                        </CFormLabel>
                        <CFormInput
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            placeholder="Enter news title"
                            onChange={handleChange}
                        />
                    </CCol>

                    {/* URL Field */}
                    <CCol md={6} lg={6} xl={6} sm={12} className="mt-3">
                        <CFormLabel className="form_label" htmlFor="url">
                            News URL
                        </CFormLabel>
                        <CFormInput
                            type="text"
                            id="url"
                            name="url"
                            value={formData.url}
                            placeholder="Enter news URL"
                            onChange={handleChange}
                        />
                    </CCol>

                    {/* Submit Button */}
                    <CCol xs={12} className="mt-3">
                        <CButton color="primary" type="submit" disabled={loading}>
                            {loading ? 'Please Wait...' : 'Update'}
                        </CButton>
                    </CCol>
                </>
            }
        />
    );
};

export default EditNewsRoom;
