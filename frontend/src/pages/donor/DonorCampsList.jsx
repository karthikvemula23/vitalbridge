import { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import {
  MapPin,
  Calendar,
  Clock,
  Filter,
  Loader2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Droplet,
  Heart,
  Search,
  Users,
  Building2,
  ListPlus,
  CheckCircle,
  XCircle,
  AlertCircle,
  Tent,
} from "lucide-react";

// NOTE: Ensure this URL matches your running backend API endpoint
const API_BASE_URL = "/api";

const STATUS_OPTIONS = [
  { value: "all", label: "All Camps" },
  { value: "Upcoming", label: "Upcoming" },
  { value: "Ongoing", label: "Ongoing" },
  { value: "Completed", label: "Completed" },
  { value: "Cancelled", label: "Cancelled" },
];

// --- Sub-Components (module-level for stability) ---

const SectionHeading = ({ icon, eyebrow, title }) => (
  <div className="mb-5">
    <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">{eyebrow}</p>
    <div className="flex items-center gap-2.5">
      <div className="p-1.5 bg-red-50 rounded-lg text-red-600 flex-shrink-0">{icon}</div>
      <h2 className="text-xl font-bold text-gray-900">{title}</h2>
    </div>
  </div>
);

const CampStatusBadge = ({ status }) => {
  const map = {
    Upcoming:  { bg: "bg-blue-50",    text: "text-blue-700",    border: "border-blue-200",    icon: <Clock size={10} /> },
    Ongoing:   { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", icon: <CheckCircle size={10} /> },
    Completed: { bg: "bg-gray-100",   text: "text-gray-600",    border: "border-gray-200",    icon: <CheckCircle size={10} /> },
    Cancelled: { bg: "bg-red-50",     text: "text-red-700",     border: "border-red-200",     icon: <XCircle size={10} /> },
  };
  const s = map[status] || map.Upcoming;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${s.bg} ${s.text} ${s.border} flex-shrink-0`}>
      {s.icon}
      {status}
    </span>
  );
};

const CampCard = ({ camp }) => {
  const isCompleted = camp.status === "Completed";
  const isCancelled = camp.status === "Cancelled";
  const isUpcoming  = camp.status === "Upcoming";

  // --- Using schema fields: date and time {start, end} ---
  const campDate = new Date(camp.date);
  const dateStr = campDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const timeStr = `${camp.time?.start || "N/A"} – ${camp.time?.end || "N/A"}`;

  // --- Using schema fields: expectedDonors and actualDonors ---
  const expectedDonors = camp.expectedDonors || 0;
  const actualDonors   = camp.actualDonors   || 0;

  const slotsAvailable = expectedDonors > 0 ? expectedDonors - actualDonors : 0;
  const isFull = slotsAvailable <= 0 && expectedDonors > 0 && !isCompleted && !isCancelled;

  // 1. Full Address including Pincode
  const { venue, city, state, pincode } = camp.location || {};
  const locationStr = `${venue}, ${city}, ${state} – ${pincode}`;

  // Assuming the populated hospital object has a 'name' field from the Facility model
  const hospitalName = camp.hospital?.name || "Associated Facility Missing";

  // Donor Capacity Logic
  const renderDonorCapacity = () => {
    if (isUpcoming) {
      return (
        <span className="font-semibold text-gray-700">
          {expectedDonors}{" "}
          <span className="font-normal text-gray-500">expected</span>
        </span>
      );
    }
    return (
      <span className="font-semibold text-gray-700">
        {actualDonors} / {expectedDonors}{" "}
        <span className="font-normal text-gray-500">donors</span>
      </span>
    );
  };

  return (
    <div
      className={`group relative bg-white rounded-2xl border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col ${
        isCancelled ? "border-red-200 opacity-75" : "border-gray-100"
      }`}
    >
      {/* Top accent stripe */}
      <div
        className={`absolute top-0 left-0 right-0 h-0.5 ${
          isCancelled
            ? "bg-red-400"
            : isCompleted
            ? "bg-gray-300"
            : "bg-gradient-to-r from-red-500 to-red-700"
        }`}
      />

      <div className="p-5 flex flex-col flex-1 mt-0.5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <h4
            className={`text-base font-extrabold leading-tight flex-1 ${
              isCancelled ? "text-gray-400" : "text-gray-900"
            }`}
          >
            {camp.title}
          </h4>
          <CampStatusBadge status={camp.status} />
        </div>

        {/* Organizing Facility */}
        <div className="flex items-center gap-2.5 mb-4 pb-4 border-b border-gray-50">
          <div className="p-1.5 bg-red-50 rounded-lg text-red-600 flex-shrink-0">
            <Building2 className="w-3.5 h-3.5" />
          </div>
          <span className="text-sm font-semibold text-gray-700 truncate">{hospitalName}</span>
        </div>

        {/* Primary details */}
        <div className="space-y-2.5 text-sm text-gray-600 mb-4 flex-1">
          <div className="flex items-start gap-2.5">
            <MapPin className="w-3.5 h-3.5 text-red-500 flex-shrink-0 mt-0.5" />
            <span className="leading-relaxed">{locationStr}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Calendar className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
            <span className="font-medium text-gray-700">{dateStr}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Clock className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
            <span>{timeStr}</span>
          </div>
        </div>

        {/* Donor metrics footer */}
        <div className="pt-3 border-t border-gray-50 space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
            <span className="text-gray-500 text-xs uppercase tracking-wide font-semibold">Capacity:</span>
            {renderDonorCapacity()}
          </div>

          {/* Remaining Need - Only visible if not Completed or Cancelled */}
          {!isCompleted && !isCancelled && (
            <div className="flex items-center gap-2 text-sm">
              <ListPlus className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
              <span className="text-gray-500 text-xs uppercase tracking-wide font-semibold">Slots:</span>
              {isFull ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
                  <XCircle size={9} /> Full
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle size={9} /> {slotsAvailable} remaining
                </span>
              )}
            </div>
          )}
        </div>

        {/* Description Section (Always visible when present) */}
        {camp.description && (
          <div className="mt-3 pt-3 border-t border-gray-50">
            <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-1 flex items-center gap-1">
              <Droplet className="w-3 h-3" /> About
            </p>
            <p className="text-sm text-gray-500 italic leading-relaxed line-clamp-3">
              {camp.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Main Component ---

export const DonorCampsList = () => {
  const [filter, setFilter] = useState("Upcoming");
  const [searchTerm, setSearchTerm] = useState("");
  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 9,
    total: 0,
    totalPages: 1,
    currentPage: 1,
  });

  const fetchCamps = useCallback(async () => {
    // NOTE: Using localStorage token as per original code. This should be replaced with a proper auth flow (e.g., Firebase auth) in a production environment.
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication required. Please log in to view camps.");
      toast.error("Authentication token missing.");
      setCamps([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const statusParam = filter === "all" ? "" : filter;
      // NOTE: In your backend, ensure the API handler is using Mongoose .populate('hospital', 'name')
      // to include the facility name in the response data.
      const params = new URLSearchParams({
        ...(statusParam && { status: statusParam }),
        page: pagination.page,
        limit: pagination.limit,
        // Added search term param, assuming backend supports 'q' for search
        ...(searchTerm && { q: searchTerm }),
      }).toString();

      const apiUrl = `${API_BASE_URL}/donor/camps?${params}`;
      console.log("Fetching camps from URL:", apiUrl);

      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { data: responseData } = response.data;

      console.log("✅ Camps fetched successfully:", responseData);

      if (responseData && responseData.camps) {
        setCamps(responseData.camps);
        // Assuming pagination data is available in response.data.pagination
        setPagination((prev) => ({
          ...prev,
          total: responseData.pagination?.total || responseData.camps.length,
          totalPages: responseData.pagination?.totalPages || 1,
          currentPage: responseData.pagination?.currentPage || 1,
        }));
      } else {
        console.error("API response missing expected data:", response.data);
        throw new Error("Invalid response structure received from server.");
      }
    } catch (err) {
      console.error("❌ Fetch Camps Error:", err);
      let message =
        err.response?.data?.message || err.message || "Failed to fetch camps.";

      if (err.response?.status === 401 || err.response?.status === 403) {
        message = "Authentication failed or unauthorized. Please log in again.";
      }

      toast.error(message);
      setError(message);
      setCamps([]);
      setPagination((prev) => ({
        ...prev,
        total: 0,
        totalPages: 1,
        currentPage: 1,
      }));
    } finally {
      setLoading(false);
    }
  }, [filter, pagination.page, pagination.limit, searchTerm]); // Include searchTerm in dependencies

  useEffect(() => {
    fetchCamps();
  }, [fetchCamps]);

  // Filtering is now handled on the backend via the 'q' parameter in fetchCamps
  // We use the full 'camps' list here which should be the filtered result from the API
  const displayedCamps = camps;

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, page: newPage }));
    }
  };

  const totalPages  = useMemo(() => pagination.totalPages,  [pagination.totalPages]);
  const currentPage = useMemo(() => pagination.currentPage, [pagination.currentPage]);

  // --- Loading State (initial load) ---
  if (loading && camps.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center">
          <div className="relative inline-flex items-center justify-center mb-6">
            <div className="absolute inset-0 rounded-full bg-red-100 animate-ping opacity-60" />
            <div className="relative p-5 bg-gradient-to-br from-red-600 to-red-800 rounded-2xl shadow-xl">
              <Tent className="w-10 h-10 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Camps</h2>
          <p className="text-gray-500 text-sm">Finding donation opportunities near you…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-16 lg:pb-8">
      <Toaster />
      <div className="max-w-7xl mx-auto px-1 py-6">

        {/* ── Page Header ── */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-gradient-to-br from-red-600 to-red-800 rounded-2xl shadow-lg shadow-red-200">
              <Tent className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-red-500 mb-0.5">
                VitalBridge · Donor Portal
              </p>
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 leading-none">
                Blood Donation Camps
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Find local opportunities to donate blood and save lives.
              </p>
            </div>
          </div>

          {/* Refresh button */}
          <button
            onClick={() => fetchCamps()}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 active:from-red-800 active:to-red-900 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Refreshing…" : "Refresh"}
          </button>
        </div>

        {/* ── Search & Filter Controls ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            {/* Search Input */}
            <div className="flex-1">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search camps, locations, hospital name…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-100 rounded-xl text-sm bg-gray-50 focus:bg-white focus:border-red-400 focus:ring-2 focus:ring-red-50 outline-none transition-all duration-200"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <select
                value={filter}
                onChange={(e) => handleFilterChange(e.target.value)}
                disabled={loading}
                className="border-2 border-gray-100 bg-gray-50 text-sm px-3 py-2.5 rounded-xl focus:border-red-400 focus:bg-white outline-none transition-all duration-200 disabled:opacity-50"
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ── Results Summary ── */}
        {!loading && camps.length > 0 && (
          <div className="flex items-center justify-between mb-4 px-1">
            <p className="text-sm text-gray-500">
              Showing{" "}
              <span className="font-semibold text-gray-800">{displayedCamps.length}</span> camps
              {searchTerm && (
                <> matching <span className="font-semibold text-gray-800">"{searchTerm}"</span></>
              )}
              {" "}· {pagination.total} total
            </p>
          </div>
        )}

        {/* ── Loading Overlay (filter/page changes with existing data) ── */}
        {loading && camps.length > 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-sm mb-6">
            <Loader2 className="w-8 h-8 text-red-500 mx-auto animate-spin mb-3" />
            <p className="text-gray-600 font-medium text-sm">Updating camps…</p>
          </div>
        )}

        {/* ── Error State ── */}
        {error && !loading && camps.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
            <div className="inline-flex p-5 bg-red-50 rounded-2xl mb-5">
              <AlertCircle className="w-12 h-12 text-red-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Unable to Load Camps</h3>
            <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">{error}</p>
            <button
              onClick={() => fetchCamps()}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-2.5 rounded-xl transition-all duration-300 font-semibold shadow-md hover:shadow-lg text-sm"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        )}

        {/* ── Camp Grid ── */}
        {!loading && displayedCamps.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-6">
              {displayedCamps.map((camp) => (
                <CampCard key={camp._id} camp={camp} />
              ))}
            </div>

            {/* ── Pagination ── */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
              <span className="text-sm text-gray-400 font-medium">
                {pagination.total} camps · {pagination.limit} per page
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1 || loading}
                  className="p-2 border-2 border-gray-100 rounded-xl text-gray-500 hover:bg-red-50 hover:border-red-200 hover:text-red-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm font-semibold text-gray-700 min-w-[90px] text-center">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || loading}
                  className="p-2 border-2 border-gray-100 rounded-xl text-gray-500 hover:bg-red-50 hover:border-red-200 hover:text-red-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}

        {/* ── Empty State ── */}
        {!loading && displayedCamps.length === 0 && !error && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
            <div className="inline-flex p-5 bg-gray-50 rounded-2xl mb-5">
              {searchTerm ? (
                <Search className="w-12 h-12 text-gray-300" />
              ) : (
                <Heart className="w-12 h-12 text-gray-300" />
              )}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {searchTerm ? "No Matching Camps Found" : "No Camps Available"}
            </h3>
            <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
              {searchTerm
                ? `No camps found matching "${searchTerm}" with the current filter.`
                : "There are no camps matching the current filter. Try adjusting your search."}
            </p>
            {(searchTerm || filter !== "all") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilter("all");
                  setPagination((prev) => ({ ...prev, page: 1 }));
                }}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg text-sm"
              >
                Show All Camps
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default DonorCampsList;