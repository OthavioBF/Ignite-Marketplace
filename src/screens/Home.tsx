import { useCallback, useEffect, useState } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { VStack, HStack, FlatList, Text, Heading, useToast } from "native-base";

import { ExerciseCard } from "../components/ExerciseCard";
import { Group } from "../components/Group";
import { HomeHeader } from "../components/HomeHeader";
import { AppNavigatorRoutesProps } from "../routes/app.routes";
import { api } from "../services/api";
import { AppError } from "../utils/AppError";
import { ExercisesDTO } from "../dtos/ExerciseDTO";
import { Loading } from "../components/Loading";

export function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [group, setGroup] = useState<string[]>();
  const [exercise, setExercise] = useState<ExercisesDTO[]>([]);
  const [groupSelected, setGroupSelected] = useState("costas");

  const { navigate } = useNavigation<AppNavigatorRoutesProps>();

  const toast = useToast();

  async function loadGroups() {
    try {
      const response = await api.get("/groups");

      setGroup(response.data);
    } catch (error) {
      const isAppError = error instanceof AppError;

      const title = isAppError
        ? error.message
        : "Error ao cadastrar, tente mais tarde";

      toast.show({
        title,
        placement: "top",
        bgColor: "red.500",
      });
    }
  }

  async function fetchExercisesByCategorie() {
    try {
      setIsLoading(true);

      const response = await api.get(`/exercises/bygroup/${groupSelected}`);

      setGroup(response.data);
    } catch (error) {
      const isAppError = error instanceof AppError;

      const title = isAppError
        ? error.message
        : "Error ao cadastrar, tente mais tarde";

      toast.show({
        title,
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadGroups();
    fetchExercisesByCategorie();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchExercisesByCategorie();
    }, [groupSelected])
  );

  return (
    <VStack>
      <HomeHeader />
      <FlatList
        data={group}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <Group
            name={item}
            isActive={
              groupSelected.toLocaleUpperCase() === item.toLocaleUpperCase()
            }
            onPress={() => setGroupSelected(item)}
          />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        _contentContainerStyle={{ px: 8 }}
        my={10}
        maxH={10}
        minH={10}
      />
      {isLoading ? (
        <Loading />
      ) : (
        <VStack px={8}>
          <HStack justifyContent="space-between" mb={5}>
            <Heading color="gray.200" fontSize="md" fontFamily="heading">
              Exercicios
            </Heading>
            <Text color="gray.200" fontSize="sm">
              {exercise.length}
            </Text>
          </HStack>

          <FlatList
            data={exercise}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ExerciseCard
                data={item}
                onPress={() => navigate("exercise", { exerciseId: item.id })}
              />
            )}
            showsVerticalScrollIndicator={false}
            _contentContainerStyle={{ paddingBottom: 10 }}
          />
        </VStack>
      )}
    </VStack>
  );
}
