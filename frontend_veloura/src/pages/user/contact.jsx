import React, { useState } from 'react';
import { MapPin, Phone, Clock, Mail, Send } from 'lucide-react';

import Navbar from '../../layout/navbar';
import Footer from '../../layout/footer';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <>
      <Navbar />

      {/* Contact Us Section */}
      <main className="px-12 py-16 max-w-screen-xl mx-auto font-poppins">
        <h2 className="text-3xl font-semibold text-center mb-6">Get In Touch With Us</h2>
        <p className="text-center text-gray-600 mb-14 max-w-2xl mx-auto">
          For more information about our jewelry collections or services, feel free to reach out. 
          We're here to assist you with care and elegance — just like our designs.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Contact Information */}
          <div className="space-y-8 pl-40 ">
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-gray-100 rounded-full">
                <MapPin className="w-5 h-5 text-gray-700" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Address</h3>
                <p className="text-gray-600">
                  Suryabinayak, Bhaktapur,<br />
                  Nepal
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="p-2 bg-gray-100 rounded-full">
                <Phone className="w-5 h-5 text-gray-700" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Phone</h3>
                <p className="text-gray-600">
                  Mobile: +(977) 9860897657<br />
                  Landline: +(01) 6610998
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="p-2 bg-gray-100 rounded-full">
                <Clock className="w-5 h-5 text-gray-700" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Working Time</h3>
                <p className="text-gray-600">
                  Monday-Friday: 9:00am - 8:00pm<br />
                  Saturday-Sunday: 9:00am - 5:00pm
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-300">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Abc"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Abc@def.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="This is optional"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={5}
                  placeholder="Hi! I'd like to ask about..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none"
                />
              </div>

              <button
                onClick={handleSubmit}
                className="w-full bg-black/84 text-white py-3 px-6 rounded-md hover:bg-black/80 transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit</span>
              </button>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-center mb-8">Find Us Here</h3>
          <div className="w-full h-96 bg-gray-200 rounded-lg overflow-hidden shadow-md">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14129.285851034!2d85.42894!3d27.661695!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb193de885cb75%3A0xa6c7fc68b9c6ce60!2sSuryabinayak%2C%20Nepal!5e0!3m2!1sen!2snp!4v1640000000000!5m2!1sen!2snp"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Veloura Location - Suryabinayak, Bhaktapur"
            />
          </div>
          <p className="text-center text-gray-600 mt-4">
            Visit our showroom at Suryabinayak, Bhaktapur to explore our signature jewelry collections handcrafted in Nepal.
          </p>
        </div>

        {/* Additional Contact Information */}
        <div className="bg-gray-50 p-8 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="p-4 bg-white rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center shadow-sm">
                <Mail className="w-8 h-8 text-gray-700" />
              </div>
              <h4 className="font-semibold text-lg mb-2">Email Support</h4>
              <p className="text-gray-600">info@veloura.com</p>
              <p className="text-gray-600">support@veloura.com</p>
            </div>
            
            <div>
              <div className="p-4 bg-white rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center shadow-sm">
                <Phone className="w-8 h-8 text-gray-700" />
              </div>
              <h4 className="font-semibold text-lg mb-2">Customer Service</h4>
              <p className="text-gray-600">Available Mon-Fri</p>
              <p className="text-gray-600">9:00 AM - 8:00 PM</p>
            </div>
            
            <div>
              <div className="p-4 bg-white rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center shadow-sm">
                <MapPin className="w-8 h-8 text-gray-700" />
              </div>
              <h4 className="font-semibold text-lg mb-2">Showroom Visits</h4>
              <p className="text-gray-600">By Appointment</p>
              <p className="text-gray-600">Call us to schedule</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default ContactUs;
