import { useNavigation } from '@react-navigation/native';
import {
  VStack,
  Image,
  Text,
  Center,
  Heading,
  ScrollView,
  useToast,
} from 'native-base';
import * as Yup from 'yup';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
import BackGroundImg from '../assets/image.png';
import LogoSvg from '../assets/logo.svg';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { api } from '../services/api';
import axios from 'axios';
import { AppError } from '../utils/AppError';
import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';

type FormDataProps = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const schema = Yup.object({
  name: Yup.string().required('Nome obrigatorio'),
  email: Yup.string().required('Email obrigatorio').email('Email invalido'),
  password: Yup.string()
    .required('Senha obrigatorio')
    .min(6, 'A senha deve ter pelo menos 6 digitos')
    .uppercase('A senha deve ter pelo menos 1 letra maiuscula'),
  confirmPassword: Yup.string()
    .required('Confirme a senha')
    .oneOf([Yup.ref('password')], 'A confirmacao da senha nao confere'),
});

export function SignUp() {
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const { goBack } = useNavigation();

  const toast = useToast();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataProps>({
    resolver: yupResolver(schema),
  });

  async function handleSignUp({ name, email, password }: FormDataProps) {
    try {
      setIsLoading(true);
      await api.post('/users', { name, email, password });
      await signIn(name, email);
    } catch (error) {
      setIsLoading(false);

      const isAppError = error instanceof AppError;

      const title = isAppError
        ? error.message
        : 'Error ao cadastrar, tente mais tarde';

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      });
    }
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <VStack
        flex={1}
        bg='gray.700'
        pb={8}
        px={8}
      >
        <Image
          source={BackGroundImg}
          defaultSource={BackGroundImg}
          alt='background'
          resizeMode='contain'
          position='absolute'
        />
        <Center my={24}>
          <Heading
            color='gray.100'
            fontSize='4xl'
            fontFamily='heading'
          >
            Pandora Gym
          </Heading>

          <Text fontSize='sm'>Treine sua mente e o seu corpo</Text>
        </Center>
        <Center mt={24}>
          <Heading
            color='gray.100'
            fontSize='xl'
            fontFamily='heading'
            mb={4}
          >
            Crie sua conta
          </Heading>
        </Center>

        <Controller
          control={control}
          name='name'
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder='Nome'
              onChangeText={onChange}
              value={value}
              errorMessage={errors.name?.message}
            />
          )}
        />

        <Controller
          control={control}
          name='email'
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder='E-mail'
              keyboardType='email-address'
              onChangeText={onChange}
              value={value}
              errorMessage={errors.email?.message}
            />
          )}
        />
        <Controller
          control={control}
          name='password'
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder='Senha'
              secureTextEntry
              onChangeText={onChange}
              value={value}
              errorMessage={errors.password?.message}
            />
          )}
        />
        <Controller
          control={control}
          name='confirmPassword'
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder='Confirme a senha'
              secureTextEntry
              onChangeText={onChange}
              value={value}
              onSubmitEditing={handleSubmit(handleSignUp)}
              returnKeyType='send'
              errorMessage={errors.confirmPassword?.message}
            />
          )}
        />

        <Button
          title='Criar e acessar'
          mt={2}
          onPress={handleSubmit(handleSignUp)}
        />

        <Button
          mt={16}
          title='Voltar para login'
          variant='outline'
          onPress={goBack}
        />
      </VStack>
    </ScrollView>
  );
}
