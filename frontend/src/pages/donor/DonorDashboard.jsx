import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Droplet,
  Calendar,
  Users,
  Activity,
  Clock,
  MapPin,
  Phone,
  Mail,
  User,
  Award,
  Heart,
  TrendingUp,
  RefreshCw,
  Download,
  Share2,
  CheckCircle,
  ArrowRight,
  Zap,
} from "lucide-react";
import { toast } from "react-hot-toast";

const API_URL = `${import.meta.env.VITE_API_URL || ""}/api/donor`;

// --- Sub-Components (module-level for stability) ---

const KpiCard = ({ icon, label, value, sublabel, color = "red" }) => {
  const colorClasses = {
    red: { iconBg: "bg-red-50", iconText: "text-red-600", iconHover: "group-hover:bg-red-600 group-hover:text-white" },
    green: { iconBg: "bg-emerald-50", iconText: "text-emerald-600", iconHover: "group-hover:bg-emerald-600 group-hover:text-white" },
    blue: { iconBg: "bg-blue-50", iconText: "text-blue-600", iconHover: "group-hover:bg-blue-600 group-hover:text-white" },
    purple: { iconBg: "bg-violet-50", iconText: "text-violet-600", iconHover: "group-hover:bg-violet-600 group-hover:text-white" },
    amber: { iconBg: "bg-amber-50", iconText: "text-amber-600", iconHover: "group-hover:bg-amber-600 group-hover:text-white" },
  };
  const c = colorClasses[color] || colorClasses.red;
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 ${c.iconBg} ${c.iconText} rounded-xl ${c.iconHover} transition-all duration-300`}>
          {icon}
        </div>
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">{label}</span>
      </div>
      <p className="text-3xl font-black text-gray-900 tracking-tight">{value}</p>
      {sublabel && <p className="text-xs text-gray-500 mt-0.5">{sublabel}</p>}
    </div>
  );
};

const SectionHeading = ({ icon, eyebrow, title }) => (
  <div className="mb-5">
    <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">{eyebrow}</p>
    <div className="flex items-center gap-2.5">
      <div className="p-1.5 bg-red-50 rounded-lg text-red-600 flex-shrink-0">{icon}</div>
      <h2 className="text-xl font-bold text-gray-900">{title}</h2>
    </div>
  </div>
);

const ProfileInfoItem = ({ icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div className="p-2 bg-red-50 rounded-xl text-red-600 flex-shrink-0 mt-0.5">{icon}</div>
    <div className="min-w-0">
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-0.5">{label}</p>
      <p className="font-semibold text-gray-900 truncate">{value || "—"}</p>
    </div>
  </div>
);

const DonationHistoryRow = ({ donation }) => (
  <div className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors duration-150 group border-b border-gray-50 last:border-0">
    <div className="flex items-center gap-4 min-w-0">
      <div className="flex-shrink-0 w-2 h-2 rounded-full bg-red-400 group-hover:bg-red-600 transition-colors duration-200" />
      <div className="p-2 bg-gray-50 rounded-lg text-gray-500 group-hover:bg-red-50 group-hover:text-red-600 transition-all duration-200 flex-shrink-0">
        <Droplet className="w-3.5 h-3.5" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-gray-800 truncate">
          {donation.facility || "Blood Donation Camp"}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">
          {donation.bloodType || donation.bloodGroup}
          {donation.quantity && ` · ${donation.quantity} unit${donation.quantity !== 1 ? "s" : ""}`}
        </p>
      </div>
    </div>
    <div className="flex items-center gap-3 flex-shrink-0 ml-4">
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
        <CheckCircle size={10} />
        Completed
      </span>
      <span className="text-xs text-gray-400 font-medium hidden sm:block">
        {new Date(donation.donationDate || donation.date).toLocaleDateString([], {
          month: "short", day: "numeric", year: "numeric",
        })}
      </span>
    </div>
  </div>
);

const ActivityRow = ({ activity }) => (
  <div className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors duration-150 group border-b border-gray-50 last:border-0">
    <div className="flex items-center gap-4 min-w-0">
      <div className="flex-shrink-0 w-2 h-2 rounded-full bg-red-400 group-hover:bg-red-600 transition-colors duration-200" />
      <div className="p-2 bg-gray-50 rounded-lg text-gray-500 group-hover:bg-red-50 group-hover:text-red-600 transition-all duration-200 flex-shrink-0">
        <Activity className="w-3.5 h-3.5" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-gray-800 truncate">{activity.eventType || "Donation"}</p>
        <p className="text-xs text-gray-500 truncate">{activity.description || "Blood donation completed"}</p>
      </div>
    </div>
    <span className="text-xs text-gray-400 ml-4 flex-shrink-0 font-medium">
      {new Date(activity.date || activity.createdAt).toLocaleDateString([], { month: "short", day: "numeric" })}
    </span>
  </div>
);

const QuickActionCard = ({ icon, title, description, onClick, color = "red" }) => {
  const colorClasses = {
    blue: { iconBg: "bg-blue-50", iconText: "text-blue-600", hoverBg: "group-hover:bg-blue-600" },
    green: { iconBg: "bg-emerald-50", iconText: "text-emerald-600", hoverBg: "group-hover:bg-emerald-600" },
    red: { iconBg: "bg-red-50", iconText: "text-red-600", hoverBg: "group-hover:bg-red-600" },
    purple: { iconBg: "bg-violet-50", iconText: "text-violet-600", hoverBg: "group-hover:bg-violet-600" },
  };
  const c = colorClasses[color] || colorClasses.red;
  return (
    <button
      onClick={onClick}
      className="text-left bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group flex flex-col w-full"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 ${c.iconBg} ${c.iconText} rounded-2xl ${c.hoverBg} group-hover:text-white transition-all duration-300 shadow-sm`}>
          {icon}
        </div>
        <div className="p-1.5 rounded-full bg-gray-100 group-hover:bg-red-50 transition-colors duration-300">
          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-red-600 group-hover:translate-x-0.5 transition-all duration-300" />
        </div>
      </div>
      <h3 className="text-base font-bold text-gray-900 mb-1.5 group-hover:text-red-600 transition-colors duration-300">{title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
    </button>
  );
};

