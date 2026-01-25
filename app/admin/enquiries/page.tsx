'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MdDelete, MdEdit, MdEmail, MdPhone, MdLink } from 'react-icons/md';

interface Enquiry {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  product_name?: string;
  product_slug?: string;
  product_link?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchEnquiries();
  }, [currentPage, statusFilter, searchTerm]);

  async function fetchEnquiries() {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
      });

      if (statusFilter) params.append('status', statusFilter);
      if (searchTerm) params.append('search', searchTerm);

      const response = await fetch(`/api/admin/enquiries?${params}`);
      const data = await response.json();

      setEnquiries(data.enquiries || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error('Error fetching enquiries:', error);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: number, newStatus: string) {
    try {
      const response = await fetch('/api/admin/enquiries', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (response.ok) {
        fetchEnquiries();
      }
    } catch (error) {
      console.error('Error updating enquiry:', error);
    }
  }

  async function deleteEnquiry(id: number) {
    if (confirm('Are you sure you want to delete this enquiry?')) {
      try {
        const response = await fetch(`/api/admin/enquiries?id=${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          fetchEnquiries();
        }
      } catch (error) {
        console.error('Error deleting enquiry:', error);
      }
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'contacted':
        return 'bg-yellow-100 text-yellow-800';
      case 'closed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Enquiries Management</h1>
        <p className="text-gray-600">Manage and track customer product enquiries</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Search</label>
            <input
              type="text"
              placeholder="Search by name, email, or product..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
            >
              <option value="">All Status</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('');
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-12">Loading enquiries...</div>
      ) : enquiries.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600 text-lg">No enquiries found</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Name</th>
                  <th className="px-6 py-4 text-left font-semibold">Contact</th>
                  <th className="px-6 py-4 text-left font-semibold">Product</th>
                  <th className="px-6 py-4 text-left font-semibold">Status</th>
                  <th className="px-6 py-4 text-left font-semibold">Date</th>
                  <th className="px-6 py-4 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {enquiries.map((enquiry) => (
                  <tr key={enquiry.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-semibold">{enquiry.name}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 text-sm">
                        <a
                          href={`mailto:${enquiry.email}`}
                          className="flex items-center gap-1 text-blue-600 hover:underline"
                        >
                          <MdEmail className="w-4 h-4" />
                          {enquiry.email}
                        </a>
                        <a
                          href={`tel:${enquiry.phone}`}
                          className="flex items-center gap-1 text-blue-600 hover:underline"
                        >
                          <MdPhone className="w-4 h-4" />
                          {enquiry.phone}
                        </a>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {enquiry.product_name ? (
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-semibold">{enquiry.product_name}</span>
                          {enquiry.product_link && (
                            <a
                              href={enquiry.product_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-blue-600 hover:underline text-xs"
                            >
                              <MdLink className="w-3 h-3" />
                              View Product
                            </a>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-500 text-sm">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={enquiry.status}
                        onChange={(e) => updateStatus(enquiry.id, e.target.value)}
                        className={`px-3 py-1 rounded-full text-sm font-semibold border-0 cursor-pointer ${getStatusColor(enquiry.status)}`}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="closed">Closed</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(enquiry.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedEnquiry(enquiry)}
                          className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm flex items-center gap-1 transition"
                        >
                          <MdEdit className="w-4 h-4" />
                          View
                        </button>
                        <button
                          onClick={() => deleteEnquiry(enquiry.id)}
                          className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded text-sm flex items-center gap-1 transition"
                        >
                          <MdDelete className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 rounded transition"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 rounded transition"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedEnquiry && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedEnquiry(null)}
        >
          <div
            className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold">Enquiry Details</h2>
                <button
                  onClick={() => setSelectedEnquiry(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 font-semibold">Name</p>
                    <p className="text-lg">{selectedEnquiry.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-semibold">Status</p>
                    <select
                      value={selectedEnquiry.status}
                      onChange={(e) => {
                        updateStatus(selectedEnquiry.id, e.target.value);
                        setSelectedEnquiry({
                          ...selectedEnquiry,
                          status: e.target.value,
                        });
                      }}
                      className={`px-3 py-2 rounded text-sm font-semibold border-0 ${getStatusColor(selectedEnquiry.status)}`}
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 font-semibold">Email</p>
                    <a href={`mailto:${selectedEnquiry.email}`} className="text-blue-600 hover:underline break-all">
                      {selectedEnquiry.email}
                    </a>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-semibold">Phone</p>
                    <a href={`tel:${selectedEnquiry.phone}`} className="text-blue-600 hover:underline">
                      {selectedEnquiry.phone}
                    </a>
                  </div>
                </div>

                {selectedEnquiry.product_name && (
                  <div>
                    <p className="text-sm text-gray-600 font-semibold">Product</p>
                    <p className="text-lg">{selectedEnquiry.product_name}</p>
                    {selectedEnquiry.product_link && (
                      <a
                        href={selectedEnquiry.product_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm break-all"
                      >
                        {selectedEnquiry.product_link}
                      </a>
                    )}
                  </div>
                )}

                <div>
                  <p className="text-sm text-gray-600 font-semibold">Message</p>
                  <div className="bg-gray-50 p-4 rounded mt-2 whitespace-pre-wrap break-words">
                    {selectedEnquiry.message}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <p className="font-semibold">Submitted</p>
                    <p>{formatDate(selectedEnquiry.created_at)}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Last Updated</p>
                    <p>{formatDate(selectedEnquiry.updated_at)}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setSelectedEnquiry(null)}
                  className="flex-1 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded transition"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    deleteEnquiry(selectedEnquiry.id);
                    setSelectedEnquiry(null);
                  }}
                  className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
