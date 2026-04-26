/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import { Document, Font, Image, Page, Path, StyleSheet, Svg, Text, View } from "@react-pdf/renderer";

type ProgramIconKind = "heart" | "camera" | "utensils" | "cake" | "music";

Font.register({
  family: "Abyssinica",
  src: "/usr/share/fonts/truetype/abyssinica/AbyssinicaSIL-Regular.ttf",
});

const AMHARIC_DATE = "እሁድ፣ ግንቦት 16፣ 2018";

const PROGRAM_LINES = [
  {
    amharicLabel: "የቃል ኪዳን ሥነ-ሥርዓት",
    amharicTime: "10:00 ከሰዓት - 10:30 ከሰዓት",
    englishLabel: "Vow Ceremony",
    englishTime: "4:00 - 4:30 PM",
  },
  {
    amharicLabel: "የፎቶ ፕሮግራም",
    amharicTime: "10:30 ከሰዓት - 11:30 ከሰዓት",
    englishLabel: "Photo Program",
    englishTime: "4:30 - 5:30 PM",
  },
  {
    amharicLabel: "እራት",
    amharicTime: "11:30 ከሰዓት - 12:30 ከሰዓት",
    englishLabel: "Dinner",
    englishTime: "5:30 - 6:30 PM",
  },
  {
    amharicLabel: "ንግግሮች እና ኬክ",
    amharicTime: "12:30 ከሰዓት - 1:30 ከሰዓት",
    englishLabel: "Toasts and Cake",
    englishTime: "6:30 - 7:30 PM",
  },
  {
    amharicLabel: "ፓርቲ እና ዳንስ",
    amharicTime: "1:30 ከሰዓት - 2:00 ከሰዓት",
    englishLabel: "Party and Dance",
    englishTime: "7:30 - 8:00 PM",
  },
];

const programIconFor = (label: string, index: number): ProgramIconKind => {
  const normalized = label.toLowerCase();

  if (normalized.includes("photo")) return "camera";
  if (normalized.includes("dinner")) return "utensils";
  if (normalized.includes("cake") || normalized.includes("toast")) return "cake";
  if (normalized.includes("party") || normalized.includes("dance")) return "music";

  return index === 0 ? "heart" : "music";
};

