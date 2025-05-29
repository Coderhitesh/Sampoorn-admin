import React from 'react';
import {
    CTableDataCell,
    CTableRow,
    CSpinner,
    CPagination,
    CPaginationItem,
    CFormSwitch,
    CNavLink,
} from '@coreui/react';
import Table from '../../components/Table/Table';
import axios from 'axios';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

function AllHero() {
    const [heroes, setHeroes] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [currentPage, setCurrentPage] = React.useState(1);
    const itemsPerPage = 10;

    // Fetch heroes
    const handleFetchHeroes = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('http://localhost:5001/api/v1/get_banners');
            setHeroes(data.data);
        } catch (error) {
            console.log('Error fetching Banners:', error);
        } finally {
            setLoading(false);
        }
    };

    // Update status
    const handleUpdateStatus = async (id, currentStatus) => {
        try {
            const updatedStatus = !currentStatus;
            await axios.put(`http://localhost:5001/api/v1/update_status/${id}`, {
                isActive: updatedStatus,
            });

            setHeroes((prevHeroes) =>
                prevHeroes.map((hero) =>
                    hero._id === id ? { ...hero, isActive: updatedStatus } : hero
                )
            );
            toast.success('Status updated successfully');
        } catch (error) {
            console.log('Error updating status:', error);
            toast.error(error?.response?.data?.message || 'Please try again later');
        }
    };

    // Delete hero
    const handleDeleteHero = async (id) => {
        try {
            setLoading(true);
            await axios.delete(`http://localhost:5001/api/v1/delete_banner/${id}`);
            setHeroes((prevHeroes) => prevHeroes.filter((hero) => hero._id !== id));
            toast.success('Banner deleted successfully');
        } catch (error) {
            console.log('Error deleting Banner:', error);
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
                handleDeleteHero(id);
            }
        });
    };

    React.useEffect(() => {
        handleFetchHeroes();
    }, []);

    // Pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = heroes.slice(startIndex, startIndex + itemsPerPage);
    const totalPages = Math.ceil(heroes.length / itemsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const heading = ['S.No', 'Image', 'Status', 'Action'];

    return (
        <>
            {loading ? (
                <div className="spin-style">
                    <CSpinner color="primary" variant="grow" />
                </div>
            ) : (
                <Table
                    heading="All Banners"
                    btnText="Add Banner"
                    btnURL="/banner/add-banner"
                    tableHeading={heading}
                    tableContent={
                        currentData &&
                        currentData.map((item, index) => (
                            <CTableRow key={index}>
                                <CTableDataCell>{startIndex + index + 1}</CTableDataCell>
                                <CTableDataCell>
                                    <img src={item.image.url} alt="Hero" width={100} />
                                </CTableDataCell>
                                <CTableDataCell>
                                    <CFormSwitch
                                        id={`formSwitch-${item._id}`}
                                        checked={item.isActive}
                                        onChange={() =>
                                            handleUpdateStatus(item._id, item.isActive)
                                        }
                                    />
                                </CTableDataCell>
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
}

export default AllHero;
