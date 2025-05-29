import React from 'react';
import Form from '../../components/Form/Form';
import { CCol, CFormInput, CFormLabel, CButton } from '@coreui/react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AddCity = () => {
    const [loading, setLoading] = React.useState(false);
    const [formData, setFormData] = React.useState({
        name: '',
    });

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
            const response = await axios.post('http://localhost:5001/api/v1/create_location', { name });
            toast.success(response.data.message || 'City added successfully!');
            setFormData({ name: '' }); // Reset the form
        } catch (error) {
            console.error('Error creating city:', error);
            toast.error(
                error?.response?.data?.message || 'Failed to create the city. Please try again later.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form
            heading="Add City"
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

export default AddCity;
