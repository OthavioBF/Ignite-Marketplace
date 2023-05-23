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
  TextArea,
  Radio,
  Checkbox,
  Switch,
} from "native-base";
import { TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SliderBox } from "react-native-image-slider-box";

import defaultUserPhotoImg from "../assets/userPhotoDefault.png";
import { AppNavigatorStackRoutesProps } from "../routes/app.routes";
import BodySvg from "../assets/body.svg";
import SeriesSvg from "../assets/series.svg";
import RepetitionsSvg from "../assets/repetitions.svg";
import { Button } from "../components/Button";
import { AppError } from "../utils/AppError";
import { api } from "../services/api";
import { useEffect, useState } from "react";
import { ProductsDTO } from "../dtos/ExerciseDTO";
import { Loading } from "../components/Loading";
import bikeImg from "../assets/bike.png";
import { Plus } from "phosphor-react-native";
import { Input } from "../components/Input";

type RouteParams = {
  exerciseId: string;
};

const background = "gray.200";

export function CreateAnnouncement() {
  const [isLoading, setIsLoading] = useState(true);
  const [markAsFinished, setMarkAsFinished] = useState(false);
  const [checkBoxValue, setCheckBoxValue] = useState<string[]>([]);

  // const [exercise, setExercise] = useState<ExercisesDTO>({} as ExercisesDTO);

  const { goBack, navigate } = useNavigation<AppNavigatorStackRoutesProps>();
  const route = useRoute();
  const toast = useToast();

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
      <HStack
        px={6}
        pt={12}
        pb={3}
        justifyContent="space-between"
        alignItems="center"
      >
        <TouchableOpacity onPress={goBack}>
          <Icon as={Feather} name="arrow-left" color="gray.700" size={6} />
        </TouchableOpacity>

        <Heading fontSize="lg">Criar anuncio</Heading>

        <Box w={6} h={6} bg="gray.200"></Box>
      </HStack>
      {/* {isLoading ? (
        <Loading />
      ) : ( */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <VStack px={6} pb={6}>
          <Heading fontSize="md" mb={1}>
            Imagens
          </Heading>

          <Text fontSize="sm" mb={4}>
            Escolha até 3 imagens para mostrar o quando o seu produto é
            incrível!
          </Text>

          <Box
            rounded={6}
            mb={8}
            overflow="hidden"
            h={24}
            w={24}
            bg="gray.300"
            alignItems="center"
            justifyContent="center"
          >
            <Plus weight="bold" size={24} color="#9F9BA1" />
          </Box>

          <VStack space={4} mb={4}>
            <Heading fontSize="md">Sobre o produto</Heading>

            <Input placeholder="Título do anúncio" />

            <TextArea
              placeholder="Descrição do produto"
              placeholderTextColor="gray.400"
              color="gray.700"
              fontSize="md"
              autoCompleteType=""
              totalLines={10}
              h={40}
              maxH={40}
              px={4}
              py={3}
              bg="gray.100"
              borderColor="gray.100"
              _focus={{
                background: "gray.100",
                borderColor: "gray.500",
              }}
            />
          </VStack>

          <Radio.Group name="radio">
            <HStack space={5} mb={8}>
              <Radio
                value="novo"
                mx={2}
                bg="gray.200"
                borderColor="gray.400"
                _text={{ fontSize: 16, color: "gray.600" }}
                _checked={{ borderColor: "blue.500", color: "blue.500" }}
              >
                Produto novo
              </Radio>
              <Radio
                value="usado"
                mx={2}
                bg="gray.200"
                borderColor="gray.400"
                _text={{ fontSize: 16, color: "gray.600" }}
                _checked={{ borderColor: "blue.500", color: "blue.500" }}
              >
                Produto usado
              </Radio>
            </HStack>
          </Radio.Group>

          <VStack space={4}>
            <Heading fontSize="md">Venda</Heading>

            <Input
              placeholder="Valor do produto"
              InputLeftElement={
                <Text fontSize="md" ml={4}>
                  R$
                </Text>
              }
            />
          </VStack>

          <Switch
            size="lg"
            alignSelf="flex-start"
            mb={6}
            onTrackColor="blue.500"
          />

          <Heading fontSize="sm" mb={3}>
            Meios de pagamento aceitos
          </Heading>
          <Checkbox.Group
            defaultValue={checkBoxValue}
            onChange={(values) => setCheckBoxValue(values || [])}
            colorScheme="blue"
          >
            <Checkbox
              value="boleto"
              bg={background}
              _checked={{ borderColor: "blue.500", background: "blue.500" }}
              mb={3}
            >
              Boleto
            </Checkbox>
            <Checkbox
              value="pix"
              bg={background}
              mb={3}
              _checked={{ borderColor: "blue.500", background: "blue.500" }}
            >
              Pix
            </Checkbox>
            <Checkbox
              value="dinheiro"
              bg={background}
              mb={3}
              _checked={{ borderColor: "blue.500", background: "blue.500" }}
            >
              Dinheiro
            </Checkbox>
            <Checkbox
              value="cartaoCredito"
              bg={background}
              mb={3}
              _checked={{ borderColor: "blue.500", background: "blue.500" }}
            >
              Cartao de Credito
            </Checkbox>
            <Checkbox
              value="depositoBancario"
              bg={background}
              mb={3}
              _checked={{ borderColor: "blue.500", background: "blue.500" }}
            >
              Deposito Bancario
            </Checkbox>
          </Checkbox.Group>
        </VStack>
      </ScrollView>

      {/* )} */}
      <HStack
        h={24}
        bg="gray.100"
        px={6}
        alignItems="center"
        justifyContent="space-between"
        space={3}
      >
        <Button
          title="Cancelar"
          color="gray.600"
          borderRadius={6}
          background="gray.300"
          onPress={goBack}
        />

        <Button
          title="Avançar"
          color="gray.100"
          borderRadius={6}
          background="gray.700"
          onPress={() => navigate("PublishAnnouncement")}
        />
      </HStack>
    </VStack>
  );
}
