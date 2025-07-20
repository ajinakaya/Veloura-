import Navbar from "../../layout/navbar";
import Footer from "../../layout/footer";
import aboutMain from "../../assets/herocircle3.jpg";
import about1 from "../../assets/circle2.jpeg";
import about2 from "../../assets/circle3.jpeg";
import about3 from "../../assets/circle5.jpeg";
import about4 from "../../assets/circle7.jpeg";

const AboutUs = () => {
  return (
    <>
      <Navbar />

      {/* About Us Section */}
      <main className="px-12 py-16 max-w-screen-xl mx-auto font-poppins">
        <h2 className="text-3xl font-semibold text-center mb-14">About Us</h2>

        {/* Image Grid */}
        <div className="grid grid-cols-4 gap-4 items-center mb-12">
          <div className="col-span-2 rounded-xl overflow-hidden">
            <img
              src={aboutMain}
              alt="Main jewelry image"
              className="w-full h-170 object-cover"
            />
          </div>
          <div className="col-span-2 grid grid-cols-2 gap-4">
            <img
              src={about2}
              alt="Jewelry piece"
              className="rounded-xl object-cover w-full h-full"
            />
            <img
              src={about3}
              alt="Jewelry close-up"
              className="rounded-xl object-cover w-full h-full"
            />
            <img
              src={about1}
              alt="Artisan jewelry"
              className="rounded-xl object-cover w-full h-full"
            />
            <img
              src={about4}
              alt="Crafted piece"
              className="rounded-xl object-cover w-full h-full"
            />
          </div>
        </div>

        {/* Description */}
        <div className="text-[15px] text-gray-800 leading-7 max-w-5xl mx-auto">
          <p className="mb-6">
            Welcome to Veloura – Made in Nepal, where elegance meets tradition in every handcrafted jewelry piece.
            As Nepal’s premier luxury jewelry brand, Veloura is dedicated to celebrating beauty, heritage, and craftsmanship through timeless designs that tell a story.
          </p>
          <p className="mb-6">
            Our passion lies in creating stunning, meaningful pieces that reflect the richness of Nepali culture while embracing
            modern aesthetics. Each item is thoughtfully designed and meticulously crafted by local artisans who pour
            generations of expertise into every detail.
          </p>
          <p className="mb-6">
            At Veloura, we believe jewelry is more than an accessory—it’s an expression of identity, tradition, and emotion.
            That’s why we are committed to producing 100% Made in Nepal pieces, using ethically sourced materials and sustainable practices.
          </p>
          <p>
            Whether you're seeking timeless classics or contemporary treasures, Veloura offers a curated collection that enhances
            your individuality. Join us in redefining Nepali luxury—one exquisite piece at a time. 
            <br />
            Veloura – Made in Nepal. Where heritage shines.
          </p>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default AboutUs;
