import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Droplet, Calendar, Search, Filter, Download, MapPin,
  AlertCircle, Award, TrendingUp, Heart, Star,
  Clock, CheckCircle, ArrowRight, Activity, FileText,
} from "lucide-react";
import { toast } from "react-hot-toast";

const API_URL = `${import.meta.env.VITE_API_URL || ""}/api/donor`;

const SectionHeading = ({ icon, eyebrow, title }) => (
  <div className="mb-5">
    <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">{eyebrow}</p>
    <div className="flex items-center gap-2.5">
      <div className="p-1.5 bg-red-50 rounded-lg text-red-600 flex-shrink-0">{icon}</div>
      <h2 className="text-xl font-bold text-gray-900">{title}</h2>
    </div>
  </div>
);

const KpiCard = ({ icon, label, value, sublabel, color = "red" }) => {
  const cc = {
    red: { iconBg: "bg-red-50", iconText: "text-red-600", hover: "group-hover:bg-red-600 group-hover:text-white" },
    green: { iconBg: "bg-emerald-50", iconText: "text-emerald-600", hover: "group-hover:bg-emerald-600 group-hover:text-white" },
    blue: { iconBg: "bg-blue-50", iconText: "text-blue-600", hover: "group-hover:bg-blue-600 group-hover:text-white" },
    purple: { iconBg: "bg-violet-50", iconText: "text-violet-600", hover: "group-hover:bg-violet-600 group-hover:text-white" },
  };
  const c = cc[color] || cc.red;
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 ${c.iconBg} ${c.iconText} rounded-xl ${c.hover} transition-all duration-300`}>{icon}</div>
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">{label}</span>
      </div>
      <p className="text-3xl font-black text-gray-900 tracking-tight">{value}</p>
      {sublabel && <p className="text-xs text-gray-500 mt-0.5">{sublabel}</p>}
    </div>
  );
};

const DonorDonationHistory = () => {
  const [history, setHistory] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalDonations: 0, totalUnits: 0, lifeImpact: 0, lastDonation: null, favoriteFacility: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) { toast.error("Please login to view your donation history"); setLoading(false); return; }
      const res = await axios.get(`${API_URL}/history`, { headers: { Authorization: `Bearer ${token}` } });
      let data = res.data.history || res.data.donations || (Array.isArray(res.data) ? res.data : []);
      console.log("Fetched donation history:", data);
      data.sort((a, b) => new Date(b.donationDate || b.date) - new Date(a.donationDate || a.date));
      setHistory(data); setFiltered(data); calculateStats(data);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) toast.error("Session expired. Please login again.");
      else toast.error("Failed to load donation history");
    }
    setLoading(false);
  };

  const calculateStats = (data) => {
    const totalDonations = data.length;
    const totalUnits = data.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const lifeImpact = totalUnits * 3;
    const lastDonation = data.length > 0 ? data[0].donationDate || data[0].date : null;
    const facilityCount = data.reduce((acc, item) => {
      const f = item.facility || item.city || "Unknown";
      acc[f] = (acc[f] || 0) + 1; return acc;
    }, {});
    const favoriteFacility = Object.keys(facilityCount).reduce(
      (a, b) => (facilityCount[a] > facilityCount[b] ? a : b), "None"
    );
    setStats({ totalDonations, totalUnits, lifeImpact, lastDonation, favoriteFacility });
  };

  const getDonorLevel = (count) => {
    if (count >= 10) return { level: "Hero", color: "purple", icon: <Award className="w-4 h-4"/> };
    if (count >= 5) return { level: "Champion", color: "red", icon: <Star className="w-4 h-4"/> };
    if (count >= 3) return { level: "Supporter", color: "green", icon: <TrendingUp className="w-4 h-4"/> };
    return { level: "Starter", color: "blue", icon: <Heart className="w-4 h-4"/> };
  };

  const applyFilter = () => {
    let filteredData = [...history];
    if (filterType !== "all") {
      const months = { last3: 3, last6: 6, last12: 12 }[filterType];
      const cutoff = new Date(); cutoff.setMonth(cutoff.getMonth() - months);
      filteredData = filteredData.filter((item) => new Date(item.donationDate || item.date) >= cutoff);
    }
    if (searchTerm.trim()) {
      filteredData = filteredData.filter((item) =>
        item.facility?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.bloodGroup?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.city?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    filteredData.sort((a, b) => {
      const dA = new Date(a.donationDate || a.date), dB = new Date(b.donationDate || b.date);
      if (sortBy === "date-asc") return dA - dB;
      if (sortBy === "units-desc") return (b.quantity || 1) - (a.quantity || 1);
      return dB - dA;
    });
    setFiltered(filteredData);
  };

  const exportToCSV = () => {
    const headers = ["Date", "Facility", "City", "Blood Group", "Units", "Status"];
    const csvData = filtered.map((item) =>
      [
        new Date(item.donationDate || item.date).toLocaleDateString(),
        item.facility || "Blood Donation Camp", item.city || "N/A",
        item.bloodGroup || "N/A", item.quantity || 1, "Completed",
      ].join(",")
    );
    const csv = [headers.join(","), ...csvData].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "donation-history.csv"; a.click();
    URL.revokeObjectURL(url);
    toast.success("Data exported successfully!");
  };

  useEffect(() => { fetchHistory(); }, []);
  useEffect(() => { applyFilter(); }, [searchTerm, filterType, sortBy, history]);

  const donorLevel = getDonorLevel(stats.totalDonations);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center">
          <div className="relative inline-flex items-center justify-center mb-6">
            <div className="absolute inset-0 rounded-full bg-red-100 animate-ping opacity-60"/>
            <div className="relative p-5 bg-gradient-to-br from-red-600 to-red-800 rounded-2xl shadow-xl">
              <Droplet className="w-10 h-10 text-white"/>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Your Journey</h2>
          <p className="text-gray-500 text-sm">Fetching your life-saving contributions…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-16 lg:pb-8">
      <div className="max-w-7xl mx-auto px-1 py-6">

        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-gradient-to-br from-red-600 to-red-800 rounded-2xl shadow-lg shadow-red-200">
              <Activity className="w-8 h-8 text-white"/>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-red-500 mb-0.5">
                VitalBridge · Donor Portal
              </p>
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 leading-none">
                Donation History
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Track your life-saving contributions and see the impact you are making.
              </p>
            </div>
          </div>
          <button onClick={exportToCSV}
            className="flex items-center gap-2 px-5 py-2.5 border-2 border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 text-sm font-semibold">
            <Download className="w-4 h-4"/>Export CSV
          </button>
        </div>

        {/* KPI Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <KpiCard icon={<Droplet className="w-4 h-4"/>} label="Donations" value={stats.totalDonations} sublabel="Total blood donations" color="red"/>
          <KpiCard icon={<TrendingUp className="w-4 h-4"/>} label="Units Donated" value={stats.totalUnits} sublabel="Total blood units given" color="green"/>
          <KpiCard icon={<Heart className="w-4 h-4"/>} label="Lives Impacted" value={`${stats.lifeImpact}+`} sublabel="3 lives per unit" color="blue"/>
          <KpiCard icon={donorLevel.icon} label="Donor Level" value={donorLevel.level} sublabel={`${stats.totalDonations} donation${stats.totalDonations !== 1 ? "s" : ""} total`} color={donorLevel.color}/>
        </div>

        {/* Last donation + fav facility info strip */}
        {(stats.lastDonation || stats.favoriteFacility) && (
          <div className="flex flex-wrap gap-3 mb-8">
            {stats.lastDonation && (
              <div className="flex items-center gap-2.5 bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-2.5">
                <div className="p-1.5 bg-red-50 rounded-lg text-red-600"><Calendar className="w-4 h-4"/></div>
                <div>
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide leading-none mb-0.5">Last Donation</p>
                  <p className="text-sm font-bold text-gray-900">
                    {new Date(stats.lastDonation).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                </div>
              </div>
            )}
            {stats.favoriteFacility && stats.favoriteFacility !== "None" && (
              <div className="flex items-center gap-2.5 bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-2.5">
                <div className="p-1.5 bg-red-50 rounded-lg text-red-600"><MapPin className="w-4 h-4"/></div>
                <div>
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide leading-none mb-0.5">Top Facility</p>
                  <p className="text-sm font-bold text-gray-900 truncate max-w-[160px]">{stats.favoriteFacility}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Controls */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="flex-1">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4"/>
                <input type="text" placeholder="Search by facility, city, or blood group..."
                  className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-100 rounded-xl text-sm bg-gray-50 focus:bg-white focus:border-red-400 focus:ring-2 focus:ring-red-50 outline-none transition-all duration-200"
                  value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400"/>
                <select value={filterType} onChange={(e) => setFilterType(e.target.value)}
                  className="border-2 border-gray-100 bg-gray-50 text-sm px-3 py-2.5 rounded-xl focus:border-red-400 focus:bg-white outline-none transition-all duration-200">
                  <option value="all">All Time</option>
                  <option value="last3">Last 3 Months</option>
                  <option value="last6">Last 6 Months</option>
                  <option value="last12">Last 12 Months</option>
                </select>
              </div>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                className="border-2 border-gray-100 bg-gray-50 text-sm px-3 py-2.5 rounded-xl focus:border-red-400 focus:bg-white outline-none transition-all duration-200">
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="units-desc">Most Units</option>
              </select>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {filtered.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
            <div className="inline-flex p-5 bg-gray-50 rounded-2xl mb-5">
              {history.length === 0
                ? <Droplet className="w-12 h-12 text-gray-300"/>
                : <AlertCircle className="w-12 h-12 text-gray-300"/>}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {history.length === 0 ? "No Donations Yet" : "No Matching Records"}
            </h3>
            <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
              {history.length === 0
                ? "Start your life-saving journey by making your first blood donation."
                : "Try adjusting your search or filters to find what you are looking for."}
            </p>
            {history.length === 0 && (
              <button className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg text-sm">
                Schedule Your First Donation
                <ArrowRight className="w-4 h-4"/>
              </button>
            )}
          </div>
        )}

        {/* Donation Cards */}
        {filtered.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <SectionHeading eyebrow="Contributions" icon={<FileText className="w-4 h-4"/>} title="Donation Records"/>
              <span className="text-xs font-medium text-gray-400 bg-white px-3 py-1.5 rounded-full border border-gray-100 shadow-sm">
                {filtered.length} record{filtered.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Table header */}
              <div className="hidden md:grid grid-cols-12 px-6 py-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold uppercase tracking-widest text-gray-400">
                <div className="col-span-4">Donation</div>
                <div className="col-span-3">Date</div>
                <div className="col-span-2">Blood Group</div>
                <div className="col-span-1 text-center">Units</div>
                <div className="col-span-2 text-right">Status</div>
              </div>

              {filtered.map((item, index) => {
                const date = new Date(item.donationDate || item.date);
                const isRecent = new Date() - date < 30 * 24 * 60 * 60 * 1000;
                return (
                  <div key={item._id || index}
                    className="group px-6 py-5 hover:bg-gray-50 transition-colors duration-150 border-b border-gray-50 last:border-0">
                    {/* Mobile layout */}
                    <div className="md:hidden space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2.5 rounded-xl flex-shrink-0 ${isRecent ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}>
                            <Droplet className="w-4 h-4"/>
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900">{item.bloodGroup || "Blood"} Donation</p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              {date.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle size={9}/>Completed
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 ml-11">
                        {item.facility && (
                          <span className="text-xs text-gray-500 flex items-center gap-1"><MapPin size={10}/>{item.facility}</span>
                        )}
                        {item.city && (
                          <span className="text-xs text-gray-500 flex items-center gap-1"><MapPin size={10}/>{item.city}{item.state && `, ${item.state}`}</span>
                        )}
                        <span className="px-2 py-0.5 bg-gray-100 rounded-md text-xs font-semibold text-gray-600">
                          {item.quantity || 1} unit{(item.quantity || 1) !== 1 ? "s" : ""}
                        </span>
                        {isRecent && (
                          <span className="px-2 py-0.5 bg-blue-50 rounded-md text-xs font-semibold text-blue-600">Recent</span>
                        )}
                      </div>
                      {item.remarks && (
                        <p className="ml-11 text-xs text-gray-400 italic">{item.remarks}</p>
                      )}
                    </div>

                    {/* Desktop layout */}
                    <div className="hidden md:grid grid-cols-12 items-center">
                      <div className="col-span-4 flex items-center gap-3 min-w-0">
                        <div className={`p-2.5 rounded-xl flex-shrink-0 ${isRecent ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"} group-hover:bg-red-600 group-hover:text-white transition-all duration-300`}>
                          <Droplet className="w-4 h-4"/>
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-gray-900 truncate">{item.facility || "Blood Donation Camp"}</p>
                          {item.city && (
                            <p className="text-xs text-gray-400 mt-0.5 truncate flex items-center gap-1">
                              <MapPin size={9}/>{item.city}{item.state && `, ${item.state}`}
                            </p>
                          )}
                          {item.remarks && (
                            <p className="text-xs text-gray-400 mt-0.5 italic truncate">{item.remarks}</p>
                          )}
                        </div>
                      </div>
                      <div className="col-span-3">
                        <p className="text-sm font-semibold text-gray-700">
                          {date.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })}
                        </p>
                        {isRecent && (
                          <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full mt-1 inline-block">Recent</span>
                        )}
                      </div>
                      <div className="col-span-2">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-600 text-white">
                          <Droplet size={9}/>{item.bloodGroup || "N/A"}
                        </span>
                      </div>
                      <div className="col-span-1 text-center">
                        <div className="inline-flex items-center justify-center w-9 h-9 bg-gradient-to-br from-red-500 to-red-700 rounded-full text-white text-sm font-black shadow-sm">
                          {item.quantity || 1}
                        </div>
                      </div>
                      <div className="col-span-2 flex justify-end">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle size={9}/>Completed
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonorDonationHistory;
