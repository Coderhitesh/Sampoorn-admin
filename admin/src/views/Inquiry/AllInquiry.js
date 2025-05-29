import React, { useEffect, useState } from 'react';
import {
    CTableDataCell,
    CTableRow,
    CSpinner,
    CPagination,
    CPaginationItem,
    CNavLink,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CButton,
} from '@coreui/react';
import Table from '../../components/Table/Table';
import axios from 'axios';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const AllInquiry = () => {
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Fetch all property inquiries
    const fetchPropertyInquiries = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('http://localhost:5001/api/v1/get_inquiries');
            const allData = data.data;
            setInquiries(allData.reverse()); // Assuming data is returned in the `data` field
        } catch (error) {
            console.error('Error fetching inquiries:', error);
            toast.error('Failed to load inquiries. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPropertyInquiries();
    }, []);

    // Delete inquiry
    const handleDeleteInquiry = async (id) => {
        try {
            setLoading(true);
            await axios.delete(`http://localhost:5001/api/v1/delete_inquiry/${id}`);
            setInquiries((prev) => prev.filter((inquiry) => inquiry._id !== id));
            toast.success('Inquiry deleted successfully');
        } catch (error) {
            console.error('Error deleting inquiry:', error);
            toast.error(error?.response?.data?.message || 'Please try again later');
        } finally {
            setLoading(false);
        }
    };

    // Confirm delete
    const confirmDelete = (id) => {
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
                handleDeleteInquiry(id);
            }
        });
    };

    // Pagination calculations
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = inquiries.slice(startIndex, startIndex + itemsPerPage);
    const totalPages = Math.ceil(inquiries.length / itemsPerPage);

    // Handle page change
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const tableHeading = ['S.No', 'Name', 'Email', 'Phone', 'Message', 'Actions'];

    return (
        <>
            {loading ? (
                <div className="spin-style">
                    <CSpinner color="primary" variant="grow" />
                </div>
            ) : (
                <Table
                    heading="All Property Inquiries"
                    tableHeading={tableHeading}
                    tableContent={
                        currentData &&
                        currentData.map((item, index) => (
                            <CTableRow key={item._id}>
                                <CTableDataCell>{startIndex + index + 1}</CTableDataCell>
                                <CTableDataCell className="table-text">{item.name}</CTableDataCell>
                                <CTableDataCell>{item.email}</CTableDataCell>
                                <CTableDataCell>{item.phone}</CTableDataCell>
                                <CTableDataCell>{item.message}</CTableDataCell>
                                <CTableDataCell>
                                    <div className="action-parent">
                                        <div
                                            className="delete"
                                            onClick={() => confirmDelete(item._id)}
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

export default AllInquiry
