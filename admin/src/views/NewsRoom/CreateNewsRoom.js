import React from 'react';
import Form from '../../components/Form/Form';
import { CCol, CFormInput, CFormLabel, CButton } from '@coreui/react';
import axios from 'axios';
import toast from 'react-hot-toast';

const CreateNewsRoom = () => {
    const [loading, setLoading] = React.useState(false);
    const [formData, setFormData] = React.useState({
        title: '',
        url: ''
    });

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
        const emptyFields = [];
        if (!title) emptyFields.push("title");
        if (!url) emptyFields.push("url");
        
        if (emptyFields.length > 0) {
            toast.error(`Please fill the following fields: ${emptyFields.join(", ")}`);
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post('http://localhost:5001/api/v1/create_news', { title, url });
            toast.success(response.data.message || 'NewsRoom created successfully!');
            setFormData({ title: '', url: '' }); // Reset the form
        } catch (error) {
            console.error('Error creating NewsRoom:', error);
            toast.error(
                error?.response?.data?.message || 'Failed to create the NewsRoom. Please try again later.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form
            heading="Add NewsRoom"
            btnText="Back"
            btnURL="/news-room/all-news-room"
            onSubmit={handleSubmit}
            formContent={
                <>
                    {/* News Title Field */}
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

                    {/* News URL Field */}
                    <CCol md={6} lg={6} xl={6} sm={12}>
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
                            {loading ? 'Please Wait...' : 'Submit'}
                        </CButton>
                    </CCol>
                </>
            }
        />
    );
};

export default CreateNewsRoom;
