import {
  VStack,
  Image,
  Text,
  Center,
  Heading,
  ScrollView,
  useToast,
} from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import BackGroundImg from '../assets/image.png';
import LogoSvg from '../assets/logo.svg';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { AuthNavigatorRoutesProps } from '../routes/auth.routes';
import { useAuth } from '../hooks/useAuth';
import { AppError } from '../utils/AppError';
import { useState } from 'react';

type FormDataProps = {
  email: string;
  password: string;
};

const schema = Yup.object({
  email: Yup.string().required('Email obrigatorio').email('Email invalido'),
  password: Yup.string()
    .required('Senha obrigatorio')
    .min(6, 'A senha deve ter pelo menos 6 digitos')
    .uppercase('A senha deve ter pelo menos 1 letra maiuscula'),
});

export function SignIn() {
  const [isLoading, setIsloading] = useState(false);
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
        : 'Error ao cadastrar, tente mais tarde';

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      });

      setIsloading(false);
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
        pb={16}
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
        <Center mt={32}>
          <Heading
            color='gray.100'
            fontSize='xl'
            fontFamily='heading'
            mb={6}
          >
            Acesse sua conta
          </Heading>
        </Center>

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

        <Button
          title='Acessar'
          onPress={handleSubmit(handleSignIn)}
          isLoading={isLoading}
        />
        <Center
          mt={20}
          mb={4}
        >
          <Text>Ainda nao tem acesso?</Text>
        </Center>
        <Button
          title='Criar conta'
          variant='outline'
          onPress={() => navigate('signUp')}
        />
      </VStack>
    </ScrollView>
  );
}
