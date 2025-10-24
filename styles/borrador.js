// src/styles/global.js
import { StyleSheet, useColorScheme } from "react-native";

const lightColors = { primary: "#0868cfff", danger: "#FF3B30", gray: "#ccc", background: "#ffffff",
  onBackground: "#333333", muted: "#777777", card: "#ecebebff", border: "#000000",};
const darkColors = { primary: "#2c54c0ff", danger: "#FF453AFF", gray: "#555555", background: "#000000",
  onBackground: "#eeeeee", muted: "#bbbbbb", card: "#a4a7acff", border: "#ffffff",
};

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };
export const fonts = { h1: { fontSize: 32, fontWeight: "700" }, h2: { fontSize: 22, fontWeight: "600" },
  body: { fontSize: 16, fontWeight: "400" }, label: { fontSize: 16, fontWeight: "600" }};

export default function useGlobalStyles() {
  const isDark = useColorScheme() === "dark";
  const colors = isDark ? darkColors : lightColors;

  return StyleSheet.create({
  /* Layout */
  screen: { flex: 1, backgroundColor: colors.background,},
  containerCenter: { flex: 1, backgroundColor: colors.background, justifyContent: "center", alignItems: "center", padding: spacing.md,},
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.md,},
  containerScroll: { flexGrow: 1, padding: spacing.md, backgroundColor: colors.background,},

  /* Typography */
  h1: { ...fonts.h1, color: colors.onBackground },
  h2: { ...fonts.h2, color: colors.onBackground },
  text: { ...fonts.body, color: colors.onBackground },
  textMuted: { ...fonts.body, color: colors.muted },
  label: { ...fonts.label, color: colors.onBackground },

  /* Buttons */
  btn: { paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8, alignItems: "center", justifyContent: "center", minHeight: 44, },
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

;;;;;;;;;;;;;;

export default function useGlobalStyles() {
  const isDark = useColorScheme() === 'dark'
  const colors = isDark ? darkColors : lightColorsac

 return StyleSheet.create({
  //^avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 16,},
  //*actions: { marginLeft: 8, justifyContent: 'space-between', height: 72 },
  //*actionBtn: { paddingHorizontal: 10, paddingVertical: 6, backgroundColor: colors.card, borderRadius: 6 },
  //*actionText: { fontWeight: '600', color: colors.text},
  //*backButton: { marginTop: 13, paddingVertical: 8, paddingHorizontal: 15, borderRadius: 6, alignSelf: "flex-start", color: colors.text },
  //?button: { marginTop:10, marginVertical: 8, bkgroundColor: colors.primary , paddingVertical: 12, paddingHorizontal: 24, borderRadius: 4,marginBottom: 9 },
  //?buttonSecondary: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.priamry , paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center', minHeight: 44, alignSelf: 'stretch',},
  //^buttonText: { color: '#eee' , textAlign: "center", fontSize: 16 },
  //^body: {lex: 1 },
  //*box: { padding: 16, backgroundColor: colors.text , borderRadius: 6,  marginBottom: 12, },
  callout: { backgroundColor: colors.background, padding: 8, borderRadius: 8, minWidth: 140, alignItems: 'center', elevation: 4 },
  calloutTitle: { fontWeight: '700', fontSize: 14 },
  calloutSub: { color: colors.gray , fontSize: 12, marginTop: 4 },
  calloutTap: { marginTop: 6, color: colors.primary , fontSize: 12 },
  cancelled: { color: '#a00' },
  cardActive: { borderWidth: 2, borderColor: '#e74c3c' },
  cardTitle: { fontWeight: '700' },
  cardSmall: { color: '#666', marginTop: 6 },
  card: { flexDirection: "row", backgroundColor: colors.card, borderRadius: 8, padding: 12, alignItems: "center", elevation: 2, marginVertical: 6, borderWidth: 1, borderColor: colors.border },
  crow: { flexDirection: "row", alignItems: "center", marginBottom: 12, },
  container: { flex: 1, backgroundColor: colors.background,justifyContent: "center", padding: 20, alignItems: "center",  textAlign: "center"},
  containerContent: { flex: 1, backgroundColor: colors.background, padding: 20,},
  containerScroll: {padding: 18, backgroundColor: colors.background,flexGrow: 1, }, 
  currentLocButton: { position: 'absolute', top: 8, right: 8, backgroundColor: colors.gray, borderRadius: 20, padding: 8, elevation: 3, zIndex: 999, shadowColor: '#000', shadowOpacity: 0.2, shadowOffset: { width: 0, height: 2 },},
  cuadra:    { padding:8, backgroundColor:colors.gray , fontWeight:'bold', },
  done: { color: '#16a34a' },
  field: { marginBottom: 12 },
  formContent: { padding: 16, flexGrow: 1, alignItems: 'stretch', borderRadius: 8},
  heading: { fontSize: 22, fontWeight: '600', marginBottom: 12, color: colors.text},
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, 
    borderBottomColor: colors.text },
  item:      { padding:16 },
  itemText:  { fontSize:16 ,lineHeight: 20, color: colors.text,},
  image: { width: '100%', height: 200, borderRadius: 8, marginBottom: 12, },
  iconButton: { padding: 8, },
  input: { width: "99%", height:30, borderColor:colors.gray, borderWidth: 1, borderRadius: 4, textAlignVertical: "center", 
    textAlign: "lefts", paddingHorizontal: 11, paddingVertical: 8, marginBottom: 12, color:colors.text, backgroundColor: colors.background},
  logoutButton: { marginTop: 32, padding: 12, backgroundColor: colors.danger, borderRadius: 6, alignItems: 'center',},
  locationButton: { backgroundColor: colors.gray, padding: 10, borderRadius: 8, alignSelf: 'center', marginBottom: 8, height: 50, justifyContent: 'center', },
  locationText: { color: colors.grayinv, fontWeight: 'bold',},
  linkText: { fontSize: 16, color: "#007AFF", textDecorationLine: "underline", },
  link: { color: "#274bb1ff", textAlign: "center", marginTop: 8},
  listWrap: { position: 'absolute', bottom: 24, left: 0, right: 0, paddingHorizontal: 8 },
  label: { fontWeight: "bold", fontSize: 16, color: colors.grayinv, marginTop: 12 },
  left: { marginRight: 12 },
  map: { width: '80%', height: 300, marginVertical: 12, borderRadius: 6 ,alignSelf: 'center', },
  muted: { fontSize: 14, color: colors.gray ,},
  noImage: { justifyContent: 'center', alignItems: 'center' },
  passwordContainer: { flexDirection: 'row', alignItems: 'center', width: '58%', height: 35, borderWidth: 1, 
    borderColor: colors.gray, borderRadius: 4, paddingHorizontal: 8, marginBottom: 15,  },
  passwordInput: { flex: 1, color: '#333', textAlign: 'left', textAlignVertical: 'center', },
  paragraph: { fontSize: 16, lineHeight: 22, marginBottom: 12, width: '88%'},
  pending: { color: '#e67e22' },
  pickerContainer: { borderWidth: 1, borderColor: colors.text, borderRadius: 6, overflow: 'hidden', backgroundColor: colors.background,},
  pink: { fontSize: 16, color: '#e40f9dff' , lineHeight: 24, fontFamily: "System", marginBottom: 8,},
  row: {flexDirection: 'row', marginBottom: 12,},
  scrollView: {flex: 1,},
  section: { marginVertical: 8, padding: 12, borderRadius: 8,},
  screenBg: { flex:1, backgroundColor:colors.background },
  separator: { height:1, backgroundColor:colors.gray , marginLeft:16 },
  status: { marginTop: 6, fontSize: 12, fontWeight: '600' },
  subtitle: { fontSize: 20, fontWeight: "600", color: "#666", marginBottom: 8, },
  title: { fontSize: 32, textAlign: "center",marginTop:13, marginBottom: 24,color: colors.primary, fontWeight: "500" },
  textBase: { fontSize: 16, color:colors.text , lineHeight: 24, marginBottom: 8,},
  thumb: { width: 72, height: 72, borderRadius: 6, backgroundColor: colors.gray },
  value: { color: colors.primary },
  welcome: { fontSize: 28, marginBottom: 8, marginTop: 40, color: colors.text },  
  web:       { flex: 1 },
});
      
}