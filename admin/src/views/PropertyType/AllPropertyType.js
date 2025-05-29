import React from 'react';
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

const AllPropertyType = () => {
    const [propertyTypes, setPropertyTypes] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [currentPage, setCurrentPage] = React.useState(1);
    const itemsPerPage = 10;

    // Fetch all property types
    const fetchPropertyTypes = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('http://localhost:5001/api/v1/get_propertyTypes');
            setPropertyTypes(data.data); // Assuming data is returned in the `data` field
        } catch (error) {
            console.error('Error fetching property types:', error);
            toast.error('Failed to load property types. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchPropertyTypes();
    }, []);

    // Delete property type
    const handleDeletePropertyType = async (id) => {
        try {
            setLoading(true);
            await axios.delete(`http://localhost:5001/api/v1/delete_propertyType/${id}`);
            setPropertyTypes((prevPropertyTypes) => prevPropertyTypes.filter((type) => type._id !== id));
            toast.success('Property Type deleted successfully');
        } catch (error) {
            console.error('Error deleting property type:', error);
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
                handleDeletePropertyType(id);
            }
        });
    };

    // Calculate paginated data
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = propertyTypes.slice(startIndex, startIndex + itemsPerPage);

    // Calculate total pages
    const totalPages = Math.ceil(propertyTypes.length / itemsPerPage);

    // Handle page change
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const tableHeading = ['S.No', 'Property Type Name', 'Action'];

    return (
        <>
            {loading ? (
                <div className="spin-style">
                    <CSpinner color="primary" variant="grow" />
                </div>
            ) : (
                <Table
                    heading="All Property Types"
                    btnText="Add Property Type"
                    btnURL="/property-type/add-property-type"
                    tableHeading={tableHeading}
                    tableContent={
                        currentData &&
                        currentData.map((item, index) => (
                            <CTableRow key={index}>
                                <CTableDataCell>{startIndex + index + 1}</CTableDataCell>
                                <CTableDataCell className="table-text">{item.name}</CTableDataCell>
                                <CTableDataCell>
                                    <div className="action-parent">
                                        <CNavLink href={`#/property-type/edit-property-type/${item._id}`} className="edit">
                                            <i className="ri-pencil-fill"></i>
                                        </CNavLink>
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

export default AllPropertyType;
