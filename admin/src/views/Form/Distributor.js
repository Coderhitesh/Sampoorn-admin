import React, { useState, useEffect } from 'react';
import { Search, Plus, FileText, Eye, ChevronLeft, ChevronRight, ArrowLeft, Building2, MapPin, Phone, Mail, FileCheck, Users, Truck, DollarSign, BarChart3, Factory, Trash, Upload, ToggleLeft, ToggleRight } from 'lucide-react';
import Swal from 'sweetalert2';
import axios from 'axios';
import toast from 'react-hot-toast';

const Distributor = () => {
  const [distributors, setDistributors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDistributor, setSelectedDistributor] = useState(null);
  const [showDetailsPage, setShowDetailsPage] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [uploadMode, setUploadMode] = useState('single'); // 'single', 'multiple', 'all'
  const [videoFile, setVideoFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const itemsPerPage = 5;

  useEffect(() => {
    fetchDistributors();
  }, []);

  const fetchDistributors = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://api.sampoornmarketing.com/api/v1/get_distributor');
      const data = await response.json();
      const reverseData = data.data.reverse();
      const distributors = reverseData.filter(distributor => distributor.type === "Distributor");
      setDistributors(distributors || []);
    } catch (error) {
      console.error('Error fetching distributors:', error);
    }
    setLoading(false);
  };

  const handleDeleteBlog = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`https://api.sampoornmarketing.com/api/v1/delete_form/${id}`);
      setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog._id !== id));
      toast.success('Deleted successfully!');
    } catch (error) {
      console.error('Error deleting ', error);
      toast.error('Failed to delete the  Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
        handleDeleteBlog(id);
      }
    });
  };

  const filteredDistributors = distributors.filter(distributor =>
    distributor.distributorEntityName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    distributor.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    distributor.state?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedDistributors = filteredDistributors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredDistributors.length / itemsPerPage);

  const handleFileChange = (e) => {
    setVideoFile(e.target.files[0]);
  };

  const handleUploadModeChange = (mode) => {
    setUploadMode(mode);
    setSelectedIds([]);
  };

  const handleCheckboxChange = (id) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      }
      return [...prev, id];
    });
  };

  const handleUploadVideo = async () => {
    if (!videoFile) {
      toast.error('Please select a video file');
      return;
    }

    let ids = [];
    if (uploadMode === 'all') {
      ids = distributors.map(d => d._id);
    } else if (uploadMode === 'multiple') {
      if (selectedIds.length === 0) {
        toast.error('Please select at least one distributor');
        return;
      }
      ids = selectedIds;
    } else {
      if (selectedIds.length !== 1) {
        toast.error('Please select one distributor');
        return;
      }
      ids = selectedIds;
    }

    const formData = new FormData();
    formData.append('fileUploadedByAdmin', videoFile);
    formData.append('ids', JSON.stringify(ids));

    setUploading(true);
    try {
      const response = await axios.post('https://api.sampoornmarketing.com/api/v1/update_files_By_admin', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success(response.data.message || 'PDF uploaded successfully');
      fetchDistributors(); // Refresh the list
      setVideoFile(null);
      setSelectedIds([]);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload video');
      console.log("Internal sever error",error);
    } finally {
      setUploading(false);
    }
  };

  const handleToggleVerification = async (id, currentStatus) => {
    try {
      await axios.put(`https://api.sampoornmarketing.com/api/v1/update_verify_status/${id}`);
      toast.success('Verification status updated successfully');
      fetchDistributors(); // Refresh the list
    } catch (error) {
      toast.error('Failed to update verification status');
    }
  };

  const handleViewDetails = (distributor) => {
    setSelectedDistributor(distributor);
    setShowDetailsPage(true);
  };

  const DetailSection = ({ title, icon: Icon, children }) => (
    <div className="card mb-4">
      <div className="card-header bg-light d-flex align-items-center gap-2">
        <Icon size={18} />
        <h5 className="mb-0">{title}</h5>
      </div>
      <div className="card-body">
        <div className="row g-3">
          {children}
        </div>
      </div>
    </div>
  );

  const DetailItem = ({ label, value }) => (
    <div className="col-md-6 col-lg-4">
      <div className="p-3 bg-light rounded">
        <small className="text-muted d-block mb-1">{label}</small>
        <div className="fw-medium">{value || '-'}</div>
      </div>
    </div>
  );

  const DocumentSection = ({ title, images }) => {
    if (!images || (Array.isArray(images) && images.length === 0)) return null;
    const imageArray = Array.isArray(images) ? images : [images];

    return (
      <div className="card mb-4">
        <div className="card-header bg-light">
          <h5 className="mb-0">{title}</h5>
        </div>
        <div className="card-body">
          <div className="row g-4">
            {imageArray.map((img, index) => (
              <div key={index} className="col-md-6">
                <img
                  src={img.url}
                  alt={`${title} ${index + 1}`}
                  className="img-fluid rounded shadow-sm"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  if (showDetailsPage && selectedDistributor) {
    return (
      <div className="min-vh-100 bg-light p-4">
        <div className="container-fluid">
          {/* Back button */}
          <button
            className="btn btn-link text-decoration-none mb-4 p-0"
            onClick={() => setShowDetailsPage(false)}
          >
            <ArrowLeft size={20} className="me-2" />
            Back to Distributors
          </button>

          <div className="row mb-4">
            <div className="col">
              <h2 className="mb-0">{selectedDistributor.distributorEntityName}</h2>
              <p className="text-muted mb-0">{selectedDistributor.type}</p>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <DetailSection title="Basic Information" icon={Building2}>
                <DetailItem label="Entity Name" value={selectedDistributor.distributorEntityName} />
                <DetailItem label="Constitution Entity" value={selectedDistributor.constitutionEntity} />
                <DetailItem label="Associated Company" value={selectedDistributor.associatedCompany} />
                <DetailItem label="Starting Year" value={new Date(selectedDistributor.startingYear).getFullYear()} />
                <DetailItem label="Type" value={selectedDistributor.type} />
                <DetailItem label="Association Name" value={selectedDistributor.distributorAssociationName} />
              </DetailSection>

              <DetailSection title="Contact Information" icon={Phone}>
                <DetailItem label="Phone" value={selectedDistributor.phoneNo} />
                <DetailItem label="Alt. Phone" value={selectedDistributor.alternatePhoneNo} />
                <DetailItem label="Email" value={selectedDistributor.email} />
              </DetailSection>

              <DetailSection title="Location Details" icon={MapPin}>
                <DetailItem label="Address" value={selectedDistributor.address} />
                <DetailItem label="City" value={selectedDistributor.city} />
                <DetailItem label="State" value={selectedDistributor.state} />
                <DetailItem label="Pincode" value={selectedDistributor.pincode} />
                <DetailItem label="Location" value={selectedDistributor.location} />
              </DetailSection>

              <DetailSection title="Legal Information" icon={FileCheck}>
                <DetailItem label="GST No" value={selectedDistributor.gstNo} />
                <DetailItem label="PAN No" value={selectedDistributor.panNo} />
                <DetailItem label="FSSAI No" value={selectedDistributor.FSSAINo} />
              </DetailSection>

              <DetailSection title="Business Details" icon={BarChart3}>
                <DetailItem label="No. of Customers" value={selectedDistributor.numberOfCustomers} />
                <DetailItem label="Monthly Turnover" value={`₹${selectedDistributor.monthlyTurnOver?.toLocaleString()}`} />
                <DetailItem label="Godown Area" value={`${selectedDistributor.godownArea} sq.ft`} />
                <DetailItem label="ERP Used" value={selectedDistributor.isERPUsed} />
              </DetailSection>

              <DetailSection title="Operations" icon={Factory}>
                <DetailItem label="No. of Employees" value={selectedDistributor.noOfEmployees} />
                <DetailItem label="No. of Vehicles" value={selectedDistributor.noOfVehicles} />
                <DetailItem label="Vehicle Types" value={selectedDistributor.typeOfVehicles?.join(', ')} />
                <DetailItem label="Coverage Areas" value={selectedDistributor.coverageArea?.join(', ')} />
                <DetailItem label="Business Operations" value={selectedDistributor.businessOperations?.join(', ')} />
                <DetailItem label="Operation Types" value={selectedDistributor.typesOfOperation?.join(', ')} />
                <DetailItem label="Operation Channels" value={selectedDistributor.channelsOfOperation?.join(', ')} />
              </DetailSection>

              <DocumentSection
                title="Office & Godown Images"
                images={selectedDistributor.officeAndGodownImage}
              />

              <div className="row g-4">
                <div className="col-md-6">
                  <DocumentSection
                    title="GST Document"
                    images={selectedDistributor.gstImage}
                  />
                </div>
                <div className="col-md-6">
                  <DocumentSection
                    title="FSSAI Document"
                    images={selectedDistributor.fssaiImage}
                  />
                </div>
                <div className="col-md-6">
                  <DocumentSection
                    title="Partner 1 Document"
                    images={selectedDistributor.partner1Image}
                  />
                </div>
                <div className="col-md-6">
                  <DocumentSection
                    title="Partner 2 Document"
                    images={selectedDistributor.partner2Image}
                  />
                </div>
                {selectedDistributor.anyOtherDocImage?.url && (
                  <div className="col-12">
                    <DocumentSection
                      title="Additional Documents"
                      images={selectedDistributor.anyOtherDocImage}
                    />
                  </div>
                )}
                {selectedDistributor.fileUploadedByAdmin?.url && (
                                    <div className="col-12">
                                        <div className="card mb-4">
                                            <div className="card-header bg-light">
                                                <h5 className="mb-0">Admin Uploaded PDF</h5>
                                            </div>
                                            <div className="card-body">
                                                <embed style={{ width: '100%', height: '400px' }} src={selectedDistributor.fileUploadedByAdmin.url} />
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {selectedDistributor.fileUploadedByDistributor?.url && (
                                    <div className="col-12">
                                        <div className="card mb-4">
                                            <div className="card-header bg-light">
                                                <h5 className="mb-0">Distributor Uploaded PDF</h5>
                                            </div>
                                            <div className="card-body">
                                                <embed src={selectedDistributor.fileUploadedByDistributor.url} width="800px" height="2100px" />
                                            </div>
                                        </div>
                                    </div>
                                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light p-4">
      <div className="container-fluid">
        <div className="card mb-4">
          <div className="card-header bg-white">
            <h5 className="mb-0">Upload PDF</h5>
          </div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-4">
                <select
                  className="form-select"
                  value={uploadMode}
                  onChange={(e) => handleUploadModeChange(e.target.value)}
                >
                  <option value="single">Single Distributor</option>
                  <option value="multiple">Multiple Distributors</option>
                  <option value="all">All Distributors</option>
                </select>
              </div>
              <div className="col-md-4">
                <input
                  type="file"
                  className="form-control"
                  accept="pdf/*"
                  onChange={handleFileChange}
                />
              </div>
              <div className="col-md-4">
                <button
                  className="btn btn-primary d-flex align-items-center gap-2"
                  onClick={handleUploadVideo}
                  disabled={uploading}
                >
                  {uploading ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload size={18} />
                      <span>Upload PDF</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-header bg-white">
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3">
              <h4 className="mb-0">Distributors</h4>
              {/* <button className="btn btn-primary d-flex align-items-center gap-2">
                  <Plus size={18} />
                  Add Distributor
                </button> */}
            </div>

            <div className="mt-3 position-relative">
              <input
                type="text"
                placeholder="Search distributors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-control ps-4"
              />
              <Search className="position-absolute top-50 translate-middle-y ms-2" size={18} style={{ color: '#6c757d' }} />
            </div>
          </div>

          <div className="card-body p-0">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      {uploadMode !== 'all' && <th>Select</th>}
                      <th>Entity Name</th>
                      <th>Location</th>
                      <th>Contact</th>
                      <th>Type</th>
                      <th>Verified</th>
                      <th>Actions</th>
                      <th>Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedDistributors.map((distributor) => (
                      <tr key={distributor._id}>
                        {uploadMode !== 'all' && (
                          <td>
                            <input
                              type="checkbox"
                              checked={selectedIds.includes(distributor._id)}
                              onChange={() => handleCheckboxChange(distributor._id)}
                              disabled={uploadMode === 'single' && selectedIds.length === 1 && !selectedIds.includes(distributor._id)}
                            />
                          </td>
                        )}
                        <td>
                          <div className="fw-medium">{distributor.distributorEntityName}</div>
                          <small className="text-muted">{distributor.constitutionEntity}</small>
                        </td>
                        <td>
                          <div>{distributor.city}</div>
                          <small className="text-muted">{distributor.state}</small>
                        </td>
                        <td>
                          <div>{distributor.phoneNo}</div>
                          <small className="text-muted">{distributor.email}</small>
                        </td>
                        <td>
                          <span className={`badge ${distributor.type === 'Distributor' ? 'bg-success' :
                            distributor.type === 'Retailer' ? 'bg-primary' :
                              'bg-info'}`}>
                            {distributor.type}
                          </span>
                        </td>
                        <td>
                          <button
                            onClick={() => handleToggleVerification(distributor._id)}
                            className={`btn btn-sm ${distributor.isVerified ? 'btn-success' : 'btn-outline-secondary'}`}
                          >
                            {distributor.isVerified ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                            {distributor.isVerified ? 'Verified' : 'Not Verified'}
                          </button>
                        </td>
                        <td>
                          <button
                            onClick={() => handleViewDetails(distributor)}
                            className="btn btn-sm btn-outline-primary d-flex align-items-center gap-2"
                          >
                            <Eye size={16} />
                            View Details
                          </button>
                        </td>
                        <td>
                          <button
                            onClick={() => confirmDelete(distributor._id)}
                            className="btn btn-sm btn-outline-danger d-flex align-items-center gap-2"
                          >
                            <Trash size={16} />
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="card-footer bg-white">
              <nav className="d-flex justify-content-center">
                <ul className="pagination mb-0">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    >
                      <ChevronLeft size={16} />
                    </button>
                  </li>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </button>
                    </li>
                  ))}
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    >
                      <ChevronRight size={16} />
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Distributor;
