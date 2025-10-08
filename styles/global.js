// src/styles/globals.js
import { StyleSheet, useColorScheme } from "react-native";
const lightColors = { primary: "#0868cfff", danger:  "#FF3B30", gray:  "#ccc"  , background: "#fff", 
  text:    "#333",  grayinv:  "#555" }
const darkColors = { primary: "#274bb1ff", danger:  "#FF453AFF", gray:    "#555", background: "#000", 
  text:    "#eee",  grayinv:  "#ccc" }
export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };
export const fonts = {
  title: { fontSize: 32, fontWeight: "bold"},
  body: { fontSize: 16 } };
export default function useGlobalStyles() {
  const isDark = useColorScheme() === 'dark'
  const colors = isDark ? darkColors : lightColors

 return StyleSheet.create({
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 16,},
  backButton: { marginTop: 13, paddingVertical: 8, paddingHorizontal: 15, borderRadius: 6, alignSelf: "flex-start", color: colors.text },
  button: { marginTop:10, marginVertical: 8, backgroundColor: colors.primary , paddingVertical: 12, paddingHorizontal: 24, 
    borderRadius: 4,marginBottom: 9 },
  buttonText: { color: "#fff", textAlign: "center", fontSize: 16 },
  box: { padding: 16, backgroundColor: '#f2f2f2', borderRadius: 6,  marginBottom: 12, },
  crow: { flexDirection: "row", alignItems: "center", marginBottom: 12, },
  container: { flex: 1, backgroundColor: colors.background,justifyContent: "center", padding: 20, alignItems: "center",  textAlign: "center"},
  containerScroll: {padding: 18, backgroundColor: colors.background,flexGrow: 1, }, 
  currentLocButton: { position: 'absolute', top: 8, right: 8, backgroundColor: '#fff', borderRadius: 20, padding: 8, elevation: 3, shadowColor: '#000', shadowOpacity: 0.2, shadowOffset: { width: 0, height: 2 },},
  cuadra:    { padding:8, backgroundColor:colors.gray , fontWeight:'bold', },
  field: { marginBottom: 12 },
  formContent: { padding: 16, flexGrow: 1, alignItems: 'stretch', borderRadius: 8},
  heading: { fontSize: 22, fontWeight: '600', marginBottom: 12 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, 
    borderBottomColor: '#eee' },
  item:      { padding:16 },
  itemText:  { fontSize:16 },
  image: { width: '100%', height: 200, borderRadius: 8, marginBottom: 12, },
  iconButton: { padding: 8, },
  input: { width: "99%", height:8, borderColor:colors.gray, borderWidth: 1, borderRadius: 4, textAlignVertical: "center", 
    textAlign: "lefts", paddingHorizontal: 11, paddingVertical: 8, marginBottom: 12, color:colors.text, backgroundColor: colors.background},
  logoutButton: { marginTop: 32, padding: 12, backgroundColor: colors.danger, borderRadius: 6, alignItems: 'center',},
  locationButton: { backgroundColor: colors.gray, padding: 10, borderRadius: 8, alignSelf: 'center', marginBottom: 8, height: 50, justifyContent: 'center', },
  locationText: { color: colors.grayinv, fontWeight: 'bold',},
  linkText: { fontSize: 16, color: "#007AFF", textDecorationLine: "underline", },
  link: { color: "#274bb1ff", textAlign: "center", marginTop: 8},
  label: { fontWeight: "bold", fontSize: 14, color: colors.grayinv, marginTop: 12, fontSize: 18},
  map: { width: '80%', height: 300, marginVertical: 12, borderRadius: 6 ,alignSelf: 'center', },
  muted: { fontSize: 14, color: colors.gray ,},
  passwordContainer: { flexDirection: 'row', alignItems: 'center', width: '58%', height: 35, borderWidth: 1, 
    borderColor: '#ccc', borderRadius: 4, paddingHorizontal: 8, marginBottom: 15,  },
  passwordInput: { flex: 1, color: '#333', textAlign: 'left', textAlignVertical: 'center', },
  paragraph: { fontSize: 16, lineHeight: 22, marginBottom: 12, width: '88%'},
  pickerContainer: { borderWidth: 1, borderColor: colors.text, borderRadius: 6, overflow: 'hidden', backgroundColor: colors.background,},
  row: {flexDirection: 'row', marginBottom: 12,},
  scrollView: {flex: 1,},
  section: { marginVertical: 8, padding: 12, borderRadius: 8,},
  screenBg: { flex:1, backgroundColor:colors.background },
  separator: { height:1, backgroundColor:colors.gray , marginLeft:16 },
  subtitle: { fontSize: 20, fontWeight: "600", color: "#666", marginBottom: 8, },
  title: { fontSize: 32, textAlign: "center",marginTop:13, marginBottom: 24, color: colors.primary, fontWeight: "500" },
  textBase: { fontSize: 16, color:colors.text , lineHeight: 24, fontFamily: "System", marginBottom: 8,},
  value: { fontSize: 16, color: "#133fb9ff", },
  welcome: { fontSize: 28, marginBottom: 8, marginTop: 40, color: colors.text },  
  web:       { flex: 1 },
});
      
}