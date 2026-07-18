import Navbar from "../../components/main/Navbar";
import {
  MdArrowForward,
  MdCheckCircle,
  MdStar,
  MdSearch,
  MdChevronRight,
} from "react-icons/md";
import Footer from "../../components/main/footer";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Landingpage() {
  const navigate = useNavigate();
  const [roleTab, setRoleTab] = useState("hire"); // hire or work
  const [searchVal, setSearchVal] = useState("");
  const [pricingInput, setPricingInput] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/login?search=${encodeURIComponent(searchVal)}`);
    } else {
      navigate("/login");
    }
  };

  return (
    <>
      <div className="bg-white min-h-screen text-left font-sans antialiased text-gray-800">
        <Navbar />

        {/* Top Alert Banner */}
        <div className="max-w-[1440px] mx-auto px-6 md:px-16 lg:px-24 mt-6">
          <div className="bg-green-50 border border-green-200/50 rounded-2xl p-5 flex items-center justify-between gap-4 transition-all hover:shadow-sm">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 bg-green-600 rounded-full animate-pulse" />
              <p className="text-base font-semibold text-green-900">
                Stop doing everything. Hire the top 1% of talent on QuickWork Business Plus.
              </p>
            </div>
            <Link
              to="/pre"
              className="text-base font-semibold text-green-700 hover:text-green-800 flex items-center gap-1 group"
            >
              <span>Get started</span>
              <MdChevronRight className="text-xl group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Hero Section */}
        <div className="max-w-[1440px] mx-auto px-6 md:px-16 lg:px-24 py-12">
          <div className="relative rounded-[32px] overflow-hidden bg-zinc-950 text-white min-h-[640px] flex items-center p-8 sm:p-12 md:p-20 shadow-2xl">
            {/* Background pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-teal-955 via-zinc-900/95 to-zinc-950 z-0" />
            <div className="absolute right-0 bottom-0 top-0 w-full md:w-1/2 opacity-25 md:opacity-45 z-0 bg-cover bg-center pointer-events-none" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80')` }} />

            <div className="relative z-10 max-w-3xl flex flex-col justify-center">
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-6">
                Work at the speed <br />
                of your ambition
              </h1>
              <p className="text-xl md:text-2xl text-zinc-300 mb-10 font-light leading-relaxed max-w-2xl">
                Hire experts who use AI to amplify their talent, turning complex work into high impact business outcomes.
              </p>

              {/* Toggle tabs */}
              <div className="flex bg-zinc-900/90 p-1.5 rounded-full self-start mb-8 border border-zinc-800">
                <button
                  onClick={() => setRoleTab("hire")}
                  className={`px-8 py-3 rounded-full text-base font-semibold transition-all cursor-pointer ${
                    roleTab === "hire"
                      ? "bg-white text-zinc-950 shadow-md"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  I want to hire
                </button>
                <button
                  onClick={() => setRoleTab("work")}
                  className={`px-8 py-3 rounded-full text-base font-semibold transition-all cursor-pointer ${
                    roleTab === "work"
                      ? "bg-white text-zinc-950 shadow-md"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  I want to work
                </button>
              </div>

              {/* Search form */}
              <form onSubmit={handleSearch} className="flex items-center bg-white rounded-full p-2.5 border border-zinc-700 max-w-2xl shadow-xl mb-8 w-full">
                <input
                  type="text"
                  placeholder="Describe what you need to hire for..."
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  className="bg-transparent text-gray-900 placeholder-gray-500 pl-5 w-full outline-none text-base font-normal"
                />
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-zinc-950 hover:bg-zinc-800 text-white font-semibold px-8 py-3.5 rounded-full transition-colors cursor-pointer text-base"
                >
                  <MdSearch className="text-xl" />
                  <span>Search</span>
                </button>
              </form>

              {/* Popular tags */}
              <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-400">
                <span className="font-semibold">Popular:</span>
                {["Web design", "AI development", "Video editing", "Google Ads"].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      setSearchVal(tag);
                    }}
                    className="border border-zinc-800 hover:border-zinc-550 text-zinc-300 hover:text-white px-4 py-1.5 rounded-full transition-colors cursor-pointer font-normal bg-zinc-900/50"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Trusted By logo block */}
        <div className="bg-gray-50 py-12 border-y border-gray-100 mt-8">
          <div className="max-w-[1440px] mx-auto px-6 md:px-16 lg:px-24 text-center">
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-8">
              TRUSTED BY 800,000+ CLIENTS WORLDWIDE
            </p>
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-60 grayscale hover:grayscale-0 transition-all duration-300">
              <span className="text-xl font-bold font-serif text-gray-700">airbnb</span>
              <span className="text-xl font-bold text-gray-700 tracking-tighter">DATABRICKS</span>
              <span className="text-xl font-extrabold text-gray-700">CLOUDFLARE</span>
              <span className="text-xl font-semibold text-gray-700 font-mono">Microsoft</span>
              <span className="text-xl font-semibold text-gray-700">grammarly</span>
              <span className="text-xl font-semibold text-gray-700">bambooHR</span>
              <span className="text-xl font-bold text-gray-700">shutterstock</span>
            </div>
          </div>
        </div>

        {/* Core Steps / Features Section */}
        <div className="max-w-[1440px] mx-auto px-6 md:px-16 lg:px-24 py-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
            <div className="flex flex-col p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:shadow-md transition-all">
              <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600 mb-8 mx-auto md:mx-0">
                <MdStar className="text-3xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Posting jobs is always free</h3>
              <p className="text-base text-gray-500 leading-relaxed font-light">
                Post detailed descriptions, set your budget range, and wait for proposals from vetted freelancers worldwide.
              </p>
            </div>

            <div className="flex flex-col p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:shadow-md transition-all">
              <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600 mb-8 mx-auto md:mx-0">
                <MdCheckCircle className="text-3xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Get proposals and hire</h3>
              <p className="text-base text-gray-500 leading-relaxed font-light">
                Review portfolios, compare work history, conduct real-time interviews, and choose the perfect fit in hours.
              </p>
            </div>

            <div className="flex flex-col p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:shadow-md transition-all">
              <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600 mb-8 mx-auto md:mx-0">
                <span className="text-2xl font-bold">₹</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Pay when work is done</h3>
              <p className="text-base text-gray-500 leading-relaxed font-light">
                Deposited funds stay securely locked in QW Wallet milestones, released only when you approve the finished work.
              </p>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="max-w-[1440px] mx-auto px-6 md:px-16 lg:px-24 pb-24">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 mb-4">
              Hear from the professionals who use QuickWork
            </h2>
            <p className="text-gray-500 text-xl font-light">
              See how businesses scale their development and design teams, and how freelancers grow their careers.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white border border-gray-200 p-8 rounded-3xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex gap-1 mb-5 text-yellow-400">
                  <MdStar className="text-2xl" />
                  <MdStar className="text-2xl" />
                  <MdStar className="text-2xl" />
                  <MdStar className="text-2xl" />
                  <MdStar className="text-2xl" />
                </div>
                <p className="text-gray-600 italic text-base md:text-lg leading-relaxed mb-8">
                  "QuickWork allowed us to scale our engineering team by 3x within a single month. The search system matched us with perfect React and Node developers instantly."
                </p>
              </div>
              <div className="flex items-center gap-4">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="Sarah Jenkins"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-bold text-gray-905 text-base">Sarah Jenkins</h4>
                  <p className="text-sm text-gray-500">VP of Engineering at Databricks</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white border border-gray-200 p-8 rounded-3xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex gap-1 mb-5 text-yellow-400">
                  <MdStar className="text-2xl" />
                  <MdStar className="text-2xl" />
                  <MdStar className="text-2xl" />
                  <MdStar className="text-2xl" />
                  <MdStar className="text-2xl" />
                </div>
                <p className="text-gray-600 italic text-base md:text-lg leading-relaxed mb-8">
                  "As a freelance designer, I've tried every marketplace. QuickWork protects my payouts through milestones and holds the lowest platform commission fees."
                </p>
              </div>
              <div className="flex items-center gap-4">
                <img
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="Alex Rivera"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-bold text-gray-905 text-base">Alex Rivera</h4>
                  <p className="text-sm text-gray-500">Senior Brand Designer</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white border border-gray-200 p-8 rounded-3xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex gap-1 mb-5 text-yellow-400">
                  <MdStar className="text-2xl" />
                  <MdStar className="text-2xl" />
                  <MdStar className="text-2xl" />
                  <MdStar className="text-2xl" />
                  <MdStar className="text-2xl" />
                </div>
                <p className="text-gray-600 italic text-base md:text-lg leading-relaxed mb-8">
                  "Milestone-based payment protection gives us complete peace of mind. We deposited funds to QW Wallet and approved payouts only when targets were met."
                </p>
              </div>
              <div className="flex items-center gap-4">
                <img
                  src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="Liam Zhao"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-bold text-gray-905 text-base">Liam Zhao</h4>
                  <p className="text-sm text-gray-500">Co-founder of Scale AI</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Calculator / Insights Card */}
        <div className="max-w-[1440px] mx-auto px-6 md:px-16 lg:px-24 pb-24 animate-fadeIn">">
          <div className="grid grid-cols-1 md:grid-cols-2 bg-zinc-900 rounded-[32px] overflow-hidden shadow-2xl">
            {/* Left Column Form */}
            <div className="p-8 sm:p-12 md:p-20 flex flex-col justify-center text-white border-r border-zinc-800">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Get insights into freelancer pricing
              </h2>
              <p className="text-zinc-400 mb-10 text-base md:text-lg font-light leading-relaxed">
                We'll calculate the average hourly rate and fixed project pricing details for professional freelancers with the exact skills you need.
              </p>
              
              <div className="bg-white rounded-2xl p-5 shadow-inner max-w-lg">
                <p className="text-xs text-gray-400 mb-3 font-semibold tracking-wider">TO START, DESCRIBE WHAT WORK YOU NEED DONE</p>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    placeholder="e.g. React Developer, UI Designer..."
                    value={pricingInput}
                    onChange={(e) => setPricingInput(e.target.value)}
                    className="w-full bg-transparent text-gray-900 placeholder-gray-400 outline-none text-base font-semibold"
                  />
                  <button
                    onClick={() => navigate(`/login?search=${encodeURIComponent(pricingInput)}`)}
                    className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors cursor-pointer flex-shrink-0"
                  >
                    <span>Next</span>
                    <MdChevronRight className="text-xl" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column Rotating Atom Visual */}
            <div className="bg-zinc-950/85 p-12 md:p-24 flex items-center justify-center min-h-[400px]">
              <div className="relative w-56 h-56 flex items-center justify-center">
                {/* Glowing Core */}
                <div className="absolute w-10 h-10 rounded-full bg-green-400 blur-md opacity-75 animate-ping" />
                <div className="absolute w-8 h-8 rounded-full bg-green-500 shadow-[0_0_20px_#22c55e]" />

                {/* Orbiting Paths */}
                <div className="absolute inset-0 border-2 border-green-500/25 rounded-full transform rotate-45 scale-y-[0.3] animate-[spin_6s_linear_infinite]" />
                <div className="absolute inset-0 border-2 border-green-500/25 rounded-full transform -rotate-45 scale-y-[0.3] animate-[spin_8s_linear_infinite]" />
                <div className="absolute inset-0 border-2 border-green-500/25 rounded-full transform rotate-90 scale-x-[0.3] animate-[spin_7s_linear_infinite]" />
                <div className="absolute inset-0 border-2 border-green-500/25 rounded-full transform -rotate-90 scale-x-[0.3] animate-[spin_9s_linear_infinite]" />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}
