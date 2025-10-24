// src/styles/globals.js
// src/styles/global.js
import { StyleSheet, useColorScheme } from "react-native";

const lightColors = { primary: "#0868cfff", danger: "#FF3B30", gray: "#ccc", background: "#ffffff",
  onBackground: "#333333", muted: "#777777", card: "#ecebebff", border: "#000000",};
const darkColors = { primary: "#2d54c0ff", danger: "#FF453AFF", gray: "#555555", background: "#000000",
  onBackground: "#eeeeee", muted: "#bbbbbb", card: "#a4a7acff", border: "#ffffff",};

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };
export const fonts = { h1: { fontSize: 32, fontWeight: "700" }, h2: { fontSize: 22, fontWeight: "600" },
  body: { fontSize: 16, fontWeight: "400" }, label: { fontSize: 16, fontWeight: "600" }};
export default function useGlobalStyles() {
  const isDark = useColorScheme() === "dark";
  const colors = isDark ? darkColors : lightColors;

return StyleSheet.create({
  /* Layout */
  screen: { flex: 1, backgroundColor: colors.background,},
  bodyleft: { flex: 1, backgroundColor: colors.onBackground, justifyContent: "center", alignItems: "flex-start", padding: spacing.md,textAlign:"center"},
  containerCenter: { flex: 1, backgroundColor: colors.background, justifyContent: "center", alignItems: "center", padding: spacing.md,textAlign:"center"},
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.md,},
  containerScroll: { flexGrow: 1, padding: spacing.md, backgroundColor: colors.background},
  /* Typography */
  h1: { ...fonts.h1, color: colors.onBackground },
  h2: { ...fonts.h2, color: colors.onBackground },
  text: { ...fonts.body, color: colors.onBackground },
  textMuted: { ...fonts.body, color: colors.muted },
  label: { ...fonts.label, color: colors.onBackground },
  title: { ...fonts.h1, marginBottom: 24,color: colors.primary},
  /* Buttons */
  btn: { paddingVertical: 12, paddingHorizontal: 16, borderRadius: 4, minHeight: 44,  marginTop:10, marginVertical: 8, backgroundColor: colors.primary ,
    marginBottom: 9,  },
  btnPrimary: { backgroundColor: colors.primary, },
  btnDanger: { backgroundColor: colors.danger },
  btnOutline: { backgroundColor: "transparent", borderWidth: 1, borderColor: colors.primary,},
  btnText: { color: "#fff", fontSize: 16, fontWeight: "600", textAlign: "center" },
  /* Card / Box */
  card: { backgroundColor: colors.card, borderRadius: 8, padding: spacing.md, marginVertical: spacing.sm, elevation: 2, borderWidth: 1, borderColor: colors.border,},
  cardRow: { flexDirection: "row", alignItems: "center",},
  cardTitle: { fontWeight: "700", color: colors.onBackground,},
  cardSub: { color: colors.muted, marginTop: 6, },
  /* Inputs */
  inputWrapper: { marginBottom: spacing.sm, },
  input: { width: "100%", height: 40, borderColor: colors.gray, borderWidth: 1, borderRadius: 6, paddingHorizontal: 12, paddingVertical: 8, color: colors.onBackground, backgroundColor: colors.background},
  /* Avatar / thumbnails / media */
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: spacing.md },
  thumb: { width: 72, height: 72, borderRadius: 6, backgroundColor: colors.gray },
  /* Map / Image */
  media: { width: "100%", height: 200, borderRadius: 8, marginBottom: spacing.sm },
  map: { width: "100%", height: 300, borderRadius: 8, marginVertical: spacing.sm },
  /* Utility */
  row: { flexDirection: "row", alignItems: "center" },
  col: { flexDirection: "column" },
  spacer: { height: spacing.sm },
  separator: { height: 1, backgroundColor: colors.gray, marginVertical: spacing.sm },
  /* Actions / small buttons */
  iconButton: { padding: 8 },
  actionRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  /* Location button */
  currentLocButton: { position: "absolute", top: 12, right: 12, backgroundColor: colors.gray, borderRadius: 20, padding: 8, elevation: 3, },
  locationText: { color: colors.onBackground, fontWeight: "700" },
  /* Misc */
  muted: { color: colors.muted },
  pending: { color: "#e67e22" },
  /* Header */
  header: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border, backgroundColor: colors.background, },
  /* Footer activity list (panel) */
  panel: { position: "absolute", bottom: 0, width: "100%", padding: 12, backgroundColor: colors.background, borderTopWidth: 1, borderTopColor: colors.border,},
  /* Small helpers for color variants */
  successBg: { backgroundColor: "#D4EDDA" },
  warningBg: { backgroundColor: "#FFF3CD" },
  });
}
