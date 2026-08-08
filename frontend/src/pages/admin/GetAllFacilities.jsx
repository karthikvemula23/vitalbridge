import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  Hospital,
  Mail,
  Phone,
  MapPin,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  Search,
  ChevronDown,
  ChevronUp,
  Tag,
  Briefcase,
  Shield,
  AlertTriangle,
  Building2,
  Activity,
  Filter,
} from "lucide-react";

const API_URL = `${import.meta.env.VITE_API_URL || ""}/api/admin`;

// ─── Sub-Components (defined at module level for stability) ───────────────────

const KpiCard = ({ icon, label, value, sublabel, color = "red" }) => {
  const colorClasses = {
    red: {
      iconBg: "bg-red-50",
      iconText: "text-red-600",
      iconHover: "group-hover:bg-red-600 group-hover:text-white",
    },
    amber: {
      iconBg: "bg-amber-50",
      iconText: "text-amber-600",
      iconHover: "group-hover:bg-amber-600 group-hover:text-white",
    },
    green: {
      iconBg: "bg-emerald-50",
      iconText: "text-emerald-600",
      iconHover: "group-hover:bg-emerald-600 group-hover:text-white",
    },
    blue: {
      iconBg: "bg-blue-50",
      iconText: "text-blue-600",
      iconHover: "group-hover:bg-blue-600 group-hover:text-white",
    },
    purple: {
      iconBg: "bg-violet-50",
      iconText: "text-violet-600",
      iconHover: "group-hover:bg-violet-600 group-hover:text-white",
    },
  };
  const c = colorClasses[color] || colorClasses.red;

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
      <div className="flex items-center justify-between mb-3">
        <div
          className={`p-2 ${c.iconBg} ${c.iconText} rounded-xl ${c.iconHover} transition-all duration-300`}
        >
          {icon}
        </div>
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
          {label}
        </span>
      </div>
      <p className="text-3xl font-black text-gray-900 tracking-tight">
        {value}
      </p>
      {sublabel && (
        <p className="text-xs text-gray-500 mt-0.5">{sublabel}</p>
      )}
    </div>
  );
};

const SectionHeading = ({ icon, eyebrow, title }) => (
  <div className="mb-5">
    <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
      {eyebrow}
    </p>
    <div className="flex items-center gap-2.5">
      <div className="p-1.5 bg-red-50 rounded-lg text-red-600 flex-shrink-0">
        {icon}
      </div>
      <h2 className="text-xl font-bold text-gray-900">{title}</h2>
    </div>
  </div>
);

// ─── Status & Type badge helpers ──────────────────────────────────────────────

const getStatusBadge = (status) => {
  const statusConfig = {
    approved: {
      color: "bg-emerald-50 text-emerald-700 border-emerald-200",
      icon: <CheckCircle size={12} />,
      label: "Approved",
    },
    rejected: {
      color: "bg-red-50 text-red-700 border-red-200",
      icon: <XCircle size={12} />,
      label: "Rejected",
    },
    pending: {
      color: "bg-amber-50 text-amber-700 border-amber-200",
      icon: <Clock size={12} />,
      label: "Pending Review",
    },
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.color}`}
    >
      {config.icon}
      {config.label}
    </span>
  );
};

const getTypeBadge = (type) => {
  const typeDisplay = type
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
  const isHospital = type === "hospital";

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${
        isHospital
          ? "bg-blue-50 text-blue-700 border-blue-200"
          : "bg-violet-50 text-violet-700 border-violet-200"
      }`}
    >
      <Building2 size={10} />
      {typeDisplay}
    </span>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

