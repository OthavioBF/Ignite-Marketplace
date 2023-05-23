import { HStack, VStack, Text, Image, Icon, Heading } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import { Plus } from "phosphor-react-native";

import defaultUserPhotoImg from "../assets/userPhotoDefault.png";
import { useAuth } from "../hooks/useAuth";
import { api } from "../services/api";
import { Button } from "./Button";
import { useNavigation } from "@react-navigation/native";
import { AppNavigatorStackRoutesProps } from "../routes/app.routes";

export function HomeHeader() {
  const { user, signOut } = useAuth();

  const { navigate } = useNavigation<AppNavigatorStackRoutesProps>();

  return (
    <HStack bg="gray.200" pt={16} pb={5} alignItems="center">
      <Image
        source={
          user.avatar
            ? { uri: `${api.defaults.baseURL}/avatar/${user.avatar}` }
            : defaultUserPhotoImg
        }
        h={12}
        w={12}
        rounded="full"
        borderWidth={2}
        borderColor="gray.400"
        alt="Imagem do usuario"
        mr={2}
      />
      <VStack flex={1}>
        <Text color="gray.700" fontSize="md">
          Boas vindas,
        </Text>
        <Heading color="gray.700" fontSize="md" fontFamily="heading">
          Othavio!
        </Heading>
      </VStack>

      <Button
        title="Criar anúncio"
        background="gray.700"
        color="gray.100"
        onPress={() => navigate("CreateAnnouncement")}
        flex={1}
        leftIcon={<Plus color="#F7F7F8" weight="bold" size={16} />}
      ></Button>
    </HStack>
  );
}
