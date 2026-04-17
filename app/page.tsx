import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";
import QuickAccessGrid from "@/components/QuickAccessGrid";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen font-sans selection:bg-[#1E88E5]/20">
      <Header />

      {/* MAIN CONTENT */}
      <main className="flex-grow flex flex-col items-center pt-24 pb-16 px-6">
        
        {/* Hero Section */}
        <div className="text-center w-full max-w-3xl flex flex-col items-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
            Your Reliable Path to <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1E88E5] to-[#42A5F5]">
               Medical Knowledge.
            </span>
          </h1>
          <p className="text-lg text-slate-500 mb-12 max-w-xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
            Access organized, verified, and ranked information on diseases, symptoms, and treatments instantly.
          </p>

          {/* Search Bar */}
          <div className="mb-16 w-full flex justify-center">
            <SearchBar />
          </div>
        </div>

        {/* Quick Access Grid */}
        <QuickAccessGrid />
        
      </main>

      <Footer />
    </div>
  );
}
