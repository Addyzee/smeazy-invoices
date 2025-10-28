import { StyleSheet } from "@react-pdf/renderer";
import { Text, View } from "@react-pdf/renderer";
import { type ReactElement } from "react";

// Define stles for PDF document
export const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: "white",
    fontSize: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: "#e5e7eb",
  },
  headerLeft: {
    flexDirection: "column",
  },
  headerRight: {
    flexDirection: "column",
    alignItems: "flex-end",
  },
  invoiceTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 4,
  },
  invoiceNumber: {
    fontSize: 12,
    color: "#6b7280",
  },
  businessName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#374151",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  section: {
    marginBottom: 25,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sectionColumn: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#374151",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  infoText: {
    fontSize: 10,
    color: "#4b5563",
    marginBottom: 3,
  },
  infoBold: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 3,
  },
  table: {
    marginTop: 20,
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  tableHeaderCell: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#374151",
    textTransform: "uppercase",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  tableCell: {
    fontSize: 10,
    color: "#4b5563",
  },
  tableRowNoDescription: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  tableRowWithDescription: {
    flexDirection: "row",
    paddingTop: 12,
    paddingBottom: 4,
    paddingHorizontal: 8,
  },
  descriptionRow: {
    paddingLeft: 28,
    paddingRight: 8,
    paddingTop: 0,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  descriptionText: {
    fontSize: 9,
    color: "#6b7280",
    fontStyle: "italic",
    lineHeight: 1.4,
  },
  colDescription: {
    flex: 3,
  },
  colQuantity: {
    flex: 1,
    textAlign: "center",
  },
  colPrice: {
    flex: 1.5,
    textAlign: "right",
  },
  colAmount: {
    flex: 1.5,
    textAlign: "right",
  },
  totalsContainer: {
    alignItems: "flex-end",
    marginTop: 20,
  },
  totalsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 220,
    paddingVertical: 6,
  },
  totalsFinalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 220,
    paddingVertical: 10,
    marginTop: 8,
    borderTopWidth: 2,
    borderTopColor: "#374151",
  },
  totalsLabel: {
    fontSize: 10,
    color: "#4b5563",
  },
  totalsValue: {
    fontSize: 10,
    color: "#1f2937",
    fontWeight: "bold",
  },
  totalsFinal: {
    fontSize: 12,
    fontWeight: "bold",
  },
  notes: {
    marginTop: 30,
    padding: 15,
    backgroundColor: "#f9fafb",
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: "#3b82f6",
  },
  notesTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#374151",
    marginBottom: 6,
  },
  notesText: {
    fontSize: 10,
    color: "#4b5563",
    lineHeight: 1.5,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    color: "#9ca3af",
    fontSize: 9,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
});

const pdfStatusThemes = {
  draft: {
    primary: "#6b7280", // gray-500
    secondary: "#f3f4f6", // gray-100
    text: "#1f2937", // gray-800
  },
  sent: {
    primary: "#3b82f6", // blue-500
    secondary: "#dbeafe", // blue-100
    text: "#1e40af", // blue-800
  },
  received: {
    primary: "#14b8a6", // teal-500
    secondary: "#ccfbf1", // teal-100
    text: "#115e59", // teal-800
  },
  paid: {
    primary: "#10b981", // green-500
    secondary: "#d1fae5", // green-100
    text: "#065f46", // green-800
  },
  overdue: {
    primary: "#f97316", // orange-500
    secondary: "#fed7aa", // orange-100
    text: "#991b1b", // red-800
  },
  cancelled: {
    primary: "#ef4444", // red-500
    secondary: "#fee2e2", // red-100
    text: "#991b1b", // red-800
  },
};

export const getStatusColor = (status: keyof typeof pdfStatusThemes) => {
  const normalizedStatus =
    status?.toLowerCase() as keyof typeof pdfStatusThemes;
  if (normalizedStatus && normalizedStatus in pdfStatusThemes) {
    return pdfStatusThemes[normalizedStatus];
  }
  return pdfStatusThemes.draft;
};

interface MarkdownStyles {
  descriptionText: any;
}

