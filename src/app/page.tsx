import TopBar from "@/components/home/TopBar";
import Header from "@/components/home/Header";
import Hero from "@/components/home/Hero";
import Brands from "@/components/home/Brands";
import Featured from "@/components/home/Featured";

function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-50 via-white to-zinc-100 text-zinc-900">
      <TopBar />
      <Header />
      <Hero />
      <Brands />
      <Featured />
    </main>
  );
}

export default Home;
