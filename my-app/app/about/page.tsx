import { AboutHero } from "@/components/about/about-hero";
import { FounderCard } from "@/components/about/founder-card";
import { MissionSection } from "@/components/about/mission-section";
import { VideoIntro } from "@/components/about/video-intro";
import { FOUNDER_PROFILE_URL } from "@/lib/config";
import { ABOUT_VIDEO_URL, LOGO2_URL } from "@/lib/config";

export default function AboutPage() {
  return (
    <div>
      {/* Video Intro - Upload your video to /public/videos/making-process.mp4 */}
      <VideoIntro
        videoSrc={ABOUT_VIDEO_URL}
        posterSrc={LOGO2_URL}
      />

      <AboutHero />

      {/* Story Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-white dark:bg-zinc-950">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-4xl">
          <div className="prose prose-base sm:prose-lg dark:prose-invert mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6 sm:mb-8 text-gray-900 dark:text-white">
              The Story Behind Grace, Ongoing
            </h2>
            <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed text-center">
              {/* ADD YOUR STORY HERE */}
              Grace, Ongoing was born from a passion to share the love of Christ
              through creative expression. Founded by Amanda Kolar, this brand
              combines faith, design, and purpose to create meaningful products
              that inspire and encourage believers in their daily walk.
            </p>
          </div>
        </div>
      </section>

      <MissionSection />

      {/* Founder Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-white dark:bg-zinc-950">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-10 md:mb-12 text-gray-900 dark:text-white">
            Meet the Founder
          </h2>

          <FounderCard
            imageSrc={FOUNDER_PROFILE_URL}
            imageAlt="Amanda Kolar - Founder and Designer of Grace, Ongoing, wearing faith-inspired apparel"
            name="Amanda Kolar"
            title="Founder & Designer"
            university="Ashland University - Graphic Design & Marketing"
            sport="Ashland Softball Player"
            bio="Amanda is a senior at Ashland University, majoring in Graphic Design and Marketing. With a bold faith in the Lord Jesus Christ, she founded Grace, Ongoing to spread God's love and positive messages through thoughtfully designed, handmade products. When she's not creating designs, you can find her on the softball field representing Ashland University."
            socials={{
              instagram: "https://instagram.com/graceongoing", 
              x: "https://x.com/graceongoing",
              facebook: "https://facebook.com/graceongoing",
              linkedin: "https://linkedin.com/in/amandakolar",
              portfolio: "https://amandakolar.com",
            }}
          />
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-[#927194] to-[#D08F90]">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
            Join the Journey
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-white/90 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            Be part of spreading faith, love, and positive messages through
            our handmade designs
          </p>
          <a
            href="/shop"
            className="inline-block bg-white text-[#927194] px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-300 shadow-lg text-sm sm:text-base"
          >
            Shop the Collection
          </a>
        </div>
      </section>
    </div>
  );
}
