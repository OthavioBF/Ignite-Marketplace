import {
  Heading,
  HStack,
  Icon,
  VStack,
  Text,
  Image,
  Box,
  ScrollView,
  useToast,
} from 'native-base';
import { TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

import { AppNavigatorRoutesProps } from '../routes/app.routes';
import BodySvg from '../assets/body.svg';
import SeriesSvg from '../assets/series.svg';
import RepetitionsSvg from '../assets/repetitions.svg';
import { Button } from '../components/Button';
import { AppError } from '../utils/AppError';
import { api } from '../services/api';
import { useEffect, useState } from 'react';
import { ExercisesDTO } from '../dtos/ExerciseDTO';
import { Loading } from '../components/Loading';

type RouteParams = {
  exerciseId: string;
};

export function Exercise() {
  const [isLoading, setIsLoading] = useState(true);
  const [markAsFinished, setMarkAsFinished] = useState(false);
  const [exercise, setExercise] = useState<ExercisesDTO>({} as ExercisesDTO);

  const { goBack, navigate } = useNavigation<AppNavigatorRoutesProps>();
  const route = useRoute();
  const toast = useToast();

  const { exerciseId } = route.params as RouteParams;

  async function fetchExerciseDetails() {
    try {
      setIsLoading(true);

      const response = await api.get(`/exercises/${exerciseId}`);

      setExercise(response.data);
    } catch (error) {
      const isAppError = error instanceof AppError;

      const title = isAppError
        ? error.message
        : 'Error ao carregar as informacoes do exercicio';

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleMarkAsFinished() {
    try {
      setMarkAsFinished(true);

      await api.post('/history', { exercise_id: exerciseId });

      navigate('home');

      toast.show({
        title: 'Exercicio concluido com sucesso',
        placement: 'top',
        bgColor: 'green.700',
      });
    } catch (error) {
      const isAppError = error instanceof AppError;

      const title = isAppError
        ? error.message
        : 'Erro ao marcar como finalizado';

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      });
    } finally {
      setMarkAsFinished(false);
    }
  }

  useEffect(() => {
    fetchExerciseDetails();
  }, [exerciseId]);

  return (
    <VStack flex={1}>
      <VStack
        px={8}
        bg='gray.600'
        pt={12}
      >
        <TouchableOpacity onPress={goBack}>
          <Icon
            as={Feather}
            name='arrow-left'
            color='yellow.500'
            size={6}
          />
        </TouchableOpacity>

        <HStack
          justifyContent='space-between'
          mt={4}
          mb={8}
          alignItems='center'
        >
          <Heading
            color='gray.100'
            fontSize='lg'
            fontFamily='heading'
            flexShrink={1}
          >
            {exercise.name}
          </Heading>
          <HStack alignItems='center'>
            <BodySvg />
            <Text color='gray.100'>{exercise.group}</Text>
          </HStack>
        </HStack>
      </VStack>
      {isLoading ? (
        <Loading />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <VStack p={8}>
            <Box
              rounded='lg'
              mb={3}
              overflow='hidden'
            >
              <Image
                w='full'
                h={80}
                source={{
                  uri: `${api.defaults.baseURL}/exercise/demo/${exercise.demo}}`,
                }}
                alt='Imagem'
                resizeMode='cover'
                rounded='lg'
              />
            </Box>

            <Box
              bg='gray.500'
              rounded='md'
              pb={4}
              px={4}
            >
              <HStack
                alignItems='center'
                justifyContent='space-around'
                mb={6}
                mt={5}
              >
                <HStack alignItems='center'>
                  <SeriesSvg />
                  <Text
                    color='gray.200'
                    ml={2}
                  >
                    {exercise.series} sets
                  </Text>
                </HStack>
                <HStack alignItems='center'>
                  <RepetitionsSvg />
                  <Text
                    color='gray.200'
                    ml={2}
                  >
                    {exercise.repetitions} repeticoes
                  </Text>
                </HStack>
              </HStack>

              <Button
                title='Marcar como finalizado'
                isLoading={markAsFinished}
              />
            </Box>
          </VStack>
        </ScrollView>
      )}
    </VStack>
  );
}
