import { useCallback, useState } from "react";
import {
  SectionList,
  VStack,
  Heading,
  Text,
  useToast,
  HStack,
  Box,
  Select,
} from "native-base";
import { useFocusEffect } from "@react-navigation/native";

import { api } from "../services/api";

import { HistoryCard } from "../components/HistoryCard";
import { ScreenHeader } from "../components/ScreenHeader";
import { AppError } from "../utils/AppError";
import { HistoryByDate } from "../dtos/HistoryDTO";
import { Loading } from "../components/Loading";
import { Plus } from "phosphor-react-native";
import { ProductCard } from "../components/ProductCard";

export function MyAnnouncements() {
  const [history, setHistory] = useState<HistoryByDate[]>([]);
  const [selected, setSelected] = useState("todos");
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
        : "Error ao carregar as informacoes do exercicio";

      toast.show({
        title,
        placement: "top",
        bgColor: "red.500",
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
    <VStack px={6}>
      <HStack alignItems="center" justifyContent="space-between" mt={16} mb={8}>
        <Box h={6} w={6}></Box>

        <Heading>Meus anúncios</Heading>

        <Plus size={24} color="#1A181B" weight="bold" />
      </HStack>

      <HStack alignItems="center" justifyContent="space-between">
        <Text>9 anuncios</Text>

        <Select
          selectedValue={selected}
          minWidth="111"
          rounded={6}
          _text={{
            fontSize: "sm",
          }}
        >
          <Select.Item label="Todos" value="todos" />
          <Select.Item label="Ativos" value="ativo" />
          <Select.Item label="Inaativos" value="inativo" />
        </Select>
      </HStack>
      {/* {isLoading ? (
        <Loading />
      ) : ( */}
      <VStack>
        <Box
          display="flex"
          flex={1}
          flexDirection="row"
          flexWrap="wrap"
          justifyContent="space-between"
          mt={5}
        >
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
        </Box>

        {/* <FlatList
          data={exercise}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ProductCard
              data={item}
              onPress={() => navigate("exercise", { exerciseId: item.id })}
            />
          )}
          showsVerticalScrollIndicator={false}
          _contentContainerStyle={{ paddingBottom: 10 }}
        /> */}
      </VStack>
      {/* )} */}
    </VStack>
  );
}
