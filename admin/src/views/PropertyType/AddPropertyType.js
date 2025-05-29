import React from 'react';
import Form from '../../components/Form/Form';
import { CCol, CFormInput, CFormLabel, CButton } from '@coreui/react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AddPropertyType = () => {
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
            toast.error('Property type name is required');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post('http://localhost:5001/api/v1/create_propertyType', { name });
            toast.success(response.data.message || 'Property Type added successfully!');
            setFormData({ name: '' }); // Reset the form
        } catch (error) {
            console.error('Error creating Property Type:', error);
            toast.error(
                error?.response?.data?.message || 'Failed to create the Property Type. Please try again later.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form
            heading="Add Property Type"
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

export default AddPropertyType;