export const parseMarkdownDescription = (
  markdown: string,
  styles: MarkdownStyles
): ReactElement[] => {
  if (!markdown) return [];

  const lines = markdown.trim().split("\n");
  const elements: ReactElement[] = [];
  let key = 0;

  lines.forEach((line, index) => {
    const trimmedLine = line.trim();

    // Skip empty lines
    if (!trimmedLine) {
      return;
    }

    // H1 Heading (# text)
    if (trimmedLine.startsWith("# ")) {
      elements.push(
        <Text
          key={key++}
          style={[
            styles.descriptionText,
            {
              fontWeight: "bold",
              fontSize: 11,
              fontStyle: "normal",
              marginBottom: 6,
              marginTop: index > 0 ? 8 : 0,
              color: "#374151",
            },
          ]}
        >
          {trimmedLine.replace(/^# /, "")}
        </Text>
      );
    }
    // H2 Heading (## text)
    else if (trimmedLine.startsWith("## ")) {
      elements.push(
        <Text
          key={key++}
          style={[
            styles.descriptionText,
            {
              fontWeight: "bold",
              fontSize: 9,
              fontStyle: "normal",
              marginBottom: 5,
              marginTop: index > 0 ? 7 : 0,
              color: "#374151",
            },
          ]}
        >
          {trimmedLine.replace(/^## /, "")}
        </Text>
      );
    }
    // H3 Heading (### text)
    else if (trimmedLine.startsWith("### ")) {
      elements.push(
        <Text
          key={key++}
          style={[
            styles.descriptionText,
            {
              fontWeight: "bold",
              fontSize: 8,
              fontStyle: "normal",
              marginBottom: 4,
              marginTop: index > 0 ? 6 : 0,
              color: "#4b5563",
            },
          ]}
        >
          {trimmedLine.replace(/^### /, "")}
        </Text>
      );
    }
    // Unordered list (- text or * text)
    else if (trimmedLine.match(/^[-*]\s/)) {
      const content = trimmedLine.replace(/^[-*]\s/, "");
      elements.push(
        <View
          key={key++}
          style={{ flexDirection: "row", marginLeft: 10, marginBottom: 3 }}
        >
          <Text
            style={[styles.descriptionText, { marginRight: 6, marginTop: 1 }]}
          >
            •
          </Text>
          <Text style={[styles.descriptionText, { flex: 1 }]}>
            {parseInlineMarkdown(content)}
          </Text>
        </View>
      );
    }
    // Ordered list (1. text, 2. text, etc)
    else if (trimmedLine.match(/^\d+\.\s/)) {
      const match = trimmedLine.match(/^(\d+)\.\s(.+)$/);
      if (match) {
        const [, number, content] = match;
        elements.push(
          <View
            key={key++}
            style={{ flexDirection: "row", marginLeft: 10, marginBottom: 3 }}
          >
            <Text
              style={[styles.descriptionText, { marginRight: 6, minWidth: 16 }]}
            >
              {number}.
            </Text>
            <Text style={[styles.descriptionText, { flex: 1 }]}>
              {parseInlineMarkdown(content)}
            </Text>
          </View>
        );
      }
    }
    // Regular paragraph
    else {
      elements.push(
        <Text key={key++} style={[styles.descriptionText, { marginBottom: 3 }]}>
          {parseInlineMarkdown(trimmedLine)}
        </Text>
      );
    }
  });

  return elements;
};

// Helper function to parse inline markdown (bold, italic, bold+italic)
const parseInlineMarkdown = (text: string): (string | ReactElement)[] => {
  const parts: (string | ReactElement)[] = [];
  const remaining = text;
  let key = 0;

  // Regex to match bold+italic (***text***), bold (**text**), and italic (*text* or _text_)
  const regex = /(\*\*\*[^*]+\*\*\*|\*\*[^*]+\*\*|\*[^*]+\*|_[^_]+_)/g;

  let match;
  let lastIndex = 0;

  while ((match = regex.exec(remaining)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push(remaining.substring(lastIndex, match.index));
    }

    const matched = match[0];

    // Bold and Italic (***text***)
    if (matched.startsWith("***") && matched.endsWith("***")) {
      parts.push(
        <Text key={key++} style={{ fontWeight: "bold", fontStyle: "italic" }}>
          {matched.slice(3, -3)}
        </Text>
      );
    }
    // Bold (**text**)
    else if (matched.startsWith("**") && matched.endsWith("**")) {
      parts.push(
        <Text key={key++} style={{ fontWeight: "bold" }}>
          {matched.slice(2, -2)}
        </Text>
      );
    }
    // Italic (*text* or _text_)
    else if (
      (matched.startsWith("*") && matched.endsWith("*")) ||
      (matched.startsWith("_") && matched.endsWith("_"))
    ) {
      parts.push(
        <Text key={key++} style={{ fontStyle: "italic" }}>
          {matched.slice(1, -1)}
        </Text>
      );
    }

    lastIndex = regex.lastIndex;
  }

  // Add remaining text
  if (lastIndex < remaining.length) {
    parts.push(remaining.substring(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
};