const HealthStatItem = ({ label, value, icon }) => (
  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-red-50 transition-colors duration-200 group">
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-0.5">{label}</p>
      <p className="text-lg font-black text-gray-900">{value}</p>
    </div>
    <div className="p-2.5 bg-white rounded-xl text-red-500 shadow-sm group-hover:bg-red-600 group-hover:text-white transition-all duration-300">
      {icon}
    </div>
  </div>
);

// --- Main Component ---

const DonorDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [donor, setDonor] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Fetch all dashboard data
  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("🔄 Starting donor dashboard data fetch...");

      if (!token) {
        toast.error("Authentication required");
        return;
      }

      console.log("📡 Making API requests...");

      const [profileRes, historyRes, statsRes] = await Promise.all([
        axios.get(`${API_URL}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_URL}/history`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios
          .get(`${API_URL}/stats`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .catch(() => ({ data: {} })), // Fallback if stats endpoint does not exist
      ]);

      console.log("✅ API Responses received:");
      console.log("👤 Profile Response:", profileRes.data);
      console.log("📜 History Response:", historyRes.data);
      console.log("📊 Stats Response:", statsRes.data);

      const donorData = profileRes.data.donor || profileRes.data;
      setDonor(donorData);

      // Handle different response structures for history
      let historyData = [];
      if (historyRes.data.history) {
        historyData = historyRes.data.history;
      } else if (historyRes.data.donations) {
        historyData = historyRes.data.donations;
      } else if (Array.isArray(historyRes.data)) {
        historyData = historyRes.data;
      }

      setHistory(historyData);

      // Calculate dashboard stats
      const totalDonations = historyData.length;
      const livesImpacted = totalDonations * 3; // Each donation can save up to 3 lives
      const achievementLevel =
        totalDonations >= 10
          ? "Gold"
          : totalDonations >= 5
            ? "Silver"
            : "Bronze";
      const nextMilestone =
        totalDonations < 5 ? 5 : totalDonations < 10 ? 10 : 15;
      const completionRate = Math.min(
        100,
        (totalDonations / nextMilestone) * 100,
      );

      setDashboard({
        stats: {
          totalDonations,
          livesImpacted,
          achievementLevel,
          nextMilestone,
          completionRate,
          ...statsRes.data,
        },
        recentActivity: historyData.slice(0, 5),
      });

      setLastUpdated(new Date());
    } catch (error) {
      console.error("🚨 Donor Dashboard Error:", error);
      const message =
        error.response?.data?.message || "Failed to load donor dashboard data";
      toast.error(message);
    }
  };

  const handleRefresh = async () => {
    console.log("🔄 Manual refresh triggered");
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
    toast.success("Dashboard updated");
  };

  useEffect(() => {
    console.log("🎯 Donor Dashboard component mounted");
    const loadData = async () => {
      setLoading(true);
      await fetchDashboardData();
      setLoading(false);
      console.log("🏁 Donor dashboard data loading completed");
    };
    loadData();
  }, []);

  // Debug current state
  console.log("📊 Current Donor State:", {
    dashboard: dashboard,
    donor: donor,
    history: history,
    loading: loading,
    historyLength: history?.length,
  });

  // --- Loading State ---
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center">
          <div className="relative inline-flex items-center justify-center mb-6">
            <div className="absolute inset-0 rounded-full bg-red-100 animate-ping opacity-60" />
            <div className="relative p-5 bg-gradient-to-br from-red-600 to-red-800 rounded-2xl shadow-xl">
              <Heart className="w-10 h-10 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Your Dashboard</h2>
          <p className="text-gray-500 text-sm">Preparing your donation journey…</p>
        </div>
      </div>
    );
  }

  const isEligible = donor?.eligibleToDonate || false;
  const nextDonationDate = donor?.nextEligibleDate
    ? new Date(donor.nextEligibleDate)
    : null;
  const daysUntilEligible = nextDonationDate
    ? Math.ceil((nextDonationDate - new Date()) / (1000 * 60 * 60 * 24))
    : 0;

  const achievementColors = {
    Gold: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
    Silver: { bg: "bg-slate-50", text: "text-slate-600", border: "border-slate-200" },
    Bronze: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
  };
  const achieveStyle =
    achievementColors[dashboard?.stats?.achievementLevel] || achievementColors.Bronze;

  // --- Main Render ---
  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-16 lg:pb-8">
      <div className="max-w-7xl mx-auto px-1 py-6">

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3.5 bg-gradient-to-br from-red-600 to-red-800 rounded-2xl shadow-lg shadow-red-200">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-red-500 mb-0.5">
                  VitalBridge · Donor Portal
                </p>
                <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 leading-none">
                  My Dashboard
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Track your donation journey and the lives you've helped save.
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 active:from-red-800 active:to-red-900 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
                {refreshing ? "Refreshing…" : "Refresh Data"}
              </button>
              {lastUpdated && (
                <p className="text-xs text-gray-400">
                  Last updated:{" "}
                  {lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              )}
            </div>
          </div>

          {/* KPI Summary Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <KpiCard
              icon={<Droplet className="w-4 h-4" />}
              label="Donations"
              value={dashboard?.stats?.totalDonations ?? 0}
              sublabel="Total blood units given"
              color="red"
            />
            <KpiCard
              icon={<Users className="w-4 h-4" />}
              label="Lives Impacted"
              value={dashboard?.stats?.livesImpacted ?? 0}
              sublabel="3 lives per donation"
              color="green"
            />
            <KpiCard
              icon={<Award className="w-4 h-4" />}
              label="Achievement"
              value={dashboard?.stats?.achievementLevel || "Bronze"}
              sublabel="Keep donating to level up"
              color="purple"
            />
            <KpiCard
              icon={<Calendar className="w-4 h-4" />}
              label="Next Eligible"
              value={
                donor?.nextEligibleDate
                  ? new Date(donor.nextEligibleDate).toLocaleDateString([], {
                      month: "short",
                      day: "numeric",
                    })
                  : "Now"
              }
              sublabel={isEligible ? "Ready to donate!" : `${daysUntilEligible} days left`}
              color="blue"
            />
          </div>
        </div>

        {/* Eligibility Banners */}
        {!isEligible && nextDonationDate && (
          <div className="mb-8 bg-amber-50 border border-amber-200 border-l-4 border-l-amber-400 rounded-2xl p-5 flex items-center gap-4 hover:shadow-md transition-all duration-200">
            <div className="p-3 rounded-xl bg-amber-100 text-amber-600 flex-shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm font-bold text-amber-800">Next Donation Window</h3>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-800">
                  {daysUntilEligible} day{daysUntilEligible !== 1 ? "s" : ""}
                </span>
              </div>
              <p className="text-xs text-amber-700 leading-relaxed">
                You can donate again in {daysUntilEligible} day{daysUntilEligible !== 1 ? "s" : ""} on{" "}
                {nextDonationDate.toLocaleDateString([], {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}.
              </p>
            </div>
          </div>
        )}

        {isEligible && (
          <div className="mb-8 bg-emerald-50 border border-emerald-200 border-l-4 border-l-emerald-400 rounded-2xl p-5 flex items-center gap-4 hover:shadow-md transition-all duration-200">
            <div className="p-3 rounded-xl bg-emerald-100 text-emerald-600 flex-shrink-0">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-emerald-800 mb-1">You're Ready to Donate!</h3>
              <p className="text-xs text-emerald-700 leading-relaxed">
                You are eligible to give blood right now. Find a nearby camp or facility to schedule your next donation.
              </p>
            </div>
          </div>
        )}

        {/* Donor Profile Card */}
        {donor && (
          <div className="mb-8">
            <SectionHeading
              eyebrow="Your details"
              icon={<User className="w-4 h-4" />}
              title="Donor Profile"
            />
            <div className="relative bg-white rounded-2xl border border-gray-100 p-6 shadow-sm overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-red-500 to-red-700" />
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 pb-6 border-b border-gray-50">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center flex-shrink-0 shadow-md shadow-red-200">
                  <span className="text-2xl font-black text-white">
                    {(donor.fullName || donor.name || "D")
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-extrabold text-gray-900 mb-0.5">
                    {donor.fullName || donor.name || "Donor"}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-600 text-white border border-red-700 shadow-sm">
                      <Droplet size={10} />
                      {donor.bloodGroup || "Unknown"}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                        isEligible
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}
                    >
                      {isEligible ? <CheckCircle size={10} /> : <Clock size={10} />}
                      {isEligible ? "Eligible to Donate" : "Not Currently Eligible"}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${achieveStyle.bg} ${achieveStyle.text} ${achieveStyle.border}`}
                    >
                      <Award size={10} />
                      {dashboard?.stats?.achievementLevel || "Bronze"} Donor
                    </span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <ProfileInfoItem icon={<Mail className="w-4 h-4" />} label="Email" value={donor.email} />
                <ProfileInfoItem icon={<Phone className="w-4 h-4" />} label="Phone" value={donor.phone} />
                <ProfileInfoItem
                  icon={<MapPin className="w-4 h-4" />}
                  label="Location"
                  value={`${donor.address?.city || "N/A"}, ${donor.address?.state || "N/A"}`}
                />
                <ProfileInfoItem
                  icon={<Calendar className="w-4 h-4" />}
                  label="Donor Since"
                  value={donor.createdAt ? new Date(donor.createdAt).getFullYear() : new Date().getFullYear()}
                />
              </div>
            </div>
          </div>
        )}

        {/* Donation History + Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div>
            <SectionHeading eyebrow="Your journey" icon={<Activity className="w-4 h-4" />} title="Donation History" />
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-red-50 rounded-lg text-red-600"><Droplet className="w-4 h-4" /></div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 leading-none">Blood Donations</p>
                </div>
                <span className="text-xs font-medium text-gray-400 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                  {history.length > 5 ? `Latest 5 of ${history.length}` : `${history.length} total`}
                </span>
              </div>
              {history.length > 0 ? (
                <div>
                  {history.slice(0, 5).map((donation, index) => (
                    <DonationHistoryRow key={donation._id || index} donation={donation} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-14 px-6">
                  <div className="inline-flex p-4 bg-gray-50 rounded-2xl mb-4">
                    <Droplet className="w-8 h-8 text-gray-300" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-1">No Donations Yet</h3>
                  <p className="text-sm text-gray-500 mb-5">Your donation history will appear here after your first donation.</p>
                  <button
                    onClick={() => toast.success("Find nearby blood camps to get started!")}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-sm font-semibold"
                  >
                    Find a Camp <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
              {history.length > 0 && (
                <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
                  <button className="text-xs font-semibold text-red-600 hover:text-red-700 transition-colors duration-200 flex items-center gap-1 group">
                    View full history <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform duration-200" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div>
            <SectionHeading eyebrow="Latest updates" icon={<Clock className="w-4 h-4" />} title="Recent Activity" />
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-red-50 rounded-lg text-red-600"><Activity className="w-4 h-4" /></div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 leading-none">Live Feed</p>
                </div>
                <span className="text-xs font-medium text-gray-400 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">Last 5 events</span>
              </div>
              {dashboard?.recentActivity?.length > 0 ? (
                <div>
                  {dashboard.recentActivity.map((activity, index) => (
                    <ActivityRow key={activity._id || index} activity={activity} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-14 px-6">
                  <div className="inline-flex p-4 bg-gray-50 rounded-2xl mb-4">
                    <Activity className="w-8 h-8 text-gray-300" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-1">No Recent Activity</h3>
                  <p className="text-sm text-gray-500">Your activity feed will update as you participate in donations and camps.</p>
                </div>
              )}
              {dashboard?.recentActivity?.length > 0 && (
                <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
                  <button className="text-xs font-semibold text-red-600 hover:text-red-700 transition-colors duration-200 flex items-center gap-1 group">
                    View all activity <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform duration-200" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <SectionHeading eyebrow="Your portal" icon={<Zap className="w-4 h-4" />} title="Quick Actions" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <QuickActionCard
              icon={<Download className="w-5 h-5" />}
              title="Download Certificate"
              description="Get your official blood donation certificate as a PDF."
              onClick={() => toast.success("Certificate download started!")}
              color="blue"
            />
            <QuickActionCard
              icon={<Share2 className="w-5 h-5" />}
              title="Share Achievement"
              description="Inspire others by sharing your life-saving journey."
              onClick={() => toast.success("Share your life-saving journey!")}
              color="green"
            />
            <QuickActionCard
              icon={<Calendar className="w-5 h-5" />}
              title="Find Blood Camps"
              description="Discover nearby blood donation camps and drives."
              onClick={() => toast.success("Find nearby blood donation camps!")}
              color="red"
            />
            <QuickActionCard
              icon={<Users className="w-5 h-5" />}
              title="Invite Friends"
              description="Grow the donor community by inviting your friends."
              onClick={() => toast.success("Invite friends to become donors!")}
              color="purple"
            />
          </div>
        </div>

        {/* Health Overview */}
        {donor && (
          <div>
            <SectionHeading eyebrow="Health snapshot" icon={<Heart className="w-4 h-4" />} title="Health Overview" />
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <HealthStatItem label="Age" value={donor.age ? `${donor.age} yrs` : "N/A"} icon={<User className="w-4 h-4" />} />
                <HealthStatItem label="Weight" value={donor.weight ? `${donor.weight} kg` : "N/A"} icon={<Activity className="w-4 h-4" />} />
                <HealthStatItem
                  label="Last Donation"
                  value={
                    donor.lastDonationDate
                      ? new Date(donor.lastDonationDate).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })
                      : "Never"
                  }
                  icon={<Calendar className="w-4 h-4" />}
                />
                <HealthStatItem
                  label="Milestone Progress"
                  value={`${Math.round(dashboard?.stats?.completionRate || 0)}%`}
                  icon={<TrendingUp className="w-4 h-4" />}
                />
              </div>
              <div className="mt-5 pt-5 border-t border-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-gray-600">
                    Progress to next milestone ({dashboard?.stats?.nextMilestone || 5} donations)
                  </p>
                  <p className="text-xs font-bold text-red-600">
                    {dashboard?.stats?.totalDonations || 0} / {dashboard?.stats?.nextMilestone || 5}
                  </p>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="h-2.5 bg-gradient-to-r from-red-500 to-red-700 rounded-full transition-all duration-700"
                    style={{ width: `${Math.min(100, dashboard?.stats?.completionRate || 0)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonorDashboard;
