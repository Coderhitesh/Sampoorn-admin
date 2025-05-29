import React, { useEffect } from 'react';
import Form from '../../components/Form/Form';
import { CCol, CFormInput, CFormLabel, CButton } from '@coreui/react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const EditCity = () => {
    const [loading, setLoading] = React.useState(false);
    const [formData, setFormData] = React.useState({
        name: '',
    });
    const { id } = useParams(); // Get the city ID from the route
    const navigate = useNavigate(); // For redirection after updating

    // Fetch existing city details
    const fetchCityDetails = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`http://localhost:5001/api/v1/get_location/${id}`);
            setFormData({ name: data.data.name }); // Assuming data contains the city's name
        } catch (error) {
            console.error('Error fetching city details:', error);
            toast.error('Failed to load city details. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchCityDetails();
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
        const { name } = formData;

        // Validate input
        if (!name) {
            toast.error('City name is required');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.put(`http://localhost:5001/api/v1/update_location/${id}`, { name });
            toast.success(response.data.message || 'City updated successfully!');
            navigate('/location/all-location'); // Redirect to the list page after update
        } catch (error) {
            console.error('Error updating city:', error);
            toast.error(
                error?.response?.data?.message || 'Failed to update the city. Please try again later.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form
            heading="Edit City"
            btnText="Back"
            btnURL="/location/all-location"
            onSubmit={handleSubmit}
            formContent={
                <>
                    {/* City Name Field */}
                    <CCol md={6} lg={6} xl={6} sm={12}>
                        <CFormLabel className="form_label" htmlFor="name">
                            City Name
                        </CFormLabel>
                        <CFormInput
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            placeholder="Enter city name"
                            onChange={handleChange}
                        />
                    </CCol>

                    {/* Submit Button */}
                    <CCol xs={12} className="mt-3">
                        <CButton color="primary" type="submit" disabled={loading}>
                            {loading ? 'Please Wait...' : 'Submit'}
                        </CButton>
                    </CCol>
                </>
            }
        />
    );
};

export default EditCity;
