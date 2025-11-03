// app/lavador/perfil.js
import { useRouter } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import PerfilShared from "../../src/components/PerfilShared";
import useUserData from "../../src/hooks/useUserData";
import useGlobalStyles from "../../styles/global";

export default function PerfilLavador() {
  const styles = useGlobalStyles();
  const router = useRouter();
  const { user, loading } = useUserData("lavador");

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" />;
   const lavadorProps = {
    ...user,
    activeRequests: user.activeRequests ?? user.ongoing ?? 0,
    completed: user.completed ?? user.finished ?? 0,
  };

  return (
    <View style={styles.container}>
      <View style={{ width: "100%", maxWidth: 720, alignSelf: "center" }}>
        <PerfilShared
          user={lavadorProps}
          role="lavador"
          onEdit={() => router.push("/lavador/ajustes")}
        />
      </View>
    </View>
  );
}