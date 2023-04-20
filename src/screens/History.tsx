import { useCallback, useState } from 'react';
import { SectionList, VStack, Heading, Text, useToast } from 'native-base';
import { useFocusEffect } from '@react-navigation/native';

import { api } from '../services/api';

import { HistoryCard } from '../components/HistoryCard';
import { ScreenHeader } from '../components/ScreenHeader';
import { AppError } from '../utils/AppError';
import { HistoryByDate } from '../dtos/HistoryDTO';
import { Loading } from '../components/Loading';

export function History() {
  const [history, setHistory] = useState<HistoryByDate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const toast = useToast();

  async function fetchHistory() {
    try {
      setIsLoading(true);

      const response = await api.get(`/history`);

      setHistory(response.data);
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

  useFocusEffect(
    useCallback(() => {
      fetchHistory();
    }, [])
  );
  return (
    <VStack>
      <ScreenHeader title='Historico de exercicios' />
      {isLoading ? (
        <Loading />
      ) : (
        <SectionList
          sections={history}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <HistoryCard data={item} />}
          renderSectionHeader={({ section }) => (
            <Heading
              color='gray.200'
              fontSize='md'
              fontFamily='heading'
              mt={10}
              mb={3}
            >
              {section.title}
            </Heading>
          )}
          px={8}
          contentContainerStyle={
            history.length === 0 && { flex: 1, justifyContent: 'center' }
          }
          ListEmptyComponent={() => (
            <Text>
              Nao ha exercicios registrados ainda.{'\n'} Vamos nos exercitar
              hoje
            </Text>
          )}
          showsVerticalScrollIndicator={false}
        />
      )}
    </VStack>
  );
}
