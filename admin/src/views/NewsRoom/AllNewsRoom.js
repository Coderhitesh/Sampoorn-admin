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

const AllNewsRoom = () => {
  const [news, setNews] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;

  // Fetch all news articles
  const fetchNews = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('http://localhost:5001/api/v1/get_news');
      setNews(data.data);
    } catch (error) {
      console.error('Error fetching news:', error);
      toast.error('Failed to load news. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchNews();
  }, []);

  // Delete news article
  const handleDeleteNews = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`http://localhost:5001/api/v1/delete_news/${id}`);
      setNews((prevNews) => prevNews.filter((item) => item._id !== id));
      toast.success('News deleted successfully');
    } catch (error) {
      console.error('Error deleting news:', error);
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
        handleDeleteNews(id);
      }
    });
  };

  // Calculate paginated data
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = news.slice(startIndex, startIndex + itemsPerPage);

  // Calculate total pages
  const totalPages = Math.ceil(news.length / itemsPerPage);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const tableHeading = ['S.No', 'Title', 'URL', 'Action'];

  return (
    <>
      {loading ? (
        <div className="spin-style">
          <CSpinner color="primary" variant="grow" />
        </div>
      ) : (
        <Table
          heading="All News"
          btnText="Add News"
          btnURL="/news-room/add-news-room"
          tableHeading={tableHeading}
          tableContent={
            currentData &&
            currentData.map((item, index) => (
              <CTableRow key={index}>
                <CTableDataCell>{startIndex + index + 1}</CTableDataCell>
                <CTableDataCell className="table-text">
                  {item.title.split(' ').slice(0, 7).join(' ')}
                  {item.title.split(' ').length > 7 && ' ...'}
                </CTableDataCell>

                <CTableDataCell>
  <a href={item.url} target="_blank" rel="noopener noreferrer" className="table-text">
    {item.url.length > 30 ? `${item.url.substring(0, 30)}...` : item.url}
  </a>
</CTableDataCell>

                <CTableDataCell>
                  <div className="action-parent">
                    <CNavLink href={`#/news-room/edit-news-room/${item._id}`} className="edit">
                      <i className="ri-pencil-fill"></i>
                    </CNavLink>
                    <div className="delete" onClick={() => confirmDelete(item._id)}>
                      <i className="ri-delete-bin-fill"></i>
                    </div>
                  </div>
                </CTableDataCell>
              </CTableRow>
            ))
          }
          pagination={
            <CPagination className="justify-content-center" aria-label="Page navigation example">
              <CPaginationItem disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>
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
              <CPaginationItem disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)}>
                Next
              </CPaginationItem>
            </CPagination>
          }
        />
      )}
    </>
  );
};

export default AllNewsRoom;