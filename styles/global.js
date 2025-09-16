// src/styles/globals.js
import { StyleSheet } from "react-native"

export const colors = { primary: "#0868cfff", danger: "#FF3B30", gray: "#ccc", background: "#fff", text: "#333" };
export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };
export const fonts = {
  title: { fontSize: 32, fontWeight: "bold"},
  body: { fontSize: 16 } };
export default StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#fff", alignItems: "center", 
    textAlign: "center"},
  title: { fontSize: 32, textAlign: "center",marginTop:13, marginBottom: 24, color: "#274bb1ff", fontWeight: "500" },
  input: { width: "58%", height:35, borderColor: "#ced0d6ff", borderWidth: 1, borderRadius: 4, textAlignVertical: 
    "center", 
    textAlign: "lefts", paddingHorizontal: 11, paddingVertical: 8, marginBottom: 12, color:"#333", backgroundColor: "#fff"},
  button: { marginTop:10, marginVertical: 8, backgroundColor: "#274bb1ff", paddingVertical: 12, paddingHorizontal: 24, 
    borderRadius: 4,marginBottom: 9 },
  buttonText: { color: "#fff", textAlign: "center", fontSize: 16 },
  link: { color: "#274bb1ff", textAlign: "center", marginTop: 8},
  welcome: { fontSize: 28, marginBottom: 8, marginTop: 40, },
  email: { fontSize: 16, color: "#666", marginBottom: 24},
  subtitle: { fontSize: 20, fontWeight: "600", color: "#666", marginBottom: 8, },
  linkText: { fontSize: 16, color: "#007AFF", textDecorationLine: "underline", },
  muted: { fontSize: 14, color: "#999",},
  textBase: { fontSize: 16, color: "#fd0707ff", lineHeight: 24, fontFamily: "System", marginBottom: 8,},
  crow: { flexDirection: "row", alignItems: "center", marginBottom: 12, },
  passwordContainer: { flexDirection: 'row', alignItems: 'center', width: '58%', height: 35, borderWidth: 1, 
    borderColor: '#ccc', borderRadius: 4, paddingHorizontal: 8, marginBottom: 15,  },
  passwordInput: { flex: 1, color: '#333', textAlign: 'left', textAlignVertical: 'center', },
  iconButton: { padding: 8, },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 16,},
  field: { marginBottom: 12 },
  label: { fontWeight: "bold", fontSize: 14, color: "#555",},
  value: { fontSize: 16, color: "#011241ff", },
  image: { width: '100%', height: 200, borderRadius: 8, marginBottom: 12, },
  paragraph: { fontSize: 16, lineHeight: 22, marginBottom: 12, width: '88%'},
  box: { padding: 16, backgroundColor: '#f2f2f2', borderRadius: 6,  marginBottom: 12, },
  containerScroll: {padding: 16 }, 
  cuadra:    { padding:8, backgroundColor:'#eee', fontWeight:'bold', },
  item:      { padding:16 },
  itemText:  { fontSize:16 },
  separator: { height:1, backgroundColor:'#ddd', marginLeft:16 },
  backButton: { marginTop: 13, paddingVertical: 8, paddingHorizontal: 15, borderRadius: 6, alignSelf: "flex-start", },
   header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, 
    borderBottomColor: '#eee' },
  // Si no usas SafeAreaView, puedes hacer paddingTop manual: // paddingTop: Platform.OS === 'android' ? 20 : 0,
  map: { width: '80%', height: 300, marginVertical: 12, borderRadius: 6 ,alignSelf: 'center', },
  heading: { fontSize: 22, fontWeight: '600', marginBottom: 12 },
  formContent: { padding: 16, flexGrow: 1, alignItems: 'stretch', borderRadius: 8},
  row: {flexDirection: 'row', marginBottom: 12,},
  logoutButton: { marginTop: 32, padding: 12, backgroundColor: '#FF3B30', borderRadius: 6, alignItems: 'center',},

});
      
