import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  User,
  Heart,
  Calendar,
  Phone,
  Mail,
  MapPin,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  Droplet,
  Weight,
  Users,
  Filter,
  Search,
  ChevronDown,
  ChevronUp,
  Activity,
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

// ─── Badge helpers ────────────────────────────────────────────────────────────

const getEligibilityBadge = (isEligible) => {
  if (isEligible === undefined) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border bg-gray-50 text-gray-600 border-gray-200">
        <Clock size={12} /> Unknown
      </span>
    );
  }
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${
        isEligible
          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
          : "bg-red-50 text-red-700 border-red-200"
      }`}
    >
      {isEligible ? <CheckCircle size={12} /> : <XCircle size={12} />}
      {isEligible ? "Eligible" : "Ineligible"}
    </span>
  );
};

const getBloodGroupBadge = (bloodGroup) => {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-600 text-white border border-red-700 shadow-sm">
      <Droplet size={10} />
      {bloodGroup}
    </span>
  );
};

// ─── Donor initials avatar ────────────────────────────────────────────────────
const DonorAvatar = ({ name }) => {
  const initials = (name || "?")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  // Pick a deterministic background from the palette
  const colors = [
    "bg-red-100 text-red-700",
    "bg-blue-100 text-blue-700",
    "bg-emerald-100 text-emerald-700",
    "bg-violet-100 text-violet-700",
    "bg-amber-100 text-amber-700",
  ];
  const idx = (name?.charCodeAt(0) || 0) % colors.length;

  return (
    <div
      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 ${colors[idx]}`}
    >
      {initials}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

