import React from 'react'
import HeroComponent from '@/components/repeatComponents/Hero'
const HeroSection: React.FC = () => {
  const isSpecialPage = false 
  return (
    <>
   
      <HeroComponent
        title="Your Saved jobs."
       
        
        titleClassName="text-3xl md:text-7xl md:pt-8 text-center font-bold text-darkGrey" // Custom title style for Page1
        spanClassName="text-signature" // Custom span style for Page1
        showSuggestions={false}
        backgroundImage="url-to-image"
        showSearchBar={isSpecialPage}
      />
      {/* Other content for Page2 */}
    </>
  )
}

export default HeroSection
