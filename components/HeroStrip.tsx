'use client';
import { motion } from 'framer-motion';
import { useRef, useEffect } from 'react';
import Link from 'next/link';

export default function HeroStrip() {
  const tiltAngles = [1.875, -1.875, -1.875, 1.875, -1.875, 1.875]; // First to the right, then alternating, then reverse from 3rd video
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    // Set staggered start times for each video with 0.3s delay between each
    const startDelays = [0, 0.3, 0.6, 0.9, 1.2, 1.5]; // 0.3 second delays between each video
    
    // Generate random start times for each video (between 0 and 8 seconds)
    const randomStartTimes = Array.from({ length: 6 }, () => Math.random() * 8);
    
    videoRefs.current.forEach((video, index) => {
      if (video) {
        // Pause all videos initially
        video.pause();
        
        // Set each video to start after its delay with random start time
        setTimeout(() => {
          if (video) {
            video.currentTime = randomStartTimes[index]; // Random start time
            video.play();
          }
        }, startDelays[index] * 1000); // Convert to milliseconds
      }
    });
  }, []);

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-celo-yellow/10 to-celo-lime/10 py-8 sm:py-12 lg:py-16">
      <div className="flex flex-wrap justify-center items-center gap-0.5 sm:gap-1 lg:gap-1.5 px-4 sm:px-6 lg:px-8">
        {Array.from({ length: 6 }, (_, index) => (
          <motion.div
            key={index}
            initial={{ x: -100, opacity: 0, rotate: tiltAngles[index] }}
            animate={{ x: 0, opacity: 1, rotate: tiltAngles[index] }}
            whileHover={{ 
              scale: 1.05, 
              rotate: tiltAngles[index] + (tiltAngles[index] > 0 ? 2 : -2),
              transition: { duration: 0.2 }
            }}
            transition={{
              duration: 0.4,
              delay: index * 0.2,
              ease: "easeOut"
            }}
            className="inline-block cursor-pointer"
          >
            <video
              ref={(el) => { videoRefs.current[index] = el; }}
              src="https://res.cloudinary.com/dxk9z634d/video/upload/v1757976175/vid_uk0htf.webm"
              loop
              muted
              playsInline
              className="w-[80px] h-[120px] sm:w-[100px] sm:h-[150px] md:w-[120px] md:h-[180px] lg:w-[150px] lg:h-[225px] object-cover rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            />
          </motion.div>
        ))}
      </div>
      
      {/* Text and Buttons Section */}
      <div className="mt-8 sm:mt-12 lg:mt-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl celo-text mb-6 sm:mb-8 leading-tight"
            style={{ fontFamily: 'GT Alpina VAR Trial, ui-serif, system-ui', fontWeight: 40 }}
          >
            Celo es una L2 líder de Ethereum. Enfocada para el impacto global, estamos escalando soluciones reales para todos.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.4 }}
            className="flex flex-col sm:flex-row gap-4 sm:gap-6"
          >
            <Link href="/academy" className="group relative overflow-hidden rounded-full border-celo-fg dark:border-celo-yellow border-[0.3px] px-8 py-3 font-bold text-black dark:text-celo-yellow text-xs sm:text-sm bg-transparent transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-celo-yellow focus-visible:ring-offset-0 inline-block">
              <span className="relative z-10 dark:group-hover:text-black">Construye con Celo</span>
              <span className="pointer-events-none absolute inset-0 m-auto h-full w-full rounded-full bg-[#fcf6f1] scale-0 transition-transform duration-300 ease-out group-hover:scale-150 z-0" />
            </Link>
            
            <button className="group flex items-center gap-2 celo-text font-medium text-sm sm:text-base hover:opacity-80 transition-all duration-200">
              <span>Únete a la comunidad</span>
              <motion.span
                className="inline-block"
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
              >
                →
              </motion.span>
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
