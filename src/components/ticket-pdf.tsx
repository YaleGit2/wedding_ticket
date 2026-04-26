/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#fff7f1",
    color: "#2d1f1c",
    fontFamily: "Helvetica",
    fontSize: 9,
    padding: 10,
  },
  card: {
    backgroundColor: "#fffaf7",
    border: "1 solid #d8c3b9",
    borderRadius: 16,
    height: "100%",
    overflow: "hidden",
    padding: 10,
    position: "relative",
    width: "100%",
  },
  bloomTop: {
    backgroundColor: "#f0d6cd",
    borderRadius: 999,
    height: 94,
    opacity: 0.42,
    position: "absolute",
    right: -16,
    top: -30,
    width: 94,
  },
  bloomBottom: {
    backgroundColor: "#ddeae1",
    borderRadius: 999,
    bottom: -34,
    height: 112,
    left: -26,
    opacity: 0.52,
    position: "absolute",
    width: 112,
  },
  inner: {
    border: "1 solid #ead7ce",
    borderRadius: 14,
    height: "100%",
    padding: 10,
    position: "relative",
  },
  hero: {
    backgroundColor: "#7f4f59",
    borderRadius: 14,
    color: "#fff8f4",
    marginBottom: 9,
    paddingBottom: 12,
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 12,
  },
  kicker: {
    color: "#f3ddd3",
    fontSize: 8,
    letterSpacing: 1.8,
    marginBottom: 4,
    textTransform: "uppercase",
  },
  title: {
    fontFamily: "Times-Bold",
    fontSize: 21,
    lineHeight: 1.15,
    marginBottom: 9,
  },
  metaLine: {
    fontFamily: "Times-Bold",
    fontSize: 9,
    lineHeight: 1.45,
    marginBottom: 2,
  },
  intro: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  introText: {
    flexGrow: 1,
  },
  label: {
    color: "#a66e61",
    fontSize: 8,
    letterSpacing: 1.5,
    marginBottom: 4,
    textTransform: "uppercase",
  },
  guestName: {
    fontFamily: "Times-Bold",
    fontSize: 23,
    lineHeight: 0.95,
  },
  seal: {
    backgroundColor: "#f6e7d8",
    border: "1 solid #e0bf9f",
    borderRadius: 999,
    color: "#926448",
    fontSize: 8,
    letterSpacing: 1.1,
    paddingBottom: 6,
    paddingLeft: 12,
    paddingRight: 12,
    paddingTop: 6,
    textTransform: "uppercase",
  },
  body: {
    flexDirection: "row",
    gap: 12,
  },
  details: {
    flexGrow: 1,
    gap: 9,
  },
  qrCard: {
    alignSelf: "flex-start",
    backgroundColor: "#fffdfb",
    border: "1 solid #dcc7bc",
    borderRadius: 16,
    padding: 7,
    width: 112,
  },
  qrBox: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    border: "1 solid #ead8d0",
    borderRadius: 13,
    padding: 4,
  },
  qrImage: {
    height: 64,
    width: 64,
  },
  qrHint: {
    color: "#6b5a55",
    fontSize: 7,
    lineHeight: 1.15,
    marginTop: 5,
  },
  infoCard: {
    backgroundColor: "#fffdfa",
    border: "1 solid #ead8d0",
    borderRadius: 12,
    padding: 10,
    width: 152,
  },
  infoValue: {
    fontFamily: "Times-Bold",
    fontSize: 13,
  },
  noteCard: {
    backgroundColor: "#fff2eb",
    border: "1 solid #ebd0c6",
    borderRadius: 12,
    padding: 10,
  },
  noteText: {
    fontSize: 9,
    lineHeight: 1.3,
  },
  programCard: {
    backgroundColor: "#eef4ef",
    border: "1 solid #d7e4d9",
    borderRadius: 12,
    padding: 10,
  },
  programLine: {
    fontSize: 10,
    lineHeight: 1.25,
    marginBottom: 2,
  },
});

type TicketPdfProps = {
  event: {
    weddingTitle: string;
    coupleNames: string;
    weddingDate: string;
    venue: string;
    programDetails: string;
  };
  ticket: {
    ticketCode: string;
    guestName: string;
    numberOfGuests: number | null;
    tableNumber: string | null;
    notes: string | null;
  };
  qrDataUrl: string;
};

export function TicketPdf({ event, ticket, qrDataUrl }: TicketPdfProps) {
  const programLines = event.programDetails
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <Document title={`${ticket.ticketCode}.pdf`}>
      <Page size={[419.53, 297.64]} style={styles.page}>
        <View style={styles.card}>
          <View style={styles.bloomTop} />
          <View style={styles.bloomBottom} />

          <View style={styles.inner}>
            <View style={styles.hero}>
              <Text style={styles.kicker}>{event.weddingTitle}</Text>
              <Text style={styles.title}>{event.coupleNames}</Text>
              <Text style={styles.metaLine}>{event.weddingDate}</Text>
              <Text style={styles.metaLine}>{event.venue}</Text>
            </View>

            <View style={styles.intro}>
              <View style={styles.introText}>
                <Text style={styles.label}>Issued to</Text>
                <Text style={styles.guestName}>{ticket.guestName}</Text>
              </View>
              <Text style={styles.seal}>Wedding Invitation</Text>
            </View>

            <View style={styles.body}>
              <View style={styles.details}>
                <View style={styles.infoCard}>
                  <Text style={styles.label}>Ticket ID</Text>
                  <Text style={styles.infoValue}>{ticket.ticketCode}</Text>
                </View>

                {ticket.notes ? (
                  <View style={styles.noteCard}>
                    <Text style={styles.label}>Notes</Text>
                    <Text style={styles.noteText}>{ticket.notes}</Text>
                  </View>
                ) : null}

                <View style={styles.programCard}>
                  <Text style={styles.label}>Program Detail</Text>
                  {programLines.map((line) => (
                    <Text key={line} style={styles.programLine}>
                      {line}
                    </Text>
                  ))}
                </View>
              </View>

              <View style={styles.qrCard}>
                <Text style={styles.label}>Entry Pass</Text>
                <View style={styles.qrBox}>
                  <Image src={qrDataUrl} style={styles.qrImage} />
                </View>
                <Text style={styles.qrHint}>Present this QR code at the entrance checkpoints.</Text>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
