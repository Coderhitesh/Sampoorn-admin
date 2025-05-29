import React, { useEffect, useState } from 'react';
import {
    CTableDataCell,
    CTableRow,
    CSpinner,
    CPagination,
    CPaginationItem,
    CNavLink,
} from '@coreui/react';
import Table from '../../components/Table/Table';
import axios from 'axios';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const AllProperty = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Fetch all properties
    const fetchProperties = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('http://localhost:5001/api/v1/get_properties');
            setProperties(data.data); // Assuming data is returned in the `data` field
        } catch (error) {
            console.error('Error fetching properties:', error);
            toast.error('Failed to load properties. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProperties();
    }, []);

    // Delete property
    const handleDeleteProperty = async (id, publicId) => {
        try {
            setLoading(true);
            await axios.delete(`http://localhost:5001/api/v1/delete_property/${id}`, {
                data: { publicId },
            });
            setProperties((prev) => prev.filter((property) => property._id !== id));
            toast.success('Property deleted successfully');
        } catch (error) {
            console.error('Error deleting property:', error);
            toast.error(error?.response?.data?.message || 'Please try again later');
        } finally {
            setLoading(false);
        }
    };

    // Confirm delete
    const confirmDelete = (id, publicId) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'This action cannot be undone!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
        }).then((result) => {
            if (result.isConfirmed) {
                handleDeleteProperty(id, publicId);
            }
        });
    };

    // Pagination calculations
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = properties.slice(startIndex, startIndex + itemsPerPage);
    const totalPages = Math.ceil(properties.length / itemsPerPage);

    // Handle page change
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const tableHeading = ['S.No', 'Property Name', 'Location', 'Price', 'Actions'];

    return (
        <>
            {loading ? (
                <div className="spin-style">
                    <CSpinner color="primary" variant="grow" />
                </div>
            ) : (
                <Table
                    heading="All Properties"
                    btnText="Add Property"
                    btnURL="/property/add-property"
                    tableHeading={tableHeading}
                    tableContent={
                        currentData &&
                        currentData.map((item, index) => (
                            <CTableRow key={item._id}>
                                <CTableDataCell>{startIndex + index + 1}</CTableDataCell>
                                <CTableDataCell className="table-text">{item.name}</CTableDataCell>
                                <CTableDataCell>{item.location?.name || 'N/A'}</CTableDataCell>
                                <CTableDataCell>{`₹${item.startingPrice}`}</CTableDataCell>
                                <CTableDataCell>
                                    <div className="action-parent">
                                        <CNavLink href={`#/property/edit-property/${item._id}`} className="edit">
                                            <i className="ri-pencil-fill"></i>
                                        </CNavLink>
                                        <div
                                            className="delete"
                                            onClick={() => confirmDelete(item._id, item.image?.public_id)}
                                        >
                                            <i className="ri-delete-bin-fill"></i>
                                        </div>
                                    </div>
                                </CTableDataCell>
                            </CTableRow>
                        ))
                    }
                    pagination={
                        <CPagination className="justify-content-center" aria-label="Page navigation example">
                            <CPaginationItem
                                disabled={currentPage === 1}
                                onClick={() => handlePageChange(currentPage - 1)}
                            >
                                Previous
                            </CPaginationItem>
                            {Array.from({ length: totalPages }, (_, index) => (
                                <CPaginationItem
                                    key={index}
                                    active={index + 1 === currentPage}
                                    onClick={() => handlePageChange(index + 1)}
                                >
                                    {index + 1}
                                </CPaginationItem>
                            ))}
                            <CPaginationItem
                                disabled={currentPage === totalPages}
                                onClick={() => handlePageChange(currentPage + 1)}
                            >
                                Next
                            </CPaginationItem>
                        </CPagination>
                    }
                />
            )}
        </>
    );
};

export default AllProperty;