function ProgramPdfIcon({ kind }: { kind: ProgramIconKind }) {
  const common = {
    fill: "none",
    stroke: "#6d4d45",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 1.8,
  };

  return (
    <Svg height={11} viewBox="0 0 24 24" width={11}>
      {kind === "heart" ? (
        <Path
          {...common}
          d="M19.5 12.6 12 20l-7.5-7.4A5 5 0 0 1 12 6a5 5 0 0 1 7.5 6.6Z"
        />
      ) : null}
      {kind === "camera" ? (
        <>
          <Path {...common} d="M4 7h4l2-2h4l2 2h4v12H4Z" />
          <Path {...common} d="M9 13a3 3 0 1 0 6 0 3 3 0 0 0-6 0Z" />
        </>
      ) : null}
      {kind === "utensils" ? (
        <>
          <Path {...common} d="M7 3v8" />
          <Path {...common} d="M5 3v4" />
          <Path {...common} d="M9 3v4" />
          <Path {...common} d="M7 11v10" />
          <Path {...common} d="M16 3c2 2 2 6 0 8v10" />
        </>
      ) : null}
      {kind === "cake" ? (
        <>
          <Path {...common} d="M4 11h16v9H4Z" />
          <Path {...common} d="M4 15h16" />
          <Path {...common} d="M8 11V8" />
          <Path {...common} d="M12 11V8" />
          <Path {...common} d="M16 11V8" />
          <Path {...common} d="M8 6h.01M12 6h.01M16 6h.01" />
        </>
      ) : null}
      {kind === "music" ? (
        <>
          <Path {...common} d="M9 18V5l10-2v13" />
          <Path {...common} d="M5 20a4 3 0 1 0 4-3" />
          <Path {...common} d="M15 18a4 3 0 1 0 4-3" />
        </>
      ) : null}
    </Svg>
  );
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ead2c7",
    color: "#2d1f1c",
    fontFamily: "Helvetica",
    fontSize: 9,
    padding: 9,
  },
  card: {
    backgroundColor: "#fffaf2",
    border: "5 solid #743b48",
    borderRadius: 9,
    height: "100%",
    overflow: "hidden",
    padding: 8,
    position: "relative",
    width: "100%",
  },
  bloomTop: {
    backgroundColor: "#ecd3c2",
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
    border: "1 solid #d8ad62",
    borderRadius: 7,
    height: "100%",
    padding: 8,
    position: "relative",
  },
  hero: {
    backgroundColor: "#7f4f59",
    borderRadius: 8,
    color: "#fff8f4",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    minHeight: 78,
    paddingBottom: 9,
    paddingLeft: 18,
    paddingRight: 18,
    paddingTop: 12,
  },
  heroText: {
    flexGrow: 1,
  },
  heroArc: {
    alignSelf: "flex-end",
    borderBottom: "1.2 solid #d8ad62",
    borderRadius: 999,
    height: 28,
    width: 54,
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
    fontSize: 23,
    lineHeight: 1.15,
    marginBottom: 7,
  },
  metaLine: {
    fontFamily: "Times-Bold",
    fontSize: 9,
    lineHeight: 1.45,
    marginBottom: 2,
  },
  metaAmharic: {
    color: "#fff8f4",
    fontFamily: "Abyssinica",
    fontSize: 8.5,
    lineHeight: 1.25,
    marginBottom: 2,
  },
  intro: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 9,
    minHeight: 112,
    paddingLeft: 10,
    paddingRight: 10,
  },
  introText: {
    width: 130,
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
    fontSize: 20,
    lineHeight: 0.95,
  },
  divider: {
    backgroundColor: "#b89b65",
    height: 1,
    marginTop: 7,
    opacity: 0.65,
    width: 116,
  },
  body: {
    flexDirection: "column",
    gap: 12,
    paddingLeft: 4,
    paddingRight: 4,
  },
  details: {
    width: "100%",
  },
  qrCard: {
    alignSelf: "center",
    backgroundColor: "#fffdfb",
    border: "1 solid #dcc7bc",
    borderRadius: 9,
    marginTop: 24,
    padding: 6,
    width: 82,
  },
  qrBox: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    border: "1 solid #ead8d0",
    borderRadius: 7,
    padding: 4,
  },
  qrImage: {
    height: 54,
    width: 54,
  },
  qrHint: {
    color: "#6b5a55",
    fontSize: 5,
    lineHeight: 1.15,
    marginTop: 5,
  },
  infoCard: {
    backgroundColor: "#fffdfa",
    border: "1 solid #ead8d0",
    borderRadius: 7,
    marginTop: 20,
    padding: 10,
    width: 124,
  },
  infoValue: {
    fontFamily: "Times-Bold",
    fontSize: 12,
  },
  noteCard: {
    backgroundColor: "#fff2eb",
    border: "1 solid #ebd0c6",
    borderRadius: 7,
    padding: 10,
  },
  noteText: {
    fontSize: 9,
    lineHeight: 1.3,
  },
  programCard: {
    backgroundColor: "#eef4ef",
    border: "1 solid #d7e4d9",
    borderRadius: 7,
    paddingBottom: 5,
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 12,
  },
  programTitle: {
    color: "#a66e61",
    fontSize: 8,
    letterSpacing: 1.5,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  programLine: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderBottom: "0.6 solid #d8d1c4",
    gap: 4,
    minHeight: 13,
    paddingBottom: 1,
    paddingTop: 1,
  },
  programIcon: {
    alignItems: "center",
    height: 12,
    justifyContent: "center",
    width: 12,
  },
  programLabel: {
    fontFamily: "Helvetica-Bold",
    fontSize: 4.7,
    lineHeight: 1.05,
  },
  programAmharicLine: {
    fontFamily: "Abyssinica",
    fontSize: 4.7,
    lineHeight: 1,
    marginTop: 0.5,
  },
  programTextGroup: {
    flexDirection: "column",
    flexGrow: 1,
  },
  closing: {
    alignItems: "center",
    gap: 1,
    marginTop: 5,
  },
  closingScript: {
    color: "#6d4d45",
    fontFamily: "Times-Italic",
    fontSize: 11,
  },
  closingText: {
    color: "#3c2423",
    fontFamily: "Times-Bold",
    fontSize: 13,
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
  return (
    <Document title={`${ticket.ticketCode}.pdf`}>
      <Page size={[297.64, 419.53]} style={styles.page}>
        <View style={styles.card}>
          <View style={styles.bloomTop} />
          <View style={styles.bloomBottom} />

          <View style={styles.inner}>
            <View style={styles.hero}>
              <View style={styles.heroText}>
                <Text style={styles.kicker}>{event.weddingTitle}</Text>
                <Text style={styles.title}>{event.coupleNames}</Text>
                <Text style={styles.metaLine}>{event.weddingDate}</Text>
                <Text style={styles.metaAmharic}>{AMHARIC_DATE}</Text>
                <Text style={styles.metaLine}>{event.venue}</Text>
              </View>
              <View style={styles.heroArc} />
            </View>

            <View style={styles.intro}>
              <View style={styles.introText}>
                <Text style={styles.label}>Issued to</Text>
                <Text style={styles.guestName}>{ticket.guestName}</Text>
                <View style={styles.divider} />
                <View style={styles.infoCard}>
                  <Text style={styles.label}>Ticket ID</Text>
                  <Text style={styles.infoValue}>{ticket.ticketCode}</Text>
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

            <View style={styles.body}>
              <View style={styles.details}>
                {ticket.notes ? (
                  <View style={styles.noteCard}>
                    <Text style={styles.label}>Notes</Text>
                    <Text style={styles.noteText}>{ticket.notes}</Text>
                  </View>
                ) : null}

                <View style={styles.programCard}>
                  <Text style={styles.programTitle}>Program Detail</Text>
                  {PROGRAM_LINES.map((program, index) => (
                    <View key={program.englishLabel} style={styles.programLine}>
                      <View style={styles.programIcon}>
                        <ProgramPdfIcon kind={programIconFor(program.englishLabel, index)} />
                      </View>
                      <View style={styles.programTextGroup}>
                        <Text style={styles.programLabel}>
                          {program.englishLabel} | {program.englishTime}
                        </Text>
                        <Text style={styles.programAmharicLine}>
                          {program.amharicLabel} | {program.amharicTime}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            </View>

            <View style={styles.closing}>
              <Text style={styles.closingScript}>Come for the love,</Text>
              <Text style={styles.closingText}>Stay for the celebration!</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
