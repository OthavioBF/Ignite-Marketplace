import { useCallback, useEffect, useRef, useState } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
  VStack,
  HStack,
  FlatList,
  Text,
  Heading,
  useToast,
  Box,
  Pressable,
  Divider,
} from "native-base";
import { useForm, Controller } from "react-hook-form";

import { ProductCard } from "../components/ProductCard";
import { Group } from "../components/Group";
import { HomeHeader } from "../components/HomeHeader";
import { AppNavigatorRoutesProps } from "../routes/app.routes";
import { api } from "../services/api";
import { AppError } from "../utils/AppError";
import { ProductsDTO } from "../dtos/ExerciseDTO";
import { Loading } from "../components/Loading";
import {
  ArrowRight,
  Faders,
  MagnifyingGlass,
  Tag,
} from "phosphor-react-native";
import { Input } from "../components/Input";
import { FilterModal } from "../components/FilterModal";
import { Modalize } from "react-native-modalize";

export function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [group, setGroup] = useState<string[]>();
  const [exercise, setExercise] = useState<ProductsDTO[]>([]);
  const [groupSelected, setGroupSelected] = useState("costas");

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

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

  async function fetchProductByFilter() {
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

  function handleSearch() {}

  function handleOpenFilterModal(event: any) {
    event.nativeEvent.persist();
    setOpenModal(true);
  }

  useEffect(() => {
    loadGroups();
    fetchProductByFilter();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchProductByFilter();
    }, [groupSelected])
  );

  return (
    <VStack flex={1} bg="gray.200" px={6}>
      <HomeHeader />

      <Text mt={3} mb={3}>
        Seus produtos anunciados para venda
      </Text>
      <HStack
        bg="blue.300"
        px={4}
        py={3}
        alignItems="center"
        rounded={6}
        mb={8}
      >
        <Tag />
        <VStack ml={4} mr={16}>
          <Heading>4</Heading>
          <Text>anúncios ativos</Text>
        </VStack>

        <HStack>
          <Text color="blue.700" mr={2}>
            Meus anúncios
          </Text>
          <ArrowRight color="#364D9D" size={16} />
        </HStack>
      </HStack>

      <Text mb={3}>Compre produtos variados</Text>
      <Controller
        control={control}
        name="confirmPassword"
        render={({ field: { onChange, value } }) => (
          <Input
            placeholder="Buscar anúncio"
            onChangeText={onChange}
            value={value}
            InputRightElement={
              <>
                <Pressable onPress={() => handleSearch()}>
                  <MagnifyingGlass weight="bold" size={20} color="#3E3A40" />
                </Pressable>
                <Divider orientation="vertical" mx={4} h={4} color="gray.400" />
                <Pressable onPress={(e) => handleOpenFilterModal(e)} mr={4}>
                  <Faders weight="bold" size={20} color="#3E3A40" />
                </Pressable>
              </>
            }
          />
        )}
      />

      <FilterModal open={openModal} />

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
          mt={4}
        >
          <ProductCard onPress={() => navigate("AnnouncementDetails")} />
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
