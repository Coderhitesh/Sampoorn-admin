import React, { useEffect } from 'react';
import Form from '../../components/Form/Form';
import { CCol, CFormInput, CFormLabel, CButton } from '@coreui/react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const EditPropertyType = () => {
    const [loading, setLoading] = React.useState(false);
    const [formData, setFormData] = React.useState({
        name: '',
    });
    const { id } = useParams(); // Get the property type ID from the route
    const navigate = useNavigate(); // For redirection after updating

    // Fetch existing property type details
    const fetchPropertyTypeDetails = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`http://localhost:5001/api/v1/get_propertyType/${id}`);
            setFormData({ name: data.data.name }); // Assuming the API returns the property type's name in `data`
        } catch (error) {
            console.error('Error fetching property type details:', error);
            toast.error('Failed to load property type details. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchPropertyTypeDetails();
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
            toast.error('Property type name is required');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.put(`http://localhost:5001/api/v1/update_propertyType/${id}`, { name });
            toast.success(response.data.message || 'Property Type updated successfully!');
            navigate('/property-type/all-property-type'); // Redirect to the list page after update
        } catch (error) {
            console.error('Error updating property type:', error);
            toast.error(
                error?.response?.data?.message || 'Failed to update the property type. Please try again later.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form
            heading="Edit Property Type"
            btnText="Back"
            btnURL="/property-type/all-property-type"
            onSubmit={handleSubmit}
            formContent={
                <>
                    {/* Property Type Name Field */}
                    <CCol md={6} lg={6} xl={6} sm={12}>
                        <CFormLabel className="form_label" htmlFor="name">
                            Property Type Name
                        </CFormLabel>
                        <CFormInput
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            placeholder="Enter property type name"
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

export default EditPropertyType;
