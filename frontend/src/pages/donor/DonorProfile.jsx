import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import {
  Loader2, Save, Edit3, X, MapPin, Mail, Phone,
  User, Heart, Droplet, Calendar, Award, Clock,
  AlertCircle, CheckCircle, RefreshCw, Shield,
} from "lucide-react";

const API_BASE_URL = "/api";
const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];

const SectionHeading = ({ icon, eyebrow, title }) => (
  <div className="mb-5">
    <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">{eyebrow}</p>
    <div className="flex items-center gap-2.5">
      <div className="p-1.5 bg-red-50 rounded-lg text-red-600 flex-shrink-0">{icon}</div>
      <h2 className="text-xl font-bold text-gray-900">{title}</h2>
    </div>
  </div>
);

const FieldLabel = ({ children }) => (
  <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-1.5">
    {children}
  </label>
);

const iB = "w-full px-4 py-2.5 rounded-xl border-2 text-sm text-gray-800 transition-all duration-200 outline-none";
const iE = "border-gray-200 bg-white focus:border-red-500 focus:ring-2 focus:ring-red-100";
const iD = "border-gray-100 bg-gray-50 text-gray-600 cursor-default";

const FormInput = ({ isEditing, error, ...props }) => (
  <div>
    <input {...props} disabled={!isEditing}
      className={`${iB} ${isEditing ? iE : iD} ${error ? "border-red-400" : ""}`} />
    {error && <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1"><AlertCircle size={11}/>{error}</p>}
  </div>
);

const FormSelect = ({ isEditing, error, children, ...props }) => (
  <div>
    <select {...props} disabled={!isEditing}
      className={`${iB} ${isEditing ? iE : iD} ${error ? "border-red-400" : ""}`}>
      {children}
    </select>
    {error && <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1"><AlertCircle size={11}/>{error}</p>}
  </div>
);

const StatusBadge = ({ status }) => {
  const map = {
    active: "bg-emerald-50 text-emerald-700 border-emerald-200",
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    inactive: "bg-red-50 text-red-700 border-red-200",
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${map[status] || map.inactive}`}>
      {status === "active" ? <CheckCircle size={10}/> : <Clock size={10}/>}
      {status?.charAt(0).toUpperCase() + status?.slice(1)}
    </span>
  );
};

const DonorProfile = () => {
  const [donor, setDonor] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "", phone: "", age: "", gender: "", weight: "", bloodGroup: "",
    address: { street: "", city: "", state: "", pincode: "" }, password: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const validationRules = {
    fullName: { required: true, minLength: 2, maxLength: 50 },
    phone: { required: true, pattern: /^[0-9]{10}$/ },
    age: { required: true, min: 18, max: 65 },
    gender: { required: true },
    weight: { required: true, min: 45, max: 200 },
    bloodGroup: { required: true },
    "address.street": { required: true, minLength: 5 },
    "address.city": { required: true, minLength: 2 },
    "address.state": { required: true, minLength: 2 },
    "address.pincode": { required: true, pattern: /^[0-9]{6}$/ },
    password: { minLength: 6 },
  };

  const validateField = (name, value) => {
    const r = validationRules[name];
    if (!r) return null;
    if (r.required && !value) return "This field is required";
    if (r.minLength && value.length < r.minLength) return `Minimum ${r.minLength} characters required`;
    if (r.maxLength && value.length > r.maxLength) return `Maximum ${r.maxLength} characters allowed`;
    if (r.min && Number(value) < r.min) return `Minimum value is ${r.min}`;
    if (r.max && Number(value) > r.max) return `Maximum value is ${r.max}`;
    if (r.pattern && !r.pattern.test(value)) return "Invalid format";
    return null;
  };

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authorization token found.");
      const { data } = await axios.get(`${API_BASE_URL}/donor/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const lastDonationDate = data.donor.lastDonationDate || data.donor.lastDonation;
      if (data.donor) {
        setFormData({
          fullName: data.donor.fullName || "", phone: data.donor.phone || "",
          age: data.donor.age || "", gender: data.donor.gender || "",
          weight: data.donor.weight || "", bloodGroup: data.donor.bloodGroup || "",
          address: {
            street: data.donor.address?.street || "", city: data.donor.address?.city || "",
            state: data.donor.address?.state || "", pincode: data.donor.address?.pincode || "",
          }, password: "",
        });
        setDonor({
          ...data.donor, lastDonation: lastDonationDate,
          status: data.donor.status || "active", donorId: data.donor._id,
        });
      } else { throw new Error(data.message); }
    } catch (error) {
      console.error("Fetch Donor Profile Error:", error);
      if (error.message.includes("No authorization token found") || error.response?.status === 401) {
        localStorage.removeItem("token"); setDonor(null);
        toast.error("Session expired or unauthorized. Please log in."); return;
      }
      toast.error(error.response?.data?.message || "Failed to load profile");
      setDonor(null);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({ ...prev, address: { ...prev.address, [key]: value } }));
    } else { setFormData((prev) => ({ ...prev, [name]: value })); }
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSave = async () => {
    const newErrors = {};
    Object.keys(validationRules).forEach((key) => {
      if (key === "password" && !formData.password) return;
      let value = key.startsWith("address.") ? formData.address[key.split(".")[1]] : formData[key];
      const error = validateField(key, value);
      if (error) newErrors[key] = error;
    });
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors); toast.error("Please fix validation errors before saving"); return;
    }
    try {
      setSaving(true);
      const token = localStorage.getItem("token");
      if (!token) { toast.error("Authentication required."); setSaving(false); return; }
      const payload = {
        fullName: formData.fullName.trim(), phone: formData.phone.trim(),
        age: Number(formData.age), gender: formData.gender, weight: Number(formData.weight),
        bloodGroup: formData.bloodGroup,
        address: {
          street: formData.address.street.trim(), city: formData.address.city.trim(),
          state: formData.address.state.trim(), pincode: formData.address.pincode.trim(),
        },
      };
      if (formData.password && formData.password.length >= 6) payload.password = formData.password;
      const { data } = await axios.put(`${API_BASE_URL}/donor/profile`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        toast.success("Profile updated successfully!");
        setDonor(data.donor); setIsEditing(false); setErrors({});
        setFormData((prev) => ({ ...prev, password: "" }));
      } else { throw new Error(data.message); }
    } catch (error) {
      if (error.response?.data?.errors) setErrors(error.response.data.errors);
    } finally { setSaving(false); }
  };

  const handleCancel = () => {
    setIsEditing(false); setErrors({});
    if (donor) {
      setFormData({
        fullName: donor.fullName || "", phone: donor.phone || "",
        age: donor.age || "", gender: donor.gender || "",
        weight: donor.weight || "", bloodGroup: donor.bloodGroup || "",
        address: {
          street: donor.address?.street || "", city: donor.address?.city || "",
          state: donor.address?.state || "", pincode: donor.address?.pincode || "",
        }, password: "",
      });
    }
  };

  if (loading && !donor) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center">
          <div className="relative inline-flex items-center justify-center mb-6">
            <div className="absolute inset-0 rounded-full bg-red-100 animate-ping opacity-60"/>
            <div className="relative p-5 bg-gradient-to-br from-red-600 to-red-800 rounded-2xl shadow-xl">
              <User className="w-10 h-10 text-white"/>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Your Profile</h2>
          <p className="text-gray-500 text-sm">Preparing your donor information…</p>
        </div>
      </div>
    );
  }

  if (!donor) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center bg-white rounded-3xl shadow-xl border border-gray-100 p-10 max-w-sm w-full">
          <div className="inline-flex p-4 bg-red-50 rounded-2xl mb-5">
            <Heart className="w-12 h-12 text-red-500"/>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Profile Unavailable</h3>
          <p className="text-gray-500 text-sm mb-6">Could not load your profile. Please ensure you are logged in.</p>
          <button onClick={fetchProfile}
            className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4"/>Retry Loading
          </button>
        </div>
      </div>
    );
  }

  const isEligible = donor.eligibleToDonate || false;
  const hasErrors = Object.keys(errors).length > 0;
  const achLevel = (donor.donationHistory?.length || 0) >= 10 ? "Gold"
    : (donor.donationHistory?.length || 0) >= 5 ? "Silver" : "Bronze";
  const achColors = {
    Gold: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
    Silver: { bg: "bg-slate-50", text: "text-slate-600", border: "border-slate-200" },
    Bronze: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
  };
  const aStyle = achColors[achLevel];

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-16 lg:pb-8">
      <Toaster/>
      <div className="max-w-7xl mx-auto px-1 py-6">

        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-gradient-to-br from-red-600 to-red-800 rounded-2xl shadow-lg shadow-red-200">
              <User className="w-8 h-8 text-white"/>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-red-500 mb-0.5">
                VitalBridge · Donor Portal
              </p>
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 leading-none">My Profile</h1>
              <p className="text-sm text-gray-500 mt-1">View and manage your personal information.</p>
            </div>
          </div>
          <div className="flex gap-3">
            {isEditing ? (
              <>
                <button onClick={handleCancel}
                  className="flex items-center gap-2 px-5 py-2.5 border-2 border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 text-sm font-semibold">
                  <X size={16}/>Cancel
                </button>
                <button onClick={handleSave} disabled={saving || hasErrors}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin"/> : <Save size={16}/>}
                  Save Changes
                </button>
              </>
            ) : (
              <button onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-sm font-semibold">
                <Edit3 size={16}/>Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Donor Identity Card */}
        <div className="mb-8">
          <div className="relative bg-white rounded-2xl border border-gray-100 p-6 shadow-sm overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-red-500 to-red-700"/>
            <div className="flex flex-col sm:flex-row sm:items-center gap-5">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center flex-shrink-0 shadow-md shadow-red-200">
                <span className="text-3xl font-black text-white">
                  {(donor.fullName || "D").split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-extrabold text-gray-900 mb-0.5">{donor.fullName || "Donor"}</h2>
                <p className="text-sm text-gray-400 mb-3 font-mono">ID: {donor.donorId}</p>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-600 text-white border border-red-700 shadow-sm">
                    <Droplet size={10}/>{donor.bloodGroup || "Unknown"}
                  </span>
                  <StatusBadge status={donor.status}/>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${isEligible ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}>
                    {isEligible ? <CheckCircle size={10}/> : <Clock size={10}/>}
                    {isEligible ? "Eligible to Donate" : "Not Currently Eligible"}
                  </span>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${aStyle.bg} ${aStyle.text} ${aStyle.border}`}>
                    <Award size={10}/>{achLevel} Donor
                  </span>
                </div>
              </div>
              <div className="flex gap-6 sm:gap-8 flex-shrink-0">
                <div className="text-center">
                  <p className="text-2xl font-black text-gray-900">{donor.donationHistory?.length || 0}</p>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mt-0.5">Donations</p>
                </div>
                {donor.lastDonation && (
                  <div className="text-center">
                    <p className="text-sm font-bold text-gray-900">
                      {new Date(donor.lastDonation).toLocaleDateString([], { month: "short", year: "numeric" })}
                    </p>
                    <p className="text-xs text-gray-400 uppercase tracking-wide mt-0.5">Last Donation</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="space-y-6">
            <div>
              <SectionHeading eyebrow="Contact" icon={<Mail className="w-4 h-4"/>} title="Contact Info"/>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
                {[
                  { icon: <Mail className="w-4 h-4"/>, label: "Email", value: donor.email },
                  donor.phone && { icon: <Phone className="w-4 h-4"/>, label: "Phone", value: donor.phone },
                  donor.age && { icon: <Calendar className="w-4 h-4"/>, label: "Age", value: `${donor.age} years old` },
                  donor.address?.city && { icon: <MapPin className="w-4 h-4"/>, label: "Location", value: `${donor.address.city}, ${donor.address.state}` },
                ].filter(Boolean).map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="p-2 bg-red-50 rounded-xl text-red-600 flex-shrink-0 mt-0.5">{item.icon}</div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-0.5">{item.label}</p>
                      <p className="text-sm font-semibold text-gray-900 truncate">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <SectionHeading eyebrow="Account" icon={<Shield className="w-4 h-4"/>} title="Donor Status"/>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-1">
                {[
                  { label: "Account Status", el: <StatusBadge status={donor.status}/> },
                  { label: "Blood Group", el: <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-600 text-white"><Droplet size={10}/>{donor.bloodGroup || "N/A"}</span> },
                  { label: "Eligibility", el: <span className={`text-xs font-semibold ${isEligible ? "text-emerald-600" : "text-amber-600"}`}>{isEligible ? "Ready to Donate" : "Not Eligible"}</span> },
                  donor.lastDonation && { label: "Last Donation", el: <span className="text-sm text-gray-800 font-medium">{new Date(donor.lastDonation).toLocaleDateString()}</span> },
                  { label: "Member Since", el: <span className="text-sm text-gray-800 font-medium">{donor.createdAt ? new Date(donor.createdAt).getFullYear() : "N/A"}</span> },
                ].filter(Boolean).map((row, i, arr) => (
                  <div key={i} className={`flex items-center justify-between py-2.5 ${i < arr.length - 1 ? "border-b border-gray-50" : ""}`}>
                    <span className="text-sm text-gray-500">{row.label}</span>
                    {row.el}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main form */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <SectionHeading eyebrow="Personal details" icon={<User className="w-4 h-4"/>} title="Personal Information"/>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div><FieldLabel>Full Name</FieldLabel><FormInput type="text" name="fullName" value={formData.fullName} onChange={handleChange} isEditing={isEditing} error={errors.fullName} placeholder="Enter your full name"/></div>
                  <div><FieldLabel>Phone Number</FieldLabel><FormInput type="tel" name="phone" value={formData.phone} onChange={handleChange} isEditing={isEditing} error={errors.phone} placeholder="10-digit phone number"/></div>
                  <div><FieldLabel>Age</FieldLabel><FormInput type="number" name="age" value={formData.age} onChange={handleChange} isEditing={isEditing} error={errors.age} min="18" max="65" placeholder="Age (18–65)"/></div>
                  <div>
                    <FieldLabel>Gender</FieldLabel>
                    <FormSelect name="gender" value={formData.gender} onChange={handleChange} isEditing={isEditing} error={errors.gender}>
                      <option value="">Select Gender</option>
                      {GENDER_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </FormSelect>
                  </div>
                  <div><FieldLabel>Weight (kg)</FieldLabel><FormInput type="number" name="weight" value={formData.weight} onChange={handleChange} isEditing={isEditing} error={errors.weight} min="45" max="200" step="0.1" placeholder="Weight in kg (min. 45)"/></div>
                  <div>
                    <FieldLabel>Blood Group</FieldLabel>
                    <FormSelect name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} isEditing={isEditing} error={errors.bloodGroup}>
                      <option value="">Select Blood Group</option>
                      {BLOOD_GROUPS.map((g) => <option key={g} value={g}>{g}</option>)}
                    </FormSelect>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <SectionHeading eyebrow="Location" icon={<MapPin className="w-4 h-4"/>} title="Address Information"/>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2"><FieldLabel>Street Address</FieldLabel><FormInput type="text" name="address.street" value={formData.address?.street || ""} onChange={handleChange} isEditing={isEditing} error={errors["address.street"]} placeholder="Enter street address"/></div>
                  <div><FieldLabel>City</FieldLabel><FormInput type="text" name="address.city" value={formData.address?.city || ""} onChange={handleChange} isEditing={isEditing} error={errors["address.city"]} placeholder="Enter city"/></div>
                  <div><FieldLabel>State</FieldLabel><FormInput type="text" name="address.state" value={formData.address?.state || ""} onChange={handleChange} isEditing={isEditing} error={errors["address.state"]} placeholder="Enter state"/></div>
                  <div><FieldLabel>PIN Code</FieldLabel><FormInput type="number" name="address.pincode" value={formData.address?.pincode || ""} onChange={handleChange} isEditing={isEditing} error={errors["address.pincode"]} placeholder="6-digit PIN code"/></div>
                </div>
              </div>
            </div>

            <div>
              <SectionHeading eyebrow="Account" icon={<Mail className="w-4 h-4"/>} title="Email Address"/>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <FieldLabel>Email (cannot be changed)</FieldLabel>
                <input type="email" value={donor.email} disabled className={`${iB} ${iD}`}/>
                <p className="text-xs text-gray-400 mt-2">Contact support to update your email address.</p>
              </div>
            </div>

            {isEditing && (
              <div>
                <SectionHeading eyebrow="Security" icon={<Shield className="w-4 h-4"/>} title="Change Password"/>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <div className="max-w-md">
                    <FieldLabel>New Password (optional)</FieldLabel>
                    <FormInput type="password" name="password" value={formData.password} onChange={handleChange} isEditing={isEditing} error={errors.password} placeholder="Min. 6 characters"/>
                    <p className="text-xs text-gray-400 mt-2">Leave blank to keep your current password.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonorProfile;
