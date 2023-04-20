import { HStack, VStack, Text, Image, Icon, Heading } from 'native-base';
import { TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import defaultUserPhotoImg from '../assets/userPhotoDefault.png';
import { useAuth } from '../hooks/useAuth';
import { api } from '../services/api';

export function HomeHeader() {
  const { user, signOut } = useAuth();
  return (
    <HStack
      bg='gray.600'
      pt={16}
      pb={5}
      px={8}
      alignItems='center'
    >
      <Image
        source={
          user.avatar
            ? { uri: `${api.defaults.baseURL}/avatar/${user.avatar}` }
            : defaultUserPhotoImg
        }
        h={16}
        w={16}
        rounded='full'
        borderWidth={2}
        borderColor='gray.400'
        alt='Imagem do usuario'
        mr={4}
      />
      <VStack flex={1}>
        <Text
          color='gray.100'
          fontSize='md'
        >
          Ola,
        </Text>
        <Heading
          color='gray.100'
          fontSize='md'
          fontFamily='heading'
        >
          {user.name}
        </Heading>
      </VStack>

      <TouchableOpacity onPress={signOut}>
        <Icon
          as={MaterialIcons}
          name='logout'
          color='gray.200'
          size={7}
        />
      </TouchableOpacity>
    </HStack>
  );
}
