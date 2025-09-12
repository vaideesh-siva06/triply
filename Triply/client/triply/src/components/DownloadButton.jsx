import React, { useMemo } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ItineraryPDF from './ItineraryPDF';

const DownloadButton = ({ itinerary, aiSuggestions, isSet }) => {
  const stableItinerary = useMemo(() => itinerary, [itinerary]);
  const stableAiSuggestions = useMemo(() => aiSuggestions, [aiSuggestions]);

  return (
    <PDFDownloadLink
      document={<ItineraryPDF itinerary={stableItinerary} aiSuggestions={stableAiSuggestions} />}
      fileName={`${stableItinerary.title || 'itinerary'}.pdf`}
      className="mt-2 bg-transparent border border-black text-black hover:text-white py-2 px-4 rounded hover:bg-gray-800 inline-block transition-colors duration-200"
    >
      {({ loading }) => (loading & !isSet ? 'Generating PDF...' : 'Download PDF')}
    </PDFDownloadLink>
  );
};

export default DownloadButton;