function GetAllDonors() {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    bloodGroup: "all",
    eligibility: "all",
    sortBy: "name",
    sortOrder: "asc",
  });

  const token = localStorage.getItem("token");

  // Blood groups for filter
  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  // Fetch Donors Function
  const fetchAllDonors = async (showToast = false) => {
    try {
      if (showToast) setRefreshing(true);
      else setLoading(true);

      console.log("🔄 Fetching donors...");

      const res = await fetch(`${API_URL}/donors`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("📨 Response status:", res.status);

      if (!res.ok) {
        const errorText = await res.text();
        console.error("❌ API Error:", errorText);
        throw new Error(`Failed to fetch donors: ${res.status}`);
      }

      const data = await res.json();
      console.log("✅ Donors data:", data);
      setDonors(data.donors || []);
      setLastUpdated(new Date());

      if (showToast) {
        toast.success(`Loaded ${data.donors?.length || 0} donors`);
      }
    } catch (error) {
      console.error("🚨 Fetch donors error:", error);
      toast.error(error.message || "Failed to load donor data.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAllDonors();
  }, []);

  // Filter and sort donors
  const filteredDonors = donors
    .filter((donor) => {
      const matchesSearch =
        !filters.search ||
        donor.fullName?.toLowerCase().includes(filters.search.toLowerCase()) ||
        donor.email?.toLowerCase().includes(filters.search.toLowerCase()) ||
        donor.phone?.includes(filters.search);

      const matchesBloodGroup =
        filters.bloodGroup === "all" || donor.bloodGroup === filters.bloodGroup;

      const matchesEligibility =
        filters.eligibility === "all" ||
        (filters.eligibility === "eligible" && donor.eligibleToDonate) ||
        (filters.eligibility === "ineligible" && !donor.eligibleToDonate);

      return matchesSearch && matchesBloodGroup && matchesEligibility;
    })
    .sort((a, b) => {
      let aValue, bValue;

      switch (filters.sortBy) {
        case "name":
          aValue = a.fullName?.toLowerCase();
          bValue = b.fullName?.toLowerCase();
          break;
        case "donations":
          aValue = a.donationHistory?.length || 0;
          bValue = b.donationHistory?.length || 0;
          break;
        case "age":
          aValue = a.age || 0;
          bValue = b.age || 0;
          break;
        default:
          aValue = a.fullName?.toLowerCase();
          bValue = b.fullName?.toLowerCase();
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
              <Users className="w-10 h-10 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Loading Donor Database
          </h2>
          <p className="text-gray-500 text-sm">
            Fetching all registered blood donors…
          </p>
        </div>
      </div>
    );
  }

  // ─── Derived Stats ──────────────────────────────────────────────────────────
  const eligibleCount = donors.filter((d) => d.eligibleToDonate).length;
  const ineligibleCount = donors.filter((d) => !d.eligibleToDonate).length;
  const totalDonations = donors.reduce(
    (sum, donor) => sum + (donor.donationHistory?.length || 0),
    0
  );

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
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-red-500 mb-0.5">
                  VitalBridge
                </p>
                <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 leading-none">
                  Blood Donors
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Manage and view all registered blood donors in the system.
                </p>
              </div>
            </div>

            {/* Right: Refresh + last updated */}
            <div className="flex flex-col items-end gap-1.5">
              <button
                onClick={() => fetchAllDonors(true)}
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <KpiCard
              icon={<Users className="w-4 h-4" />}
              label="Total"
              value={donors.length}
              sublabel="Registered donors"
              color="blue"
            />
            <KpiCard
              icon={<CheckCircle className="w-4 h-4" />}
              label="Eligible"
              value={eligibleCount}
              sublabel="Ready to donate"
              color="green"
            />
            <KpiCard
              icon={<XCircle className="w-4 h-4" />}
              label="Ineligible"
              value={ineligibleCount}
              sublabel="Currently unable"
              color="red"
            />
            <KpiCard
              icon={<Droplet className="w-4 h-4" />}
              label="Donations"
              value={totalDonations}
              sublabel="Total blood units"
              color="amber"
            />
          </div>
        </div>

        {/* ── Filter Toolbar ── */}
        <div className="mb-5">
          <SectionHeading
            eyebrow="Search & filter"
            icon={<Filter className="w-4 h-4" />}
            title="Filter Donors"
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
                  placeholder="Search by name, email, or phone…"
                  value={filters.search}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, search: e.target.value }))
                  }
                  className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none transition-colors text-sm text-gray-700 placeholder-gray-400 bg-white"
                />
              </div>

              {/* Blood group filter */}
              <select
                value={filters.bloodGroup}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    bloodGroup: e.target.value,
                  }))
                }
                className="px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none transition-colors text-sm text-gray-700 bg-white"
              >
                <option value="all">All Blood Types</option>
                {bloodGroups.map((group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </select>

              {/* Eligibility filter */}
              <select
                value={filters.eligibility}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    eligibility: e.target.value,
                  }))
                }
                className="px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none transition-colors text-sm text-gray-700 bg-white"
              >
                <option value="all">All Status</option>
                <option value="eligible">Eligible Only</option>
                <option value="ineligible">Ineligible Only</option>
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
                <option value="donations">Sort by Donations</option>
                <option value="age">Sort by Age</option>
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
                  {filteredDonors.length}
                </span>{" "}
                of{" "}
                <span className="text-gray-900 font-bold">{donors.length}</span>{" "}
                donors
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

        {/* ── Donor Grid ── */}
        <div>
          <SectionHeading
            eyebrow="Donor registry"
            icon={<Activity className="w-4 h-4" />}
            title={`All Donors (${filteredDonors.length})`}
          />

          {filteredDonors.length === 0 ? (
            /* ── Empty State ── */
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
              <div className="inline-flex p-4 bg-gray-50 rounded-2xl mb-5">
                <User className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {donors.length === 0 ? "No Donors Found" : "No Matching Donors"}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-5">
                {donors.length === 0
                  ? "The blood donor database is currently empty."
                  : "No donors match your current filters."}
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
              {filteredDonors.map((donor) => (
                <div
                  key={donor._id}
                  className="relative bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group"
                >
                  {/* Top accent stripe */}
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Card header */}
                  <div className="flex items-start gap-3 mb-4 pb-4 border-b border-gray-50">
                    <DonorAvatar name={donor.fullName} />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-gray-900 line-clamp-1 group-hover:text-red-600 transition-colors duration-200">
                        {donor.fullName}
                      </h3>
                      <p className="text-xs text-gray-400 mt-0.5 line-clamp-1 flex items-center gap-1">
                        <Mail size={10} className="flex-shrink-0" />
                        {donor.email}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1.5 items-end flex-shrink-0">
                      {getEligibilityBadge(donor.eligibleToDonate)}
                      {getBloodGroupBadge(donor.bloodGroup)}
                    </div>
                  </div>

                  {/* Donor details */}
                  <div className="space-y-2.5 text-sm">
                    <div className="flex items-center gap-2.5 text-gray-600">
                      <Phone className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                      <span className="text-xs truncate">
                        {donor.phone || "Not provided"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5 text-gray-600">
                      <Calendar className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                      <span className="text-xs">
                        {donor.age ? `${donor.age} years old` : "Age not provided"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5 text-gray-600">
                      <Weight className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                      <span className="text-xs">
                        {donor.weight ? `${donor.weight} kg` : "Weight not provided"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5 text-gray-600">
                      <Heart className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                      <span className="text-xs font-semibold text-gray-700">
                        {donor.donationHistory?.length || 0} donation
                        {(donor.donationHistory?.length || 0) !== 1 ? "s" : ""}
                      </span>
                    </div>

                    {/* Address */}
                    <div className="flex items-start gap-2.5 pt-2.5 border-t border-gray-50">
                      <MapPin className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />
                      <div className="text-xs text-gray-500 line-clamp-2">
                        {donor.address?.street && `${donor.address.street}, `}
                        {donor.address?.city}, {donor.address?.state}
                        {donor.address?.pincode &&
                          ` – ${donor.address.pincode}`}
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

export default GetAllDonors;
