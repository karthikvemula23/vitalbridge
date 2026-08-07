import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  Building,
  MapPin,
  Phone,
  Mail,
  Calendar,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Shield,
  Download,
  Eye,
  RefreshCw,
  AlertCircle,
  Activity,
} from "lucide-react";

// ─── Module-level sub-components ─────────────────────────────────────────────

const getStatusBadge = (status) => {
  const statusConfig = {
    pending: {
      color: "bg-amber-50 text-amber-700 border-amber-200",
      icon: Clock,
      label: "Pending Review",
    },
    approved: {
      color: "bg-emerald-50 text-emerald-700 border-emerald-200",
      icon: CheckCircle,
      label: "Approved",
    },
    rejected: {
      color: "bg-red-50 text-red-700 border-red-200",
      icon: XCircle,
      label: "Rejected",
    },
  };

  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.color}`}
    >
      <Icon size={12} />
      {config.label}
    </span>
  );
};

const getFacilityTypeBadge = (type) => {
  const isHospital = type === "Hospital";
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${
        isHospital
          ? "bg-blue-50 text-blue-700 border-blue-200"
          : "bg-violet-50 text-violet-700 border-violet-200"
      }`}
    >
      <Building size={12} />
      {type || "Facility"}
    </span>
  );
};

const KpiCard = ({ icon, label, value, color = "red" }) => {
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

// ─────────────────────────────────────────────────────────────────────────────

const FacilityApproval = () => {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionLoading, setActionLoading] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const token = localStorage.getItem("token");
  const API_URL = `${import.meta.env.VITE_API_URL || ""}/api/admin`;

  // Fetch pending facilities
  const fetchPendingFacilities = async (showToast = false) => {
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

      // Filter to show only pending facilities for approval
      const pendingFacilities =
        data.facilities?.filter((f) => f.status === "pending") || [];
      setFacilities(pendingFacilities);
      setLastUpdated(new Date());

      if (showToast) {
        toast.success(`Found ${pendingFacilities.length} pending facilities`);
      }
    } catch (error) {
      console.error("🚨 Fetch facilities error:", error);
      toast.error("Failed to load facilities. Please check your connection.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPendingFacilities();
  }, []);

  const handleApprove = async (facilityId) => {
    if (!facilityId) {
      toast.error("Invalid facility ID");
      return;
    }

    setActionLoading(facilityId);
    console.log("✅ Approving facility:", facilityId);

    try {
      const res = await fetch(`${API_URL}/facility/approve/${facilityId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      console.log("📨 Approval response:", data);

      if (res.ok && data.message) {
        toast.success("Facility approved successfully!");
        // Remove the approved facility from the list
        setFacilities((prev) => prev.filter((f) => f._id !== facilityId));
        setSelectedFacility(null);
      } else {
        throw new Error(data.message || "Approval failed");
      }
    } catch (error) {
      console.error("🚨 Approval error:", error);
      toast.error(error.message || "Error approving facility");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (facilityId) => {
    if (!facilityId) {
      toast.error("Invalid facility ID");
      return;
    }

    if (!rejectionReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }

    setActionLoading(facilityId);
    console.log(
      "❌ Rejecting facility:",
      facilityId,
      "Reason:",
      rejectionReason,
    );

    try {
      const res = await fetch(`${API_URL}/facility/reject/${facilityId}`, {
        // 👇 FIX: Change method to PUT for status update
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rejectionReason }),
      });

      const data = await res.json();
      console.log("📨 Rejection response:", data);

      if (res.ok && data.message) {
        toast.success("Facility rejected successfully!");
        // Remove the rejected facility from the list
        setFacilities((prev) => prev.filter((f) => f._id !== facilityId));
        setSelectedFacility(null);
        setRejectionReason("");
      } else {
        throw new Error(data.message || "Rejection failed");
      }
    } catch (error) {
      console.error("🚨 Rejection error:", error);
      toast.error(error.message || "Error rejecting facility");
    } finally {
      setActionLoading(null);
    }
  };

  const handleViewDocument = (documentUrl, filename = "document") => {
    if (!documentUrl) {
      toast.error("Document not available");
      return;
    }

    console.log("📄 Opening document:", documentUrl);
    window.open(documentUrl, "_blank", "noopener,noreferrer");
  };

  const handleDownloadDocument = (documentUrl, filename = "document") => {
    if (!documentUrl) {
      toast.error("Document not available for download");
      return;
    }

    console.log("💾 Downloading document:", documentUrl);
    const link = document.createElement("a");
    link.href = documentUrl;
    link.download = filename;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ─── Loading State ────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center">
          <div className="relative inline-flex items-center justify-center mb-6">
            <div className="absolute inset-0 rounded-full bg-red-100 animate-ping opacity-60" />
            <div className="relative p-5 bg-gradient-to-br from-red-600 to-red-800 rounded-2xl shadow-xl">
              <Shield className="w-10 h-10 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Loading Facility Approvals
          </h2>
          <p className="text-gray-500 text-sm">
            Fetching pending registration requests…
          </p>
        </div>
      </div>
    );
  }

  // ─── Main Render ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-16 lg:pb-8">
      <div className="max-w-7xl mx-auto px-1 py-6">

        {/* ── Header ── */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            {/* Left: Icon + Title */}
            <div className="flex items-center gap-4">
              <div className="p-3.5 bg-gradient-to-br from-red-600 to-red-800 rounded-2xl shadow-lg shadow-red-200">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-red-500 mb-0.5">
                  VitalBridge
                </p>
                <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 leading-none">
                  Facility Verification
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Review and verify hospital and blood lab registration requests.
                </p>
              </div>
            </div>

            {/* Right: Refresh + last updated */}
            <div className="flex flex-col items-end gap-1.5">
              <button
                onClick={() => fetchPendingFacilities(true)}
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
              icon={<Clock className="w-4 h-4" />}
              label="Pending"
              value={facilities.length}
              color="amber"
            />
            <KpiCard
              icon={<CheckCircle className="w-4 h-4" />}
              label="Approved"
              value="—"
              color="green"
            />
            <KpiCard
              icon={<XCircle className="w-4 h-4" />}
              label="Rejected"
              value="—"
              color="red"
            />
            <KpiCard
              icon={<Building className="w-4 h-4" />}
              label="Total"
              value={facilities.length}
              color="blue"
            />
          </div>
        </div>

        {/* ── Main Content: two-column layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* ── Pending Requests Column ── */}
          <div>
            <SectionHeading
              eyebrow="Verification queue"
              icon={<Activity className="w-4 h-4" />}
              title={`Pending Requests (${facilities.length})`}
            />

            <div className="space-y-4">
              {facilities.length === 0 ? (
                /* Empty state */
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
                  <div className="inline-flex p-4 bg-emerald-50 rounded-2xl mb-5">
                    <CheckCircle className="w-10 h-10 text-emerald-500" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    All Caught Up!
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    No pending facility requests at this time.
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    All facilities have been reviewed and processed.
                  </p>
                </div>
              ) : (
                facilities.map((facility) => (
                  <div
                    key={facility._id}
                    onClick={() => {
                      console.log("🎯 Selecting facility:", facility._id);
                      setSelectedFacility(facility);
                    }}
                    className={`relative bg-white rounded-2xl border p-6 cursor-pointer transition-all duration-300 overflow-hidden group hover:shadow-xl hover:-translate-y-1 ${
                      selectedFacility?._id === facility._id
                        ? "border-red-300 shadow-lg ring-2 ring-red-200"
                        : "border-gray-100 shadow-sm hover:border-red-200"
                    }`}
                  >
                    {/* Top accent stripe */}
                    <div
                      className={`absolute top-0 left-0 right-0 h-0.5 bg-red-500 transition-opacity duration-300 ${
                        selectedFacility?._id === facility._id
                          ? "opacity-100"
                          : "opacity-0 group-hover:opacity-100"
                      }`}
                    />

                    {/* Card header row */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <h3 className="text-base font-bold text-gray-900 line-clamp-1">
                            {facility.name}
                          </h3>
                          {getFacilityTypeBadge(facility.facilityType)}
                        </div>
                        <p className="text-gray-500 text-sm flex items-center gap-1.5 mb-1">
                          <Mail size={13} className="flex-shrink-0 text-gray-400" />
                          {facility.email}
                        </p>
                        <p className="text-gray-500 text-sm flex items-center gap-1.5">
                          <Phone size={13} className="flex-shrink-0 text-gray-400" />
                          {facility.phone || "No phone provided"}
                        </p>
                      </div>
                      <div className="ml-3 flex-shrink-0">
                        {getStatusBadge(facility.status)}
                      </div>
                    </div>

                    {/* Address / Reg / Date */}
                    <div className="space-y-1.5 text-sm text-gray-500 border-t border-gray-50 pt-4">
                      <p className="flex items-start gap-1.5">
                        <MapPin size={13} className="flex-shrink-0 mt-0.5 text-gray-400" />
                        <span>
                          {facility.address?.street || "Address not provided"},{" "}
                          {facility.address?.city}, {facility.address?.state} –{" "}
                          {facility.address?.pincode}
                        </span>
                      </p>
                      <p className="flex items-center gap-1.5">
                        <FileText size={13} className="flex-shrink-0 text-gray-400" />
                        Reg: {facility.registrationNumber || "Not provided"}
                      </p>
                      <p className="flex items-center gap-1.5">
                        <Calendar size={13} className="flex-shrink-0 text-gray-400" />
                        Registered:{" "}
                        {new Date(facility.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    {/* Document buttons */}
                    {facility.documents?.registrationProof && (
                      <div className="mt-4 flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewDocument(
                              facility.documents.registrationProof.url,
                              facility.documents.registrationProof.filename,
                            );
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
                        >
                          <Eye size={13} />
                          View Document
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownloadDocument(
                              facility.documents.registrationProof.url,
                              facility.documents.registrationProof.filename,
                            );
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200"
                        >
                          <Download size={13} />
                          Download
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* ── Facility Details Panel ── */}
          <div className="lg:sticky lg:top-6 lg:h-fit">
            {selectedFacility ? (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Panel header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 bg-red-50 rounded-lg text-red-600">
                      <Building className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 leading-none mb-0.5">
                        Review
                      </p>
                      <h2 className="text-xl font-bold text-gray-900 leading-none">
                        Facility Details
                      </h2>
                    </div>
                  </div>
                  {getStatusBadge(selectedFacility.status)}
                </div>

                {/* Detail fields */}
                <div className="px-6 py-5 space-y-5">

                  {/* Name + Type */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
                        Facility Name
                      </p>
                      <p className="text-sm font-bold text-gray-900">
                        {selectedFacility.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
                        Type
                      </p>
                      {getFacilityTypeBadge(selectedFacility.facilityType)}
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
                      Email
                    </p>
                    <p className="text-sm text-gray-900 flex items-center gap-1.5">
                      <Mail size={13} className="text-gray-400" />
                      {selectedFacility.email}
                    </p>
                  </div>

                  {/* Phone + Emergency Contact */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
                        Phone
                      </p>
                      <p className="text-sm text-gray-900 flex items-center gap-1.5">
                        <Phone size={13} className="text-gray-400" />
                        {selectedFacility.phone || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
                        Emergency Contact
                      </p>
                      <p className="text-sm text-gray-900">
                        {selectedFacility.emergencyContact || "Not provided"}
                      </p>
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
                      Address
                    </p>
                    <p className="text-sm text-gray-900 flex items-start gap-1.5">
                      <MapPin size={13} className="text-gray-400 mt-0.5 flex-shrink-0" />
                      <span>
                        {selectedFacility.address?.street || "Street not provided"},
                        {" "}{selectedFacility.address?.city}
                        <br />
                        {selectedFacility.address?.state} –{" "}
                        {selectedFacility.address?.pincode}
                      </span>
                    </p>
                  </div>

                  {/* Registration Number */}
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
                      Registration Number
                    </p>
                    <p className="text-sm text-gray-900 font-mono bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 inline-block">
                      {selectedFacility.registrationNumber || "Not provided"}
                    </p>
                  </div>

                  {/* Category */}
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
                      Category
                    </p>
                    <p className="text-sm text-gray-900 capitalize">
                      {selectedFacility.facilityCategory || "Not specified"}
                    </p>
                  </div>

                  {/* Operating Hours */}
                  {selectedFacility.operatingHours && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
                        Operating Hours
                      </p>
                      <p className="text-sm text-gray-900">
                        {selectedFacility.operatingHours.open} –{" "}
                        {selectedFacility.operatingHours.close}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {selectedFacility.operatingHours.workingDays?.join(", ") ||
                          "Not specified"}
                        {selectedFacility.is24x7 && " • 24/7 Service"}
                      </p>
                    </div>
                  )}

                  {/* Emergency Services */}
                  {selectedFacility.emergencyServices && (
                    <div className="p-3 bg-red-50 rounded-xl border border-red-100 flex items-center gap-2.5">
                      <div className="p-1.5 bg-red-100 rounded-lg text-red-600 flex-shrink-0">
                        <Shield size={14} />
                      </div>
                      <p className="text-sm text-red-700 font-semibold">
                        Emergency Services Available
                      </p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="px-6 py-5 border-t border-gray-100 space-y-4 bg-gray-50/50">
                  {/* Approve */}
                  <button
                    onClick={() => handleApprove(selectedFacility._id)}
                    disabled={actionLoading === selectedFacility._id}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 active:from-emerald-700 active:to-emerald-800 text-white py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm"
                  >
                    {actionLoading === selectedFacility._id ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <CheckCircle size={18} />
                    )}
                    {actionLoading === selectedFacility._id
                      ? "Approving…"
                      : "Approve Facility"}
                  </button>

                  {/* Reject section */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400">
                      Rejection Reason (required)
                    </label>
                    <textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Provide specific reason for rejection. This will be communicated to the facility..."
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-200 resize-none transition-colors text-sm text-gray-700 placeholder-gray-400 bg-white"
                      rows="3"
                    />
                    <button
                      onClick={() => handleReject(selectedFacility._id)}
                      disabled={
                        actionLoading === selectedFacility._id ||
                        !rejectionReason.trim()
                      }
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 active:from-red-800 active:to-red-900 text-white py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm"
                    >
                      {actionLoading === selectedFacility._id ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <XCircle size={18} />
                      )}
                      {actionLoading === selectedFacility._id
                        ? "Rejecting…"
                        : "Reject Facility"}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Empty panel state */
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
                <div className="inline-flex p-4 bg-gray-50 rounded-2xl mb-5">
                  <Building className="w-10 h-10 text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Select a Facility
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Click on any facility from the list to review its details and
                  take action.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacilityApproval;
