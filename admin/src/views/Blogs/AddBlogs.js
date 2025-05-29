import React, { useMemo, useRef, useState } from 'react';
import { CCol, CFormInput, CFormLabel, CButton } from '@coreui/react';
import axios from 'axios';
import toast from 'react-hot-toast';
import JoditEditor from 'jodit-react';
import Form from '../../components/Form/Form';

function AddBlogs() {
    const editor = useRef(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        author: 'Admin',
        content: '',
    });
    const [image, setImage] = useState(null);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Handle file selection
    const handleFileChange = (e) => {
        setImage(e.target.files[0]);
    };

    // Submit the form
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title || !formData.author || !formData.content || !image) {
            toast.error('Please fill out all fields and upload an image.');
            return;
        }

        const payload = new FormData();
        payload.append('title', formData.title);
        payload.append('author', formData.author);
        payload.append('content', formData.content);
        payload.append('image', image);

        setLoading(true);
        try {
            const res = await axios.post('http://localhost:5001/api/v1/create_blog', payload, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            toast.success(res.data.message);
            // Reset the form
            setFormData({ title: '', author: 'Admin', content: '' });
            setImage(null);
        } catch (error) {
            console.error('Error submitting blog:', error);
            toast.error(error?.response?.data?.message || 'Failed to add the blog. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const config = useMemo(
        () => ({ readonly: false, placeholder: 'Start typing...', height: 400 }),
        []
    );

    return (
        <Form
            heading="Add Blog"
            btnText="Back"
            btnURL="/blogs/all_blogs"
            onSubmit={handleSubmit}
            formContent={
                <>
                    <CCol md={6}>
                        <CFormLabel htmlFor="image">Upload Image</CFormLabel>
                        <CFormInput
                            type="file"
                            id="image"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </CCol>

                    <CCol md={6}>
                        <CFormLabel htmlFor="title">Title</CFormLabel>
                        <CFormInput
                            id="title"
                            name="title"
                            placeholder="Enter blog title"
                            value={formData.title}
                            onChange={handleChange}
                        />
                    </CCol>

                    <CCol md={6}>
                        <CFormLabel htmlFor="author">Author</CFormLabel>
                        <CFormInput
                            id="author"
                            name="author"
                            value={formData.author}
                            disabled
                        />
                    </CCol>

                    <CCol md={12} className="mt-3">
                        <CFormLabel>Content</CFormLabel>
                        <JoditEditor
                            ref={editor}
                            value={formData.content}
                            config={config}
                            tabIndex={1}
                            onBlur={(newContent) =>
                                setFormData((prev) => ({ ...prev, content: newContent }))
                            }
                        />
                    </CCol>

                    <CCol xs={12} className="mt-4">
                        <CButton color="primary" type="submit" disabled={loading}>
                            {loading ? 'Please Wait...' : 'Submit'}
                        </CButton>
                    </CCol>
                </>
            }
        />
    );
}

export default AddBlogs;