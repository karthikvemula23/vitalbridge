import { useState, useEffect } from "react";
import {
  Users,
  Hospital,
  Droplet,
  Calendar,
  Heart,
  TrendingUp,
  Activity,
  Shield,
  Beaker,
  ArrowRight,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
} from "lucide-react";
import { toast } from "react-hot-toast";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchStats = async (showToast = false) => {
    try {
      if (showToast) setRefreshing(true);

      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/login";
        return;
      }

      console.log("🔄 Fetching admin dashboard stats...");

      const res = await fetch("/api/admin/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("📨 Dashboard response status:", res.status);

      if (!res.ok) {
        const errorText = await res.text();
        console.error("❌ Dashboard API Error:", errorText);
        throw new Error("Failed to fetch stats");
      }

      const data = await res.json();
      console.log("✅ Dashboard stats:", data);
      setStats(data);
      setLastUpdated(new Date());

      if (showToast) {
        toast.success("Dashboard updated successfully!");
      }
    } catch (err) {
      console.error("🚨 Dashboard error:", err);
      toast.error("Failed to load admin stats");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // ─── Loading State ───────────────────────────────────────────────────────────
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
            Loading Admin Dashboard
          </h2>
          <p className="text-gray-500 text-sm">Preparing system overview…</p>
        </div>
      </div>
    );
  }

  // ─── Error State ─────────────────────────────────────────────────────────────
  if (!stats) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center bg-white rounded-3xl shadow-xl border border-gray-100 p-10 max-w-sm w-full">
          <div className="inline-flex p-4 bg-red-50 rounded-2xl mb-5">
            <Shield className="w-12 h-12 text-red-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Failed to load dashboard
          </h3>
          <p className="text-gray-500 text-sm mb-6">
            Unable to retrieve system statistics. Please try again.
          </p>
          <button
            onClick={() => fetchStats(true)}
            className="w-full bg-red-600 hover:bg-red-700 active:bg-red-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  // ─── Sub-Components ───────────────────────────────────────────────────────────

  const StatCard = ({ icon, label, value, subtitle, trend, color = "red" }) => {
    const colorClasses = {
      red: {
        iconBg: "bg-red-50",
        iconText: "text-red-600",
        accent: "bg-red-500",
        trendText: "text-red-500",
      },
      blue: {
        iconBg: "bg-blue-50",
        iconText: "text-blue-600",
        accent: "bg-blue-500",
        trendText: "text-blue-500",
      },
      green: {
        iconBg: "bg-emerald-50",
        iconText: "text-emerald-600",
        accent: "bg-emerald-500",
        trendText: "text-emerald-500",
      },
      purple: {
        iconBg: "bg-violet-50",
        iconText: "text-violet-600",
        accent: "bg-violet-500",
        trendText: "text-violet-500",
      },
      amber: {
        iconBg: "bg-amber-50",
        iconText: "text-amber-600",
        accent: "bg-amber-500",
        trendText: "text-amber-500",
      },
    };

    const colors = colorClasses[color] || colorClasses.red;

    return (
      <div className="relative bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group">
        {/* Top accent stripe */}
        <div className={`absolute top-0 left-0 right-0 h-0.5 ${colors.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-xl ${colors.iconBg} ${colors.iconText} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
            {icon}
          </div>
          {trend && (
            <div className="flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-full">
              <TrendingUp className="w-3 h-3 text-emerald-500" />
              <span className="text-xs font-semibold text-emerald-600">+{trend}%</span>
            </div>
          )}
        </div>

        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
          {label}
        </p>
        <p className="text-4xl font-black tracking-tight text-gray-900 mb-1">
          {value?.toLocaleString()}
        </p>
        {subtitle && (
          <p className="text-sm text-gray-500 leading-relaxed">{subtitle}</p>
        )}
      </div>
    );
  };

  const QuickActionCard = ({
    title,
    description,
    icon,
    href,
    buttonText = "Manage",
  }) => (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 group flex flex-col">
      {/* Icon + arrow row */}
      <div className="flex items-start justify-between mb-5">
        <div className="p-4 bg-red-50 rounded-2xl text-red-600 group-hover:bg-red-600 group-hover:text-white transition-all duration-300 shadow-sm">
          {icon}
        </div>
        <div className="p-1.5 rounded-full bg-gray-100 group-hover:bg-red-50 transition-colors duration-300">
          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-red-600 group-hover:translate-x-0.5 transition-all duration-300" />
        </div>
      </div>

      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors duration-300">
        {title}
      </h3>
      <p className="text-sm text-gray-500 leading-relaxed mb-6 flex-1">
        {description}
      </p>

      <button
        onClick={() => (window.location.href = href)}
        className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 active:from-red-800 active:to-red-900 text-white py-2.5 px-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 text-sm font-semibold"
      >
        {buttonText}
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );

  const AlertCard = ({ type, title, description, count, icon }) => {
    const alertConfig = {
      warning: {
        bg: "bg-amber-50",
        border: "border-amber-200",
        accentBorder: "border-l-amber-400",
        text: "text-amber-800",
        subText: "text-amber-700",
        iconBg: "bg-amber-100",
        iconColor: "text-amber-600",
        countBg: "bg-amber-200 text-amber-800",
      },
      critical: {
        bg: "bg-red-50",
        border: "border-red-200",
        accentBorder: "border-l-red-500",
        text: "text-red-900",
        subText: "text-red-700",
        iconBg: "bg-red-100",
        iconColor: "text-red-600",
        countBg: "bg-red-200 text-red-900",
      },
      info: {
        bg: "bg-blue-50",
        border: "border-blue-200",
        accentBorder: "border-l-blue-400",
        text: "text-blue-900",
        subText: "text-blue-700",
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600",
        countBg: "bg-blue-200 text-blue-900",
      },
    };

    const config = alertConfig[type] || alertConfig.info;

    return (
      <div
        className={`${config.bg} border ${config.border} border-l-4 ${config.accentBorder} rounded-2xl p-5 hover:shadow-md transition-all duration-200`}
      >
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl ${config.iconBg} ${config.iconColor} flex-shrink-0`}>
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className={`text-sm font-bold ${config.text}`}>{title}</h3>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${config.countBg}`}>
                {count}
              </span>
            </div>
            <p className={`text-xs ${config.subText} leading-relaxed`}>
              {count} {description}
            </p>
          </div>
        </div>
      </div>
    );
  };

  // ─── Section Heading Helper ───────────────────────────────────────────────────
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
                  Admin Dashboard
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Monitor donations, inventory, facilities, and platform activity.
                </p>
              </div>
            </div>

            {/* Right: Refresh + last updated */}
            <div className="flex flex-col items-end gap-1.5">
              <button
                onClick={() => fetchStats(true)}
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

          {/* ── Quick Stats Summary Row ── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {/* Donors */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-red-50 rounded-xl text-red-600 group-hover:bg-red-600 group-hover:text-white transition-all duration-300">
                  <Users className="w-4 h-4" />
                </div>
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Donors</span>
              </div>
              <p className="text-3xl font-black text-gray-900 tracking-tight">{stats.totalDonors}</p>
              <p className="text-xs text-gray-500 mt-0.5">Total registered</p>
            </div>

            {/* Facilities */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-blue-50 rounded-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                  <Hospital className="w-4 h-4" />
                </div>
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Facilities</span>
              </div>
              <p className="text-3xl font-black text-gray-900 tracking-tight">{stats.totalFacilities}</p>
              <p className="text-xs text-gray-500 mt-0.5">Hospitals &amp; labs</p>
            </div>

            {/* Donations */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                  <Droplet className="w-4 h-4" />
                </div>
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Donations</span>
              </div>
              <p className="text-3xl font-black text-gray-900 tracking-tight">{stats.totalDonations}</p>
              <p className="text-xs text-gray-500 mt-0.5">Blood units collected</p>
            </div>

            {/* Camps */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-violet-50 rounded-xl text-violet-600 group-hover:bg-violet-600 group-hover:text-white transition-all duration-300">
                  <Calendar className="w-4 h-4" />
                </div>
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Camps</span>
              </div>
              <p className="text-3xl font-black text-gray-900 tracking-tight">{stats.upcomingCamps}</p>
              <p className="text-xs text-gray-500 mt-0.5">Upcoming drives</p>
            </div>
          </div>
        </div>

        {/* ── Main KPI Cards ── */}
        <div className="mb-8">
          <SectionHeading
            eyebrow="At a glance"
            icon={<Activity className="w-4 h-4" />}
            title="System Overview"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            <StatCard
              icon={<Users className="w-5 h-5" />}
              label="Total Donors"
              value={stats.totalDonors}
              subtitle="Registered blood donors"
              color="red"
            />
            <StatCard
              icon={<Hospital className="w-5 h-5" />}
              label="Facilities"
              value={stats.totalFacilities}
              subtitle="Hospitals &amp; Labs"
              color="blue"
            />
            <StatCard
              icon={<Droplet className="w-5 h-5" />}
              label="Total Donations"
              value={stats.totalDonations}
              subtitle="Blood units collected"
              color="green"
            />
            <StatCard
              icon={<Calendar className="w-5 h-5" />}
              label="Upcoming Camps"
              value={stats.upcomingCamps}
              subtitle="Scheduled blood drives"
              color="purple"
            />
            <StatCard
              icon={<Heart className="w-5 h-5" />}
              label="Active Donors"
              value={stats.activeDonors}
              subtitle="Recently donated"
              color="amber"
            />
          </div>
        </div>

        {/* ── System Alerts ── */}
        {(stats.pendingApprovals > 0 ||
          stats.criticalStock > 0 ||
          stats.pendingFacilities > 0) && (
          <div className="mb-8">
            <SectionHeading
              eyebrow="Action required"
              icon={<AlertTriangle className="w-4 h-4" />}
              title="System Alerts"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.pendingApprovals > 0 && (
                <AlertCard
                  type="warning"
                  title="Pending Approvals"
                  description="facility registration(s) awaiting review"
                  count={stats.pendingApprovals}
                  icon={<Clock className="w-5 h-5" />}
                />
              )}
              {stats.criticalStock > 0 && (
                <AlertCard
                  type="critical"
                  title="Critical Stock Alert"
                  description="blood type(s) with low inventory"
                  count={stats.criticalStock}
                  icon={<Droplet className="w-5 h-5" />}
                />
              )}
              {stats.pendingFacilities > 0 && (
                <AlertCard
                  type="info"
                  title="Facility Applications"
                  description="new facility application(s) pending"
                  count={stats.pendingFacilities}
                  icon={<Hospital className="w-5 h-5" />}
                />
              )}
            </div>
          </div>
        )}

        {/* ── Quick Actions ── */}
        <div className="mb-8">
          <SectionHeading
            eyebrow="Management"
            icon={<Zap className="w-4 h-4" />}
            title="Quick Actions"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <QuickActionCard
              icon={<Users className="w-5 h-5" />}
              title="Manage Donors"
              description="View, edit, or remove donors from the blood bank system."
              href="/admin/donors"
            />
            <QuickActionCard
              icon={<Hospital className="w-5 h-5" />}
              title="Manage Facilities"
              description="Approve, edit, or manage hospitals and blood laboratories."
              href="/admin/facilities"
            />
            <QuickActionCard
              icon={<Droplet className="w-5 h-5" />}
              title="Donation History"
              description="View all donation records, analytics, and reports."
              href="/admin/donations"
            />
            <QuickActionCard
              icon={<Calendar className="w-5 h-5" />}
              title="Blood Camps"
              description="Monitor and manage upcoming blood donation camps."
              href="/admin/camps"
              buttonText="View Camps"
            />
          </div>
        </div>

        {/* ── Recent Activity ── */}
        {stats.recentActivity && stats.recentActivity.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Card header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-red-50 rounded-lg text-red-600">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 leading-none mb-0.5">
                    Live feed
                  </p>
                  <h2 className="text-xl font-bold text-gray-900 leading-none">
                    Recent Activity
                  </h2>
                </div>
              </div>
              <span className="text-xs font-medium text-gray-400 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                Last 5 events
              </span>
            </div>

            {/* Activity list */}
            <div className="divide-y divide-gray-50">
              {stats.recentActivity.slice(0, 5).map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors duration-150 group"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    {/* Colored dot indicator */}
                    <div className="flex-shrink-0 w-2 h-2 rounded-full bg-red-400 group-hover:bg-red-600 transition-colors duration-200" />
                    <div className="p-2 bg-gray-50 rounded-lg text-gray-500 group-hover:bg-red-50 group-hover:text-red-600 transition-all duration-200 flex-shrink-0">
                      <Activity className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-sm text-gray-700 truncate">
                      {activity.description}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400 ml-4 flex-shrink-0 font-medium">
                    {new Date(activity.timestamp).toLocaleDateString([], {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              ))}
            </div>

            {/* Card footer */}
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
              <button className="text-xs font-semibold text-red-600 hover:text-red-700 transition-colors duration-200 flex items-center gap-1 group">
                View all activity
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform duration-200" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
