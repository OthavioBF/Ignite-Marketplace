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
  AspectRatio,
  Badge,
} from "native-base";
import { TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SliderBox } from "react-native-image-slider-box";
import { Ionicons } from "@expo/vector-icons";

import {
  Bank,
  Barcode,
  CreditCard,
  Money,
  Power,
  QrCode,
  Trash,
  TrashSimple,
} from "phosphor-react-native";
import defaultUserPhotoImg from "../assets/userPhotoDefault.png";
// import { AppNavigatorRoutesProps } from "../routes/app.routes";
import BodySvg from "../assets/body.svg";
import SeriesSvg from "../assets/series.svg";
import RepetitionsSvg from "../assets/repetitions.svg";
import { AppError } from "../utils/AppError";
import { api } from "../services/api";
import { useEffect, useState } from "react";
import { ProductsDTO } from "../dtos/ExerciseDTO";
import { Loading } from "../components/Loading";
import bikeImg from "../assets/bike.png";
import { Button } from "../components/Button";

type RouteParams = {
  exerciseId: string;
};

export function AnnouncementDetails() {
  const [isLoading, setIsLoading] = useState(true);
  const [isDisabled, setIsDisable] = useState(false);
  const [markAsFinished, setMarkAsFinished] = useState(false);
  // const [exercise, setExercise] = useState<ExercisesDTO>({} as ExercisesDTO);
  const images = [bikeImg, bikeImg, bikeImg, bikeImg, bikeImg];

  const { goBack, navigate } = useNavigation<AppNavigatorRoutesProps>();
  const route = useRoute();
  const toast = useToast();

  // const { exerciseId } = route.params as RouteParams;

  async function fetchExerciseDetails() {
    try {
      setIsLoading(true);

      const response = await api.get(`/exercises/${exerciseId}`);

      setExercise(response.data);
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

  async function handleMarkAsFinished() {
    try {
      setMarkAsFinished(true);

      await api.post("/history", { exercise_id: exerciseId });

      navigate("home");

      toast.show({
        title: "Exercicio concluido com sucesso",
        placement: "top",
        bgColor: "green.700",
      });
    } catch (error) {
      const isAppError = error instanceof AppError;

      const title = isAppError
        ? error.message
        : "Erro ao marcar como finalizado";

      toast.show({
        title,
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setMarkAsFinished(false);
    }
  }

  // useEffect(() => {
  //   fetchExerciseDetails();
  // }, [exerciseId]);

  return (
    <VStack flex={1}>
      <VStack px={6} pt={12} pb={3}>
        <TouchableOpacity onPress={goBack}>
          <Icon as={Feather} name="arrow-left" color="gray.700" size={6} />
        </TouchableOpacity>
      </VStack>
      {/* {isLoading ? (
        <Loading />
      ) : ( */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <VStack flex={1} pb={6}>
          <Box rounded="lg" mb={3} overflow="hidden">
            <SliderBox
              images={images}
              sliderBoxHeight={280}
              dotColor="#F7F7F8"
              inactiveDotColor="#F7F7F8"
              paginationBoxVerticalPadding={20}
              resizeMethod={"resize"}
              resizeMode="contain"
              dotStyle={{
                width: 10,
                height: 10,
                borderRadius: 5,

                backgroundColor: "rgba(128, 128, 128, 0.92)",
              }}
              ImageComponentStyle={{
                width: "100%",
                paddingHorizontal: 10,
              }}
            />
          </Box>
          <VStack px={6}>
            <HStack mb={6} space={2} alignItems="center">
              <Image
                source={defaultUserPhotoImg}
                h={6}
                w={6}
                rounded="full"
                borderWidth={2}
                borderColor="gray.100"
                alt="Imagem do usuario"
                mr={2}
              />
              <Text>Makenna Baptista</Text>
            </HStack>

            <VStack mb={6}>
              <Badge
                w={12}
                rounded="full"
                bg="gray.300"
                _text={{ color: "gray.600" }}
                mb={2}
              >
                NOVO
              </Badge>

              <HStack alignItems="center" justifyContent="space-between" mb={2}>
                <Heading fontSize="lg">Bicicleta</Heading>
                <HStack alignItems="center">
                  <Text color="blue.500" fontFamily="heading" fontSize="sm">
                    R$
                  </Text>
                  <Heading color="blue.500" fontSize="lg">
                    120,00
                  </Heading>
                </HStack>
              </HStack>

              <Text fontSize="sm">
                Cras congue cursus in tortor sagittis placerat nunc, tellus
                arcu. Vitae ante leo eget maecenas urna mattis cursus. Mauris
                metus amet nibh mauris mauris accumsan, euismod. Aenean leo
                nunc, purus iaculis in aliquam.
              </Text>
            </VStack>

            <HStack mb={4} alignItems="center" space={2}>
              <Heading fontSize="sm">Aceita troca?</Heading>
              <Text fontSize="sm">Sim</Text>
            </HStack>

            <VStack space={2}>
              <Heading fontSize="sm">Meios de pagamento:</Heading>
              <VStack space={1}>
                <HStack alignItems="center" space={2}>
                  <Barcode />
                  <Text color="gray.700">Boleto</Text>
                </HStack>
                <HStack alignItems="center" space={2}>
                  <QrCode />
                  <Text color="gray.700">Pix</Text>
                </HStack>
                <HStack alignItems="center" space={2}>
                  <Money />
                  <Text color="gray.700">Dinheiro</Text>
                </HStack>
                <HStack alignItems="center" space={2}>
                  <CreditCard />
                  <Text color="gray.700">Cartao de credito</Text>
                </HStack>
                <HStack alignItems="center" space={2}>
                  <Bank />
                  <Text color="gray.700">Deposito bancario</Text>
                </HStack>
              </VStack>
            </VStack>
          </VStack>
        </VStack>
      </ScrollView>
      {/* <HStack
        h={24}
        bg="gray.100"
        px={6}
        alignItems="center"
        justifyContent="space-between"
      >
        <HStack alignItems="center">
          <Text color="blue.500" fontFamily="heading" fontSize="sm">
            R$
          </Text>
          <Heading color="blue.500" fontSize="xl">
            120,00
          </Heading>
        </HStack>
        <Button
          w={40}
          h={12}
          borderRadius={6}
          background="blue.500"
          leftIcon={<Icon as={Ionicons} name="logo-whatsapp" />}
        >
          <Text color="gray.100">Entrar em contato</Text>
        </Button>
      </HStack> */}
      <VStack h={32} space={2} px={6} pb={6}>
        <Button
          title={isDisabled ? "Reativar anúncio" : "Desativar anúncio"}
          color="gray.100"
          borderRadius={6}
          background={isDisabled ? "blue.500" : "gray.700"}
          leftIcon={<Power size={16} color="#F7F7F8" />}
          onPress={goBack}
        />

        <Button
          title="Excluir anúncio"
          color="gray.600"
          borderRadius={6}
          background="gray.300"
          leftIcon={<TrashSimple size={16} color="#3E3A40" />}
          onPress={() => navigate("TabRoutes")}
        />
      </VStack>
      {/* )} */}
    </VStack>
  );
}
