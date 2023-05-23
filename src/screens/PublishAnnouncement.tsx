import { useState } from "react";
import {
  VStack,
  ScrollView,
  Image,
  Center,
  Skeleton,
  Text,
  useToast,
  Box,
  HStack,
  Badge,
  Heading,
} from "native-base";
import { Alert, TouchableOpacity } from "react-native";

import {
  ArrowLeft,
  Tag,
  Bank,
  Barcode,
  CreditCard,
  Money,
  QrCode,
} from "phosphor-react-native";
import { SliderBox } from "react-native-image-slider-box";

import { Controller, useForm } from "react-hook-form";
import defaultUserPhotoImg from "../assets/userPhotoDefault.png";
import * as Yup from "yup";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";

import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { ScreenHeader } from "../components/ScreenHeader";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "../hooks/useAuth";
import { api } from "../services/api";
import { AppError } from "../utils/AppError";
import bikeImg from "../assets/bike.png";
import { useNavigation } from "@react-navigation/native";
import { AppNavigatorStackRoutesProps } from "../routes/app.routes";

type FormDataProps = {
  name: string;
  email: string;
  password: string;
  old_password: string;
  confirm_password: string;
};

export function PublishAnnouncement() {
  const [userPhoto, setUserPhoto] = useState(
    "https://github.com/OthavioBF.png"
  );
  const [isLoading, setIsLoading] = useState(false);

  const images = [bikeImg, bikeImg, bikeImg, bikeImg, bikeImg];

  const { goBack, navigate } = useNavigation<AppNavigatorStackRoutesProps>();
  const toast = useToast();
  const { user, updateUserProfile } = useAuth();

  async function handleSelectUserPhoto() {
    setIsLoading(true);
    try {
      const selectedPhoto = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true,
      });

      if (selectedPhoto.canceled) return;

      if (selectedPhoto.assets[0].uri) {
        const photoInfo = await FileSystem.getInfoAsync(
          selectedPhoto.assets[0].uri
        );

        if (photoInfo.exists && photoInfo.size / 1024 / 1024 > 5) {
          return toast.show({
            title: "Essa imagem e muito grande. Escolha uma de ate 5MB",
            placement: "top",
            bgColor: "red.500",
          });
        }

        const fileExtension = selectedPhoto.assets[0].uri.split(".").pop();

        const photoFile = {
          name: `${user.name}.${fileExtension}}`.toLowerCase(),
          uri: selectedPhoto.assets[0].uri,
          type: `${selectedPhoto.assets[0].type}/${fileExtension}`,
        } as any;

        const uploadUserPhotoForm = new FormData();
        uploadUserPhotoForm.append("avatar", photoFile);

        const response = await api.patch("/users/avatar", uploadUserPhotoForm, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        user.avatar = response.data.avatar;
        updateUserProfile(user);
        setUserPhoto(selectedPhoto.assets[0].uri);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleUpdateProfile(data: FormDataProps) {
    try {
      setIsLoading(true);

      user.name = data.name;

      await api.put(`/users`, data);

      await updateUserProfile(user);

      toast.show({
        title: "Perfil atualizado com sucesso",
        placement: "top",
        bgColor: "red.500",
      });
    } catch (error) {
      const isAppError = error instanceof AppError;

      const title = isAppError
        ? error.message
        : "Nao foi possivel atualizar os dados, tente novamente mais tarde";

      toast.show({
        title,
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <VStack flex={1}>
      <VStack pt={16} px={6} pb={4} bg="blue.500">
        <Center>
          <Heading fontSize="md" color="gray.100">
            Pré visualização do anúncio
          </Heading>
          <Text fontSize="sm" color="gray.100">
            É assim que seu produto vai aparecer!
          </Text>
        </Center>
      </VStack>
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

      <HStack
        h={24}
        bg="gray.100"
        px={6}
        alignItems="center"
        justifyContent="space-between"
        space={3}
      >
        <Button
          title="Voltar e editar"
          color="gray.600"
          borderRadius={6}
          background="gray.300"
          leftIcon={<ArrowLeft size={16} color="#3E3A40" />}
          onPress={goBack}
        ></Button>

        <Button
          title="Publicar"
          color="gray.100"
          borderRadius={6}
          background="blue.500"
          leftIcon={<Tag size={16} color="#F7F7F8" />}
          onPress={() => navigate("TabRoutes")}
        ></Button>
      </HStack>
    </VStack>
  );
}
