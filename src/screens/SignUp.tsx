import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  VStack,
  Image,
  Text,
  Center,
  Heading,
  ScrollView,
  useToast,
  Icon,
  View,
  Pressable,
} from "native-base";
import * as Yup from "yup";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { MaterialIcons } from "@expo/vector-icons";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import { PencilSimpleLine, User } from "phosphor-react-native";

import LogoSVG from "../assets/Logo.png";

import { Button } from "../components/Button";
import { Input } from "../components/Input";
import defaultUserPhotoImg from "../assets/Avatar.png";

import { api } from "../services/api";

import { AppError } from "../utils/AppError";
import { useAuth } from "../hooks/useAuth";
import { TouchableOpacity } from "react-native";
import { AuthNavigatorRoutesProps } from "../routes/auth.routes";

type FormDataProps = {
  name: string;
  email: string;
  tel: string;
  password: string;
  confirmPassword: string;
};

const schema = Yup.object({
  name: Yup.string().required("Nome obrigatorio"),
  email: Yup.string().required("Email obrigatorio").email("Email invalido"),
  tel: Yup.string().required("Telefone obrigatorio"),
  password: Yup.string()
    .required("Senha obrigatorio")
    .min(6, "A senha deve ter pelo menos 6 digitos")
    .uppercase("A senha deve ter pelo menos 1 letra maiuscula"),
  confirmPassword: Yup.string()
    .required("Confirme a senha")
    .oneOf([Yup.ref("password")], "A confirmacao da senha nao confere"),
});

export function SignUp() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userAvatar, setUserAvatar] = useState("");
  const [userAvatarFormData, setUserAvatarFormData] = useState({});

  const { user, signIn, updateUserProfile } = useAuth();
  const { goBack, navigate } = useNavigation<AuthNavigatorRoutesProps>();

  const toast = useToast();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataProps>({
    resolver: yupResolver(schema),
  });

  async function handleSignUp({ name, email, tel, password }: FormDataProps) {
    console.log("entrei aqui", name);

    try {
      setIsLoading(true);
      const response = await api.post(
        "/users",
        {
          name,
          email,
          tel,
          password,
          userAvatarFormData,
        },
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log("response", response);

      navigate("signIn");

      toast.show({
        title: "Usuario criado com sucesso",
        placement: "top",
        bgColor: "green.500",
      });
    } catch (error) {
      setIsLoading(false);

      const isAppError = error instanceof AppError;

      const title = isAppError
        ? error.message
        : "Error ao cadastrar, tente mais tarde";

      console.log(error);

      toast.show({
        title,
        placement: "top",
        bgColor: "red.500",
      });
    }
  }

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

        setUserAvatarFormData(uploadUserPhotoForm);
        setUserAvatar(selectedPhoto.assets[0].uri);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <VStack flex={1} bg="gray.200" pb={8} px={8}>
        <Center mt={16} mb={6}>
          <Image
            source={LogoSVG}
            defaultSource={LogoSVG}
            alt="background"
            resizeMode="contain"
            position="absolute"
            h={12}
            w={16}
          />
        </Center>

        <Center mb={8}>
          <Heading color="gray.700" fontSize="4xl" fontFamily="heading">
            Boas vindas!
          </Heading>

          <Text
            fontSize="md"
            color="gray.600"
            alignItems="center"
            textAlign="center"
          >
            Crie sua conta e use o espaço para comprar itens variados e vender
            seus produtos
          </Text>
        </Center>
        <Center mb={4}>
          <Image
            source={userAvatar ? { uri: `${userAvatar}` } : defaultUserPhotoImg}
            w={20}
            h={20}
            bg="gray.300"
            resizeMode="contain"
            borderWidth={4}
            borderColor="blue.500"
            rounded="full"
            alt="Foto de perfil do usuario"
            mb={4}
          />
          <View
            bg="blue.500"
            rounded="full"
            mt={-12}
            ml={16}
            h={10}
            w={10}
            alignItems="center"
            justifyContent="center"
          >
            <TouchableOpacity onPress={handleSelectUserPhoto}>
              <PencilSimpleLine size={16} color="#EDECEE" />
            </TouchableOpacity>
          </View>
        </Center>

        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="Nome"
              onChangeText={onChange}
              value={value}
              errorMessage={errors.name?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="E-mail"
              keyboardType="email-address"
              onChangeText={onChange}
              value={value}
              errorMessage={errors.email?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="tel"
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="Telefone"
              onChangeText={onChange}
              value={value}
              errorMessage={errors.password?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="Senha"
              onChangeText={onChange}
              value={value}
              type={showPassword ? "text" : "password"}
              InputRightElement={
                <Pressable onPress={() => setShowPassword(!showPassword)}>
                  <Icon
                    as={
                      <MaterialIcons
                        name={showPassword ? "visibility" : "visibility-off"}
                      />
                    }
                    size={5}
                    mr="2"
                    color="gray.300"
                  />
                </Pressable>
              }
              errorMessage={errors.password?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="Confirme a senha"
              onChangeText={onChange}
              value={value}
              onSubmitEditing={handleSubmit(handleSignUp)}
              returnKeyType="send"
              type={showConfirmPassword ? "text" : "password"}
              InputRightElement={
                <Pressable
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Icon
                    as={
                      <MaterialIcons
                        name={
                          showConfirmPassword ? "visibility" : "visibility-off"
                        }
                      />
                    }
                    size={5}
                    mr="2"
                    color="gray.300"
                  />
                </Pressable>
              }
              errorMessage={errors.confirmPassword?.message}
            />
          )}
        />

        <Button
          title="Criar"
          background="gray.700"
          mt={2}
          onPress={handleSubmit(handleSignUp)}
        />

        <VStack mt={12} mb={4}>
          <Text mb={4} alignSelf="center">
            Ja tem uma conta?
          </Text>

          <Button
            title="Ir para login"
            background="gray.300"
            color="gray.600"
            variant="outline"
            onPress={goBack}
          />
        </VStack>
      </VStack>
    </ScrollView>
  );
}
