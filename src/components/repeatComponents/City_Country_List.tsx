// "use client";
// import React, { useState } from 'react';
// import {
//   CitySelect,
//   CountrySelect,
//   StateSelect,
//   LanguageSelect,
// } from 'react-country-state-city';
// import 'react-country-state-city/dist/react-country-state-city.css';

// interface SelectOption {
//   id: number;
//   name: string;
// }

// const App: React.FC = () => {
//   const [countryId, setCountryId] = useState<number>(0);
//   const [stateId, setStateId] = useState<number>(0);

//   return (
//     <div>
     
//       <CountrySelect
//         onChange={(e: SelectOption) => {
//           setCountryId(e.id);
//         }}
//         placeHolder="Select Country"
//       />
      
//       <h6>City</h6>
//       <CitySelect
//         countryId={countryId}
//         stateId={stateId}
//         onChange={(e: SelectOption) => {
//        
//         }}
//         placeHolder="Select City"
//       />
   
      
//     </div>
//   );
// };

// export default App;
