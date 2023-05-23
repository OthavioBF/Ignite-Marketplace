import {
  VStack,
  Image,
  Text,
  Center,
  Heading,
  ScrollView,
  useToast,
  Pressable,
  Icon,
} from "native-base";
import { useNavigation } from "@react-navigation/native";
import { useForm, Controller } from "react-hook-form";
import * as Yup from "yup";
import { MaterialIcons } from "@expo/vector-icons";
import { yupResolver } from "@hookform/resolvers/yup";

import LogoSVG from "../assets/Logo.png";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { AuthNavigatorRoutesProps } from "../routes/auth.routes";
import { useAuth } from "../hooks/useAuth";
import { AppError } from "../utils/AppError";
import { useState } from "react";

type FormDataProps = {
  email: string;
  password: string;
};

const schema = Yup.object({
  email: Yup.string().required("Email obrigatorio").email("Email invalido"),
  password: Yup.string()
    .required("Senha obrigatorio")
    .min(6, "A senha deve ter pelo menos 6 digitos")
    .uppercase("A senha deve ter pelo menos 1 letra maiuscula"),
});

export function SignIn() {
  const [isLoading, setIsloading] = useState(false);
  const [show, setShow] = useState(false);

  const { signIn } = useAuth();
  const { navigate } = useNavigation<AuthNavigatorRoutesProps>();
  const toast = useToast();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataProps>({
    resolver: yupResolver(schema),
  });

  async function handleSignIn({ email, password }: FormDataProps) {
    try {
      setIsloading(true);
      await signIn(email, password);
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

      setIsloading(false);
    }
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <VStack bg="gray.200" pb={20} px={12} roundedBottomLeft={10}>
        <Center mt={24} mb={6}>
          <Image
            source={LogoSVG}
            defaultSource={LogoSVG}
            alt="background"
            resizeMode="contain"
            position="absolute"
            mb={4}
          />
        </Center>

        <Center mb={24}>
          <Heading color="gray.700" fontSize="4xl" fontFamily="heading">
            marketplace
          </Heading>

          <Text fontSize="md" color="gray.500">
            Seu espaço de compra e venda
          </Text>
        </Center>
        <Center>
          <Heading color="gray.600" fontSize="sm" fontFamily="heading" mb={6}>
            Acesse sua conta
          </Heading>
        </Center>

        <Controller
          control={control}
          name="email"
          render={({
            field: { onChange, value = "desafio@rocketseat.com.br" },
          }) => (
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
          name="password"
          render={({ field: { onChange, value = "123456" } }) => (
            <Input
              placeholder="Senha"
              onChangeText={onChange}
              value={value}
              type={show ? "text" : "password"}
              InputRightElement={
                <Pressable onPress={() => setShow(!show)}>
                  <Icon
                    as={
                      <MaterialIcons
                        name={show ? "visibility" : "visibility-off"}
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

        <Button
          title="Acessar"
          background="blue.500"
          onPress={handleSubmit(handleSignIn)}
          isLoading={isLoading}
          mt={4}
        />
      </VStack>

      <VStack mt={20} mb={4} px={12}>
        <Text mb={4} alignSelf="center">
          Ainda nao tem acesso?
        </Text>

        <Button
          title="Criar conta"
          background="gray.300"
          color="gray.600"
          variant="outline"
          onPress={() => navigate("signUp")}
        />
      </VStack>
    </ScrollView>
  );
}
