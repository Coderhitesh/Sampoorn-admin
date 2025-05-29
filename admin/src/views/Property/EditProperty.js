import React, { useState, useEffect } from 'react';
import Form from '../../components/Form/Form';
import { CCol, CFormInput, CFormLabel, CButton, CFormSelect, CFormTextarea } from '@coreui/react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useParams, useNavigate } from 'react-router-dom';

const EditProperty = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [locations, setLocations] = useState([]);
    const [propertyTypes, setPropertyTypes] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        completeAddress: '',
        startingPrice: '',
        location: '',
        propertyType: '',
        status: '',
        MetaTitle: '',
        MetaDescription: '',
        MetaKeywords: '',
        rating: 0,
    });
    const [image, setImage] = useState(null);

    // Fetch locations, property types, and existing property data on component mount
    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const response = await axios.get('http://localhost:5001/api/v1/get_locations');
                setLocations(response.data.data || []);
            } catch (error) {
                console.error('Error fetching locations:', error);
                toast.error('Failed to load locations.');
            }
        };

        const fetchPropertyTypes = async () => {
            try {
                const response = await axios.get('http://localhost:5001/api/v1/get_propertyTypes');
                setPropertyTypes(response.data.data || []);
            } catch (error) {
                console.error('Error fetching property types:', error);
                toast.error('Failed to load property types.');
            }
        };

        const fetchPropertyData = async () => {
            try {
                const response = await axios.get(`http://localhost:5001/api/v1/get_property/${id}`);
                const data = response.data.data;
                console.log("response.data.data",data.status)
                setFormData({
                    name: data.name || '',
                    description: data.description || '',
                    completeAddress: data.completeAddress || '',
                    startingPrice: data.startingPrice || '',
                    location: data.location._id || '',
                    propertyType: data.propertyType._id || '',
                    status: data.status || '',
                    MetaTitle: data.MetaTitle || '',
                    MetaDescription: data.MetaDescription || '',
                    MetaKeywords: data.MetaKeywords || '',
                    rating: data.rating || 0,
                });
            } catch (error) {
                console.error('Error fetching property data:', error);
                toast.error('Failed to load property data.');
                navigate('/property/all-properties');
            }
        };

        fetchLocations();
        fetchPropertyTypes();
        fetchPropertyData();
    }, [id, navigate]);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Handle image change
    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    // Submit the form
    const handleSubmit = async (e) => {
        e.preventDefault();
        const {
            name,
            description,
            completeAddress,
            startingPrice,
            location,
            propertyType,
            status,
            MetaTitle,
            MetaDescription,
            MetaKeywords,
            rating,
        } = formData;

        // Validate input fields
        if (!name || !description || !completeAddress || !startingPrice || !location || !propertyType || !status || !MetaTitle || !MetaDescription || !MetaKeywords) {
            toast.error('Please fill in all required fields.');
            return;
        }

        setLoading(true);
        try {
            const formDataObj = new FormData();
            formDataObj.append('name', name);
            formDataObj.append('description', description);
            formDataObj.append('completeAddress', completeAddress);
            formDataObj.append('startingPrice', startingPrice);
            formDataObj.append('location', location);
            formDataObj.append('propertyType', propertyType);
            formDataObj.append('status', status);
            formDataObj.append('MetaTitle', MetaTitle);
            formDataObj.append('MetaDescription', MetaDescription);
            formDataObj.append('MetaKeywords', MetaKeywords);
            formDataObj.append('rating', rating);
            if (image) formDataObj.append('image', image);

            const response = await axios.put(`http://localhost:5001/api/v1/update_property/${id}`, formDataObj, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            toast.success(response.data.message || 'Property updated successfully!');
            // navigate('/property/all-properties');
        } catch (error) {
            console.error('Error updating property:', error);
            toast.error(error?.response?.data?.message || 'Failed to update property. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form
        heading="Edit Property"
        btnText="Back"
        btnURL="/property/all-property"
        onSubmit={handleSubmit}
        formContent={
                <>
                    {/* Name */}
                    <CCol md={6}>
                        <CFormLabel htmlFor="name">Property Name</CFormLabel>
                        <CFormInput
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            placeholder="Enter property name"
                            onChange={handleChange}
                        />
                    </CCol>

                    {/* Description */}
                    <CCol md={6}>
                        <CFormLabel htmlFor="description">Description</CFormLabel>
                        <CFormTextarea
                            id="description"
                            name="description"
                            value={formData.description}
                            placeholder="Enter property description"
                            onChange={handleChange}
                        />
                    </CCol>

                    {/* Complete Address */}
                    <CCol md={6}>
                        <CFormLabel htmlFor="completeAddress">Complete Address</CFormLabel>
                        <CFormInput
                            type="text"
                            id="completeAddress"
                            name="completeAddress"
                            value={formData.completeAddress}
                            placeholder="Enter complete address"
                            onChange={handleChange}
                        />
                    </CCol>

                    {/* Starting Price */}
                    <CCol md={6}>
                        <CFormLabel htmlFor="startingPrice">Starting Price</CFormLabel>
                        <CFormInput
                            type="number"
                            id="startingPrice"
                            name="startingPrice"
                            value={formData.startingPrice}
                            placeholder="Enter starting price"
                            onChange={handleChange}
                        />
                    </CCol>

                    {/* Location Dropdown */}
                    <CCol md={6}>
                        <CFormLabel htmlFor="location">Location</CFormLabel>
                        <CFormSelect
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                        >
                            <option value="">Select Location</option>
                            {locations.map((loc) => (
                                <option key={loc._id} value={loc._id}>
                                    {loc.name}
                                </option>
                            ))}
                        </CFormSelect>
                    </CCol>

                    {/* Property Type Dropdown */}
                    <CCol md={6}>
                        <CFormLabel htmlFor="propertyType">Property Type</CFormLabel>
                        <CFormSelect
                            id="propertyType"
                            name="propertyType"
                            value={formData.propertyType}
                            onChange={handleChange}
                        >
                            <option value="">Select Property Type</option>
                            {propertyTypes.map((type) => (
                                <option key={type._id} value={type._id}>
                                    {type.name}
                                </option>
                            ))}
                        </CFormSelect>
                    </CCol>

                    {/* Status */}
                    <CCol md={6}>
                        <CFormLabel htmlFor="status">Status</CFormLabel>
                        <CFormInput
                            type="text"
                            id="status"
                            name="status"
                            value={formData.status}
                            placeholder="Enter Property Status"
                            onChange={handleChange}
                        />
                    </CCol>

                    {/* Meta Title */}
                    <CCol md={6}>
                        <CFormLabel htmlFor="MetaTitle">Meta Title</CFormLabel>
                        <CFormInput
                            type="text"
                            id="MetaTitle"
                            name="MetaTitle"
                            value={formData.MetaTitle}
                            placeholder="Enter Meta Title"
                            onChange={handleChange}
                        />
                    </CCol>

                    {/* Meta Description */}
                    <CCol md={6}>
                        <CFormLabel htmlFor="MetaDescription">Meta Description</CFormLabel>
                        <CFormTextarea
                            id="MetaDescription"
                            name="MetaDescription"
                            value={formData.MetaDescription}
                            placeholder="Enter Meta Description"
                            onChange={handleChange}
                        />
                    </CCol>

                    {/* Meta Keywords */}
                    <CCol md={6}>
                        <CFormLabel htmlFor="MetaKeywords">Meta Keywords</CFormLabel>
                        <CFormInput
                            type="text"
                            id="MetaKeywords"
                            name="MetaKeywords"
                            value={formData.MetaKeywords}
                            placeholder="Enter Meta Keywords"
                            onChange={handleChange}
                        />
                    </CCol>

                    {/* Rating */}
                    <CCol md={6}>
                        <CFormLabel htmlFor="rating">Rating</CFormLabel>
                        <CFormInput
                            type="number"
                            id="rating"
                            name="rating"
                            value={formData.rating}
                            placeholder="Enter rating"
                            onChange={handleChange}
                        />
                    </CCol>

                    {/* Image */}
                    <CCol md={6}>
                        <CFormLabel htmlFor="image">Image</CFormLabel>
                        <CFormInput
                            type="file"
                            id="image"
                            name="image"
                            onChange={handleImageChange}
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

export default EditProperty
