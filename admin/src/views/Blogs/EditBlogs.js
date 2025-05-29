import React, { useMemo, useRef, useEffect, useState } from 'react';
import { CCol, CFormInput, CFormLabel, CButton } from '@coreui/react';
import axios from 'axios';
import toast from 'react-hot-toast';
import JoditEditor from 'jodit-react';
import Form from '../../components/Form/Form';
import { useParams } from 'react-router-dom';

function EditBlogs() {
    const { id } = useParams();
    const editor = useRef(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
    });
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const fetchBlog = async () => {
        try {
            const { data } = await axios.get(`http://localhost:5001/api/v1/get_blog/${id}`);
            const blog = data.data;
            setFormData({
                title: blog.title,
                author: blog.author,
                content: blog.content,
            });
            setImagePreview(blog.image?.url || '');
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Error fetching blog data');
        }
    };

    useEffect(() => {
        fetchBlog();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.title || !formData.author || !formData.content) {
            toast.error('Please fill out all required fields.');
            return;
        }

        const payload = new FormData();
        payload.append('title', formData.title);
        payload.append('author', formData.author);
        payload.append('content', formData.content);
        if (image) payload.append('image', image);

        setLoading(true);
        try {
            const res = await axios.put(`http://localhost:5001/api/v1/update_blog/${id}`, payload, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            toast.success(res.data.message);
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Error updating blog');
        } finally {
            setLoading(false);
        }
    };

    const config = useMemo(() => ({ readonly: false, height: 400 }), []);

    return (
        <Form
            heading="Edit Blog"
            btnText="Back"
            btnURL="/blogs/all_blogs"
            onSubmit={handleSubmit}
            formContent={
                <>
                    <CCol md={6}>
                        <CFormLabel htmlFor="image">Upload Image</CFormLabel>
                        {imagePreview && (
                            <div className="mb-3">
                                <img src={imagePreview} alt="Preview" style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '10px' }} />
                            </div>
                        )}
                        <CFormInput type="file" id="image" accept="image/*" onChange={handleFileChange} />
                    </CCol>
                    <CCol md={6}>
                        <CFormLabel htmlFor="title">Title</CFormLabel>
                        <CFormInput id="title" name="title" value={formData.title} onChange={handleChange} />
                    </CCol>
                    <CCol md={6}>
                        <CFormLabel htmlFor="author">Author</CFormLabel>
                        <CFormInput id="author" name="author" disabled value={formData.author} onChange={handleChange} />
                    </CCol>
                    <CCol md={12} className="mt-3">
                        <CFormLabel>Content</CFormLabel>
                        <JoditEditor ref={editor} value={formData.content} config={config} onBlur={(newContent) => setFormData((prev) => ({ ...prev, content: newContent }))} />
                    </CCol>
                    <CCol xs={12} className="mt-4">
                        <CButton color="primary" type="submit" disabled={loading}>{loading ? 'Please Wait...' : 'Submit'}</CButton>
                    </CCol>
                </>
            }
        />
    );
}

export default EditBlogs;