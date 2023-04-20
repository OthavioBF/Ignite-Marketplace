import { HStack, Image, VStack, Heading, Text, Icon } from 'native-base';
import { Entypo } from '@expo/vector-icons';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { ExercisesDTO } from '../dtos/ExerciseDTO';
import { api } from '../services/api';

type ExerciseProps = TouchableOpacityProps & {
  data: ExercisesDTO;
};

export function ExerciseCard({ data, ...rest }: ExerciseProps) {
  return (
    <TouchableOpacity {...rest}>
      <HStack
        bg='gray.500'
        alignItems='center'
        p={2}
        pr={4}
        rounded='md'
        mb={3}
      >
        <Image
          source={{
            uri: `${api.defaults.baseURL}/exercise/thumb/${data.thumb}`,
          }}
          defaultSource={{
            uri: `${api.defaults.baseURL}/exercise/thumb/${data.thumb}`,
          }}
          w={16}
          h={16}
          mr={4}
          rounded='md'
          resizeMode='cover'
          alt='Imagem do exercicio'
        />

        <VStack flex={1}>
          <Heading
            fontSize='lg'
            fontFamily='heading'
            color='white'
            numberOfLines={1}
          >
            {data.name}
          </Heading>
          <Text
            fontSize='md'
            color='gray.200'
          >
            {data.series} sets x {data.repetitions} repeticoes
          </Text>
        </VStack>

        <Icon
          as={Entypo}
          name='chevron-thin-right'
          color='gray.300'
        />
      </HStack>
    </TouchableOpacity>
  );
}
