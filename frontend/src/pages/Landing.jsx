import {
  ArrowRight,
  Heart,
  Users,
  MapPin,
  Clock,
  Droplets,
  Shield,
  Zap,
  Search,
  Bell,
  Calendar,
  FileText,
  Award,
  CheckCircle,
  Target,
  Activity,
  RefreshCw,
  AlertTriangle,
  Stethoscope,
} from "lucide-react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const LandingPage = () => {
const features = [
  {
    icon: Users,
    title: "Centralized Management",
    description:
      "Manage donors, hospitals, blood banks, and administrators from a single unified platform.",
  },
  {
    icon: Droplets,
    title: "Real-Time Blood Inventory",
    description:
      "Track blood availability, monitor inventory levels, and reduce shortages with up-to-date information.",
  },
  {
    icon: Zap,
    title: "Emergency Request System",
    description:
      "Enable faster response times through efficient blood request management and streamlined coordination.",
  },
];

const processSteps = [
  {
    step: "01",
    icon: Users,
    title: "Create an Account",
    description:
      "Register securely as a donor or healthcare facility.",
  },
  {
    step: "02",
    icon: FileText,
    title: "Manage Requests",
    description:
      "Submit blood requests, register donations, or update inventory.",
  },
  {
    step: "03",
    icon: Search,
    title: "Smart Matching",
    description:
      "VitalBridge matches compatible donors, blood banks, and healthcare facilities.",
  },
  {
    step: "04",
    icon: Heart,
    title: "Save Lives",
    description:
      "Complete donations and fulfill requests through a streamlined workflow.",
  },
];

  const eligibilityInfo = [
    {
      icon: CheckCircle,
      title: "Who Can Donate",
      items: [
        "Age 17-75 (16 with parental consent)",
        "Weight at least 110 lbs (50 kg)",
        "Good general health",
        "No flu or cold symptoms",
      ],
    },
    {
      icon: Stethoscope,
      title: "Health Benefits",
      items: [
        "Free health screening",
        "Burns 650 calories per donation",
        "Reduces risk of heart disease",
        "Stimulates blood cell production",
      ],
    },
    {
      icon: Shield,
      title: "Safety First",
      items: [
        "Sterile, disposable equipment",
        "Trained medical staff",
        "Comfortable environment",
        "Post-donation care",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-red-50 mt-10">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-red-700 to-red-900 text-white">
        <div className="absolute inset-0 opacity-20"></div>
        <div className="container mx-auto px-4 py-20 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-white text-sm font-medium mb-6 backdrop-blur-sm">
              <Heart className="w-4 h-4" />
              Saving Lives Every Day
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Bridging{" "}
              <span className="bg-gradient-to-r from-red-200 to-red-300 bg-clip-text text-transparent">
                Blood Donors
              </span>{" "}
              with Every Life That Needs Them
            </h1>

            <p className="text-lg md:text-xl text-red-100 mb-8 max-w-2xl mx-auto">
              VitalBridge is a modern platform that simplifies blood donation, inventory management, and hospital requests through one secure, connected system.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <button className="inline-flex items-center justify-center px-6 py-3 text-lg font-medium rounded-xl bg-white text-red-700 hover:bg-red-50 transition-all duration-300 shadow-lg hover:shadow-xl">
                  Get Started <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </Link>
              <Link to="#about">
                <button className="inline-flex items-center justify-center px-6 py-3 text-lg font-medium rounded-xl border-2 border-white text-white hover:bg-white/10 transition-all duration-300">
                  Learn More
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg
            className="relative block w-full h-16"
            viewBox="0 0 1200 150"
            preserveAspectRatio="none"
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V150H0V90.83C36.67,85.19,76.33,76,112,69.33C160.67,59.67,224.67,47.33,321.39,56.44Z"
              className="fill-slate-50"
            ></path>
          </svg>
        </div>
      </section>

 

{/* How It Works Section */}
<section className="py-20 bg-slate-50">
  <div className="container mx-auto px-4">
    <div className="max-w-3xl mx-auto text-center mb-16">
      <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">
        How VitalBridge Works
      </h2>

      <p className="text-lg text-slate-600">
        A streamlined workflow connecting donors, healthcare facilities, and
        blood banks through one secure platform.
      </p>
    </div>

    <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
      {processSteps.map((step, index) => {
        const Icon = step.icon;

        return (
          <div key={index} className="group">
            <div className="bg-white rounded-2xl shadow-lg p-6 h-full border-t-4 border-red-500 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm font-semibold text-red-500">
                  Step {index + 1}
                </span>

                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-red-600" />
                </div>
              </div>

              <h3 className="text-xl font-semibold text-slate-800 mb-3">
                {step.title}
              </h3>

              <p className="text-slate-600 leading-relaxed text-sm">
                {step.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  </div>
</section>

      {/* About Section */}
      <section id="about" className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">
              Why Choose VitalBridge?
            </h2>

            <p className="text-lg text-slate-600">
              VitalBridge streamlines blood donation, inventory management, and emergency
              requests through a secure and centralized platform for donors, hospitals,
              and blood banks.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-all duration-300 border-t-4 border-red-500"
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                    <Icon className="w-8 h-8 text-red-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-slate-800">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Security Section */}
<section className="py-20 bg-white">
  <div className="container mx-auto px-4">
    <div className="flex flex-col md:flex-row items-center gap-10 max-w-5xl mx-auto">
      <div className="flex-1">
        <div className="w-16 h-16 rounded-xl bg-red-100 flex items-center justify-center mb-6">
          <Shield className="w-8 h-8 text-red-600" />
        </div>

        <h2 className="text-3xl font-bold text-slate-800 mb-4">
          Secure & Reliable
        </h2>

        <p className="text-slate-600 mb-6">
          VitalBridge is designed with security and reliability in mind,
          providing authenticated access, role-based functionality, and
          centralized management for donors, hospitals, and blood banks.
        </p>

        <ul className="space-y-3">
          <li className="flex items-center text-slate-600">
            <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
            Secure user authentication
          </li>

          <li className="flex items-center text-slate-600">
            <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
            Role-based access for different users
          </li>

          <li className="flex items-center text-slate-600">
            <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
            Centralized donor and inventory management
          </li>
        </ul>
      </div>

      <div className="flex-1 bg-red-50 rounded-2xl p-8 border border-red-100">
        <div className="aspect-video bg-gradient-to-br from-red-100 to-red-200 rounded-xl flex items-center justify-center">
          <div className="text-center p-4">
            <Shield className="w-12 h-12 text-red-500 mx-auto mb-4" />

            <p className="text-red-700 font-semibold text-lg">
              Secure Platform
            </p>

            <p className="text-sm text-red-600 mt-2">
              Authentication • Inventory • Requests
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

      {/* CTA Section */}
<section className="py-20 bg-gradient-to-br from-red-700 to-red-900 text-white relative overflow-hidden">
  <div className="absolute inset-0 opacity-20"></div>

  <div className="container mx-auto px-4 text-center relative z-10">
    <h2 className="text-3xl md:text-4xl font-bold mb-6">
      Get Started with VitalBridge
    </h2>

    <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
      Experience a modern blood bank management platform designed to simplify
      donor management, blood inventory, and emergency request coordination.
    </p>

    <Link to="/auth">
      <button className="inline-flex items-center justify-center px-6 py-3 text-lg font-medium rounded-xl bg-white text-red-700 hover:bg-red-50 transition-all duration-300 shadow-lg hover:shadow-xl">
        Launch Platform
        <ArrowRight className="w-4 h-4 ml-2" />
      </button>
    </Link>
  </div>
</section>
      <Footer />
    </div>
  );
};

export default LandingPage;
