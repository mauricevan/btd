import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

export default function Home() {
  const { t } = useLanguage();
  const [videoError, setVideoError] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getVideoPosition = () => {
    if (screenWidth < 480) return 'center 50%';
    if (screenWidth < 768) return 'center 40%';
    if (screenWidth < 1200) return 'center 30%';
    if (screenWidth < 1900) return 'center 25%';
    return 'center center';
  };

  const productCategories = [
    {
      title: "Slimme Sloten",
      description: "Moderne elektronische sloten met NFC, Bluetooth en app-bediening",
      icon: "🔐",
      image: "/images/smart-locks.jpg",
      link: "/products/smart-locks"
    },
    {
      title: "Toegangscontrole",
      description: "Professionele toegangssystemen voor bedrijven en instellingen",
      icon: "🚪",
      image: "/images/access-control.jpg",
      link: "/products/access-control"
    },
    {
      title: "Bedrijfsoplossingen",
      description: "Complete beveiligingssystemen op maat voor uw organisatie",
      icon: "🏢",
      image: "/images/business-solutions.jpg",
      link: "/products/business"
    },
    {
      title: "Hang- en Sluitwerk",
      description: "Traditioneel vakmanschap gecombineerd met moderne technologie",
      icon: "🔑",
      image: "/images/locksmith.jpg",
      link: "/products/locksmith"
    },
    {
      title: "CCTV & Beveiliging",
      description: "Camera-systemen en alarmsystemen voor complete bescherming",
      icon: "📹",
      image: "/images/cctv.jpg",
      link: "/products/cctv"
    },
    {
      title: "Service & Onderhoud",
      description: "24/7 service, onderhoud en spoedreparaties",
      icon: "🛠️",
      image: "/images/service.jpg",
      link: "/service"
    }
  ];

  const handleVideoError = () => {
    setVideoError(true);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section met aspect-ratio */}
      <section className="relative w-full aspect-[16/9] min-h-[350px] max-h-screen overflow-hidden flex items-center justify-center">
        {/* Video Background */}
        {!videoError && (
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            onError={handleVideoError}
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              objectFit: 'cover',
              objectPosition: 'center center',
              width: '100%',
              height: '100%'
            }}
          >
            <source src="/videos/dom.mp4" type="video/mp4" />
            {/* Fallback voor browsers die video niet ondersteunen */}
          </video>
        )}
        {/* Fallback Background (toont als video niet laadt) */}
        {videoError && (
          <div className="absolute inset-0 bg-gradient-to-r from-domred/90 to-domred/70">
            <div className="absolute inset-0 bg-black/30"></div>
          </div>
        )}
        {/* Video Overlay - alleen een subtiele zwarte overlay voor leesbaarheid */}
        <div className="absolute inset-0 bg-black/30"></div>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Veiligheid begint bij de juiste toegang
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto">
              Slimme oplossingen voor thuis en bedrijf. Professionele toegangscontrole en beveiligingssystemen.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/products">
                <button className="bg-white text-domred px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg">
                  Ontdek onze producten
                </button>
              </Link>
              <Link to="/contact">
                <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-domred transition-all duration-300">
                  Gratis advies
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
          </div>
        </motion.div>
      </section>

      {/* Product Categories */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Onze oplossingen
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Van slimme sloten tot complete beveiligingssystemen. Wij hebben de expertise en producten om uw veiligheid te garanderen.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {productCategories.map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Link to={category.link}>
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                    <div className="h-48 bg-gradient-to-br from-domred/10 to-domred/5 flex items-center justify-center">
                      <span className="text-6xl">{category.icon}</span>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-domred transition-colors">
                        {category.title}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {category.description}
                      </p>
                      <div className="flex items-center text-domred font-semibold">
                        Meer informatie
                        <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Over BTD Dordrecht
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Al meer dan 25 jaar zijn wij uw betrouwbare partner in toegangscontrole en beveiliging. 
                Met onze expertise in slimme sloten, toegangssystemen en hang- en sluitwerk helpen wij 
                particulieren en bedrijven hun veiligheid te optimaliseren.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-domred mb-2">25+</div>
                  <div className="text-gray-600">Jaar ervaring</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-domred mb-2">1000+</div>
                  <div className="text-gray-600">Tevreden klanten</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-domred mb-2">24/7</div>
                  <div className="text-gray-600">Service beschikbaar</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-domred mb-2">100%</div>
                  <div className="text-gray-600">Betrouwbaarheid</div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-domred/10 to-domred/5 rounded-2xl p-8 h-96 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-8xl mb-4">🏢</div>
                  <p className="text-lg text-gray-700 font-medium">
                    Professionele installatie en service
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Customer Segments */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Voor iedereen
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Of u nu een particulier bent die zijn huis wil beveiligen of een bedrijf dat professionele toegangscontrole nodig heeft, 
              wij hebben de juiste oplossing voor u.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Particulieren */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl p-8 shadow-lg"
            >
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">🏠</div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">Particulieren</h3>
              </div>
              <ul className="space-y-4 text-gray-600">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-domred mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Slimme sloten met app-bediening
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-domred mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  CCTV camera-systemen
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-domred mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Alarmsystemen voor thuis
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-domred mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  24/7 spoedservice
                </li>
              </ul>
              <div className="mt-8 text-center">
                <Link to="/products">
                  <button className="bg-domred text-white px-6 py-3 rounded-lg font-semibold hover:bg-domred/90 transition-colors">
                    Bekijk particuliere oplossingen
                  </button>
                </Link>
              </div>
            </motion.div>

            {/* Zakelijk */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl p-8 shadow-lg"
            >
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">🏢</div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">Zakelijk</h3>
              </div>
              <ul className="space-y-4 text-gray-600">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-domred mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Professionele toegangscontrole
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-domred mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Complete beveiligingssystemen
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-domred mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Onderhoudscontracten
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-domred mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Projectbegeleiding en advies
                </li>
              </ul>
              <div className="mt-8 text-center">
                <Link to="/products">
                  <button className="bg-domred text-white px-6 py-3 rounded-lg font-semibold hover:bg-domred/90 transition-colors">
                    Bekijk zakelijke oplossingen
                  </button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-domred">
        <div className="max-w-4xl mx-auto text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Klaar om te beginnen?
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Neem contact met ons op voor een gratis adviesgesprek en ontdek hoe wij uw veiligheid kunnen verbeteren.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <button className="bg-white text-domred px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all duration-300">
                  Gratis adviesgesprek
                </button>
              </Link>
              <Link to="/products">
                <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-domred transition-all duration-300">
                  Bekijk producten
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 