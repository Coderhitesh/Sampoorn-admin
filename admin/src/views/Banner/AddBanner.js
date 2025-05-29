import React from 'react';
import Form from '../../components/Form/Form';
import { CCol, CFormInput, CFormLabel, CButton } from '@coreui/react';
import axios from 'axios';
import toast from 'react-hot-toast';

function AddHero() {
    const [loading, setLoading] = React.useState(false);
    const [heroFile, setHeroFile] = React.useState(null);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    };

    // Handle file selection
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setHeroFile(file);
    };

    // Submit the form
    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = new FormData();
        payload.append('image', heroFile);

        setLoading(true);
        try {
            const res = await axios.post('http://localhost:5001/api/v1/create_banner', payload, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            toast.success('Banner added successfully!');
            setHeroFile(null);
        } catch (error) {
            console.log('Error submitting banner:', error);
            toast.error(
                error?.response?.data?.errors?.[0] ||
                error?.response?.data?.message ||
                'Failed to add the Banner. Please try again later.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Form
                heading="Add Banner"
                btnText="Back"
                btnURL="/hero/all-heroes"
                onSubmit={handleSubmit}
                formContent={
                    <>

                        {/* Upload Image Field */}
                        <CCol md={6} lg={6} xl={6} sm={12}>
                            <CFormLabel className="form_label" htmlFor="image">
                                Upload Image
                            </CFormLabel>
                            <CFormInput
                                type="file"
                                id="image"
                                name="image"
                                accept="image/*"
                                onChange={handleFileChange}
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
        </>
    );
}

export default AddHero;