function GetAllFacilities() {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    facilityType: "all",
    status: "all",
    sortBy: "name",
    sortOrder: "asc",
  });

  const token = localStorage.getItem("token");

  // Facility status and types for filters
  const facilityTypes = ["hospital", "blood-lab"];
  const statuses = ["pending", "approved", "rejected"];

  // Fetch Facilities Function
  const fetchAllFacilities = async (showToast = false) => {
    try {
      if (showToast) setRefreshing(true);
      else setLoading(true);

      console.log("🔄 Fetching facilities...");

      const res = await fetch(`${API_URL}/facilities`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("📨 Response status:", res.status);

      if (!res.ok) {
        const errorText = await res.text();
        console.error("❌ API Error:", errorText);
        throw new Error(`Failed to fetch facilities: ${res.status}`);
      }

      const data = await res.json();
      console.log("✅ Facilities data:", data);
      setFacilities(data.facilities || []);
      setLastUpdated(new Date());

      if (showToast) {
        toast.success(`Loaded ${data.facilities?.length || 0} facilities`);
      }
    } catch (error) {
      console.error("🚨 Fetch facilities error:", error);
      toast.error(error.message || "Failed to load facility data.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAllFacilities();
  }, []);

  // Filter and sort facilities
  const filteredFacilities = facilities
    .filter((facility) => {
      const matchesSearch =
        !filters.search ||
        facility.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
        facility.email?.toLowerCase().includes(filters.search.toLowerCase()) ||
        facility.registrationNumber
          ?.toLowerCase()
          .includes(filters.search.toLowerCase()) ||
        facility.phone?.includes(filters.search);

      const matchesType =
        filters.facilityType === "all" ||
        facility.facilityType === filters.facilityType;

      const matchesStatus =
        filters.status === "all" || facility.status === filters.status;

      return matchesSearch && matchesType && matchesStatus;
    })
    .sort((a, b) => {
      let aValue, bValue;

      switch (filters.sortBy) {
        case "name":
          aValue = a.name?.toLowerCase();
          bValue = b.name?.toLowerCase();
          break;
        case "status":
          aValue = a.status?.toLowerCase();
          bValue = b.status?.toLowerCase();
          break;
        case "type":
          aValue = a.facilityType?.toLowerCase();
          bValue = b.facilityType?.toLowerCase();
          break;
        default:
          aValue = a.name?.toLowerCase();
          bValue = b.name?.toLowerCase();
      }

      if (filters.sortOrder === "desc") {
        return aValue < bValue ? 1 : -1;
      }
      return aValue > bValue ? 1 : -1;
    });

  // ─── Loading State ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center">
          <div className="relative inline-flex items-center justify-center mb-6">
            <div className="absolute inset-0 rounded-full bg-red-100 animate-ping opacity-60" />
            <div className="relative p-5 bg-gradient-to-br from-red-600 to-red-800 rounded-2xl shadow-xl">
              <Hospital className="w-10 h-10 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Loading Facility Database
          </h2>
          <p className="text-gray-500 text-sm">
            Fetching all registered medical facilities…
          </p>
        </div>
      </div>
    );
  }

  // ─── Derived Stats ──────────────────────────────────────────────────────────
  const approvedCount = facilities.filter((f) => f.status === "approved").length;
  const pendingCount = facilities.filter((f) => f.status === "pending").length;
  const rejectedCount = facilities.filter((f) => f.status === "rejected").length;
  const hospitalCount = facilities.filter((f) => f.facilityType === "hospital").length;
  const labCount = facilities.filter((f) => f.facilityType === "blood-lab").length;

  // ─── Main Render ────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-16 lg:pb-8">
      <div className="max-w-7xl mx-auto px-1 py-6">

        {/* ── Header ── */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            {/* Left: Icon + Title */}
            <div className="flex items-center gap-4">
              <div className="p-3.5 bg-gradient-to-br from-red-600 to-red-800 rounded-2xl shadow-lg shadow-red-200">
                <Hospital className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-red-500 mb-0.5">
                  VitalBridge
                </p>
                <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 leading-none">
                  Medical Facilities
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Manage and view all registered hospitals and blood laboratories.
                </p>
              </div>
            </div>

            {/* Right: Refresh + last updated */}
            <div className="flex flex-col items-end gap-1.5">
              <button
                onClick={() => fetchAllFacilities(true)}
                disabled={refreshing}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 active:from-red-800 active:to-red-900 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold"
              >
                <RefreshCw
                  className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
                />
                {refreshing ? "Refreshing…" : "Refresh Data"}
              </button>
              {lastUpdated && (
                <p className="text-xs text-gray-400">
                  Last updated:{" "}
                  {lastUpdated.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              )}
            </div>
          </div>

          {/* ── KPI Summary Row ── */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <KpiCard
              icon={<Hospital className="w-4 h-4" />}
              label="Total"
              value={facilities.length}
              sublabel="All facilities"
              color="blue"
            />
            <KpiCard
              icon={<CheckCircle className="w-4 h-4" />}
              label="Approved"
              value={approvedCount}
              sublabel="Active facilities"
              color="green"
            />
            <KpiCard
              icon={<Clock className="w-4 h-4" />}
              label="Pending"
              value={pendingCount}
              sublabel="Awaiting review"
              color="amber"
            />
            <KpiCard
              icon={<XCircle className="w-4 h-4" />}
              label="Rejected"
              value={rejectedCount}
              sublabel="Not approved"
              color="red"
            />
            <KpiCard
              icon={<Building2 className="w-4 h-4" />}
              label="H / Lab"
              value={`${hospitalCount} / ${labCount}`}
              sublabel="Hospitals · Labs"
              color="purple"
            />
          </div>
        </div>

        {/* ── Pending Alert ── */}
        {pendingCount > 0 && (
          <div className="mb-6 bg-amber-50 border border-amber-200 border-l-4 border-l-amber-400 rounded-2xl p-5 hover:shadow-md transition-all duration-200">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-amber-100 text-amber-600 flex-shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-bold text-amber-800">
                    Pending Approvals
                  </h3>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-800">
                    {pendingCount}
                  </span>
                </div>
                <p className="text-xs text-amber-700 leading-relaxed">
                  {pendingCount} medical facilit{pendingCount !== 1 ? "ies are" : "y is"} awaiting administrative review and approval.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── Filter Toolbar ── */}
        <div className="mb-5">
          <SectionHeading
            eyebrow="Search & filter"
            icon={<Filter className="w-4 h-4" />}
            title="Filter Facilities"
          />
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex flex-col lg:flex-row gap-3">
              {/* Search */}
              <div className="flex-1 relative">
                <Search
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Search by name, email, or registration number…"
                  value={filters.search}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, search: e.target.value }))
                  }
                  className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none transition-colors text-sm text-gray-700 placeholder-gray-400 bg-white"
                />
              </div>

              {/* Type filter */}
              <select
                value={filters.facilityType}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    facilityType: e.target.value,
                  }))
                }
                className="px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none transition-colors text-sm text-gray-700 bg-white"
              >
                <option value="all">All Types</option>
                {facilityTypes.map((type) => (
                  <option key={type} value={type}>
                    {type
                      .split("-")
                      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
                      .join(" ")}
                  </option>
                ))}
              </select>

              {/* Status filter */}
              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, status: e.target.value }))
                }
                className="px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none transition-colors text-sm text-gray-700 bg-white"
              >
                <option value="all">All Status</option>
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>

              {/* Sort by */}
              <select
                value={filters.sortBy}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, sortBy: e.target.value }))
                }
                className="px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none transition-colors text-sm text-gray-700 bg-white"
              >
                <option value="name">Sort by Name</option>
                <option value="status">Sort by Status</option>
                <option value="type">Sort by Type</option>
              </select>

              {/* Sort direction toggle */}
              <button
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    sortOrder: prev.sortOrder === "asc" ? "desc" : "asc",
                  }))
                }
                className="p-2.5 border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-colors text-gray-500"
                title={filters.sortOrder === "asc" ? "Ascending" : "Descending"}
              >
                {filters.sortOrder === "asc" ? (
                  <ChevronUp size={18} />
                ) : (
                  <ChevronDown size={18} />
                )}
              </button>
            </div>

            {/* Results info row */}
            <div className="mt-3 flex items-center justify-between">
              <p className="text-xs text-gray-500 font-medium">
                Showing{" "}
                <span className="text-gray-900 font-bold">
                  {filteredFacilities.length}
                </span>{" "}
                of{" "}
                <span className="text-gray-900 font-bold">
                  {facilities.length}
                </span>{" "}
                facilities
              </p>
              {filters.search && (
                <button
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, search: "" }))
                  }
                  className="text-xs text-red-600 hover:text-red-700 font-semibold transition-colors"
                >
                  Clear search ×
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── Facility Grid ── */}
        <div>
          <SectionHeading
            eyebrow="Registry"
            icon={<Activity className="w-4 h-4" />}
            title={`All Facilities (${filteredFacilities.length})`}
          />

          {filteredFacilities.length === 0 ? (
            /* ── Empty State ── */
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
              <div className="inline-flex p-4 bg-gray-50 rounded-2xl mb-5">
                <Hospital className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {facilities.length === 0
                  ? "No Facilities Found"
                  : "No Matching Facilities"}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-5">
                {facilities.length === 0
                  ? "The medical facility database is currently empty."
                  : "No facilities match your current search criteria."}
              </p>
              {filters.search && (
                <button
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, search: "" }))
                  }
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-sm font-semibold"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredFacilities.map((facility) => (
                <div
                  key={facility._id}
                  className="relative bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group"
                >
                  {/* Top accent stripe */}
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Card header */}
                  <div className="flex items-start justify-between mb-4 pb-4 border-b border-gray-50">
                    <div className="flex-1 min-w-0 pr-2">
                      <h3 className="text-base font-bold text-gray-900 line-clamp-1 group-hover:text-red-600 transition-colors duration-200">
                        {facility.name}
                      </h3>
                      <p className="text-xs text-gray-400 mt-0.5 line-clamp-1 flex items-center gap-1">
                        <Mail size={11} className="flex-shrink-0" />
                        {facility.email}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1.5 items-end flex-shrink-0">
                      {getStatusBadge(facility.status)}
                      {getTypeBadge(facility.facilityType)}
                    </div>
                  </div>

                  {/* Facility details */}
                  <div className="space-y-2.5 text-sm">
                    <div className="flex items-center gap-2.5 text-gray-600">
                      <Tag className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                      <span className="text-xs font-medium truncate">
                        {facility.registrationNumber || "No reg. number"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5 text-gray-600">
                      <Phone className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                      <span className="text-xs truncate">
                        {facility.phone || "Not provided"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5 text-gray-600">
                      <Briefcase className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                      <span className="text-xs capitalize">
                        {facility.facilityCategory || "General"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5 text-gray-600">
                      <Clock
                        className={`w-3.5 h-3.5 flex-shrink-0 ${
                          facility.is24x7 ? "text-emerald-500" : "text-gray-400"
                        }`}
                      />
                      <span className="text-xs font-medium">
                        {facility.is24x7
                          ? "24/7 Service"
                          : `${facility.operatingHours?.open || "N/A"} – ${facility.operatingHours?.close || "N/A"}`}
                      </span>
                    </div>

                    {facility.emergencyServices && (
                      <div className="flex items-center gap-2.5">
                        <Shield className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                        <span className="text-xs text-red-600 font-semibold">
                          Emergency Services
                        </span>
                      </div>
                    )}

                    {/* Address */}
                    <div className="flex items-start gap-2.5 pt-2.5 border-t border-gray-50">
                      <MapPin className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />
                      <div className="text-xs text-gray-500 line-clamp-2">
                        {facility.address?.street &&
                          `${facility.address.street}, `}
                        {facility.address?.city}, {facility.address?.state}
                        {facility.address?.pincode &&
                          ` – ${facility.address.pincode}`}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GetAllFacilities;
