import Bestsellers from "../components/bestseller";
import Featured from "../components/featured";
import HeroSection from "../components/herosection";
import NewArrivals from "../components/newarrivals";
import Footer from "../layout/footer";
import Navbar from "../layout/navbar";

export const Home = () => {
  return (
    <>
      <Navbar />
      <HeroSection />
      <NewArrivals />
      <Bestsellers />
      <Featured />
      <Footer />
    </>
  );
};

export default Home;
