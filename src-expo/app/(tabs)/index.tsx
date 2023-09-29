import { StyleSheet } from 'react-native';

import EditScreenInfo from '../../components/EditScreenInfo';
import { Text, View } from '../../components/Themed';
import { rspc } from '../../utils/rspc';
import { useJwtStore } from '../../utils/store';

export default function TabOneScreen() {

  console.log(useJwtStore.getState().jwt)
  const {isLoading, data:links} = rspc.useQuery(['links.getByUser'], {
    enabled: useJwtStore.getState().jwt !== null,
  })

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab One</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      {isLoading ? <Text>Loading...</Text> : <Text>{JSON.stringify(links)}</Text>}
      <EditScreenInfo path="app/(tabs)/index.tsx" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
