import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// Styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    fontFamily: 'Helvetica',
    lineHeight: 1.6,
    color: '#000',
    backgroundColor: '#fff', // ensures white background
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#1a1a1a',
  },
  section: {
    marginBottom: 20,       // more spacing between sections
    paddingBottom: 6,
    borderBottomWidth: 0.3, // subtle separator line
    borderBottomColor: '#ccc',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,        // space between subtitle and content
    color: '#1a1a1a',
  },
  text: {
    fontSize: 12,
    marginBottom: 6,        // spacing between lines
    paddingLeft: 6,
    color: '#333',
  },
  bullet: {
    fontSize: 12,
    marginBottom: 6,        // spacing between bullet points
    marginLeft: 16,
    color: '#333',
  },
  twoColumn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  twoColumnItem: {
    width: '48%',
  },
  aiSection: {
    marginTop: 12,
    padding: 10,
    borderTopWidth: 0.3,
    borderTopColor: '#aaa',
    borderRadius: 4,
    backgroundColor: 'transparent', // keep background white
  },
});


// Markdown parser
const parseMarkdownToPdfText = (str) => {
  if (!str) return null;
  const parts = str.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, idx) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <Text key={idx} style={{ fontWeight: 'bold', color: '#1a1a1a' }}>
        {part.slice(2, -2)}
      </Text>
    ) : (
      <Text key={idx} style={{ color: '#333' }}>{part}</Text>
    )
  );
};

const ItineraryPDF = ({ itinerary = {}, aiSuggestions = [] }) => {
  const locations = itinerary.locations || [];
  const excursions = itinerary.excursions || [];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Title */}
        <Text style={styles.title}>{itinerary.title || 'Untitled Trip'}</Text>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.subtitle}>Description</Text>
          {parseMarkdownToPdfText(itinerary.description || 'N/A')}
        </View>

        {/* Locations */}
        <View style={styles.section}>
          <Text style={styles.subtitle}>Locations</Text>
          {locations.length > 0
            ? locations.map((loc, idx) => (
                <Text key={idx} style={styles.bullet}>
                  • {parseMarkdownToPdfText(loc)}
                </Text>
              ))
            : <Text style={styles.text}>N/A</Text>
          }
        </View>

        {/* Excursions */}
        <View style={styles.section}>
            <Text style={styles.subtitle}>Excursions</Text>
            {excursions.some(exc => parseMarkdownToPdfText(exc)?.trim())
                ? excursions.map((exc, idx) => {
                    const parsed = parseMarkdownToPdfText(exc)?.trim();
                    return parsed ? (
                    <Text key={idx} style={styles.bullet}>
                        • {parsed}
                    </Text>
                    ) : null;
                })
                : <Text style={styles.text}>N/A</Text>
            }
            </View>


        {/* Dates, Travelers, Budget (Two-column layout) */}
        <View style={styles.section}>
          <View style={styles.twoColumn}>
            <View style={styles.twoColumnItem}>
              <Text style={styles.subtitle}>Dates</Text>
              <Text style={styles.text}>
                {itinerary.startDate ? new Date(itinerary.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
                {' - '}
                {itinerary.endDate ? new Date(itinerary.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
              </Text>
            </View>
            <View style={styles.twoColumnItem}>
              <Text style={styles.subtitle}>Travelers</Text>
              <Text style={styles.text}>{itinerary.numTravelers || 'N/A'}</Text>
            </View>
          </View>
          <View style={{ marginTop: 6 }}>
            <Text style={styles.subtitle}>Budget</Text>
            <Text style={styles.text}>{itinerary.budget ? `$${itinerary.budget}` : 'N/A'}</Text>
          </View>
        </View>

        {/* AI Suggestions */}
        {aiSuggestions.length > 0 && (
          <View style={{ ...styles.section, ...styles.aiSection }}>
            <Text style={styles.subtitle}>AI Suggestions</Text>
            {aiSuggestions.map((suggestion, idx) => (
              <Text key={idx} style={styles.bullet}>
                • {parseMarkdownToPdfText(suggestion)}
              </Text>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
};

export default ItineraryPDF;
