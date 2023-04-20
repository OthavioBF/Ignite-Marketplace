import { useState } from 'react';
import {
  VStack,
  ScrollView,
  Image,
  Center,
  Skeleton,
  Text,
  useToast,
} from 'native-base';
import { Alert, TouchableOpacity } from 'react-native';

import { Controller, useForm } from 'react-hook-form';
import defaultUserPhotoImg from '../assets/userPhotoDefault.png';
import * as Yup from 'yup';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { ScreenHeader } from '../components/ScreenHeader';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuth } from '../hooks/useAuth';
import { api } from '../services/api';
import { AppError } from '../utils/AppError';

type FormDataProps = {
  name: string;
  email: string;
  password: string;
  old_password: string;
  confirm_password: string;
};

const schema = Yup.object({
  name: Yup.string().required('Nome obrigatorio'),
  password: Yup.string()
    .min(6, 'A senha deve ter pelo menos 6 digitos')
    .uppercase('A senha deve ter pelo menos 1 letra maiuscula')
    .nullable()
    .transform((value) => (!!value ? value : null)),
  confirm_password: Yup.string()
    .nullable()
    .transform((value) => (!!value ? value : null))
    .oneOf([Yup.ref('password')], 'A confirmacao da senha nao confere')
    .when('password', {
      is: (Field: any) => Field,
      then: Yup.string()
        .nullable()
        .required('Informe a confirmacao de senha')
        .transform((value) => (!!value ? value : null)),
    }),
});

export function Profile() {
  const [userPhoto, setUserPhoto] = useState(
    'https://github.com/OthavioBF.png'
  );
  const [isLoading, setIsLoading] = useState(false);

  const toast = useToast();
  const { user, updateUserProfile } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataProps>({
    defaultValues: {
      name: user.name,
      email: user.email,
    },
    resolver: yupResolver(schema),
  });

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
            title: 'Essa imagem e muito grande. Escolha uma de ate 5MB',
            placement: 'top',
            bgColor: 'red.500',
          });
        }

        const fileExtension = selectedPhoto.assets[0].uri.split('.').pop();

        const photoFile = {
          name: `${user.name}.${fileExtension}}`.toLowerCase(),
          uri: selectedPhoto.assets[0].uri,
          type: `${selectedPhoto.assets[0].type}/${fileExtension}`,
        } as any;

        const uploadUserPhotoForm = new FormData();
        uploadUserPhotoForm.append('avatar', photoFile);

        const response = await api.patch('/users/avatar', uploadUserPhotoForm, {
          headers: { 'Content-Type': 'multipart/form-data' },
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
        title: 'Perfil atualizado com sucesso',
        placement: 'top',
        bgColor: 'red.500',
      });
    } catch (error) {
      const isAppError = error instanceof AppError;

      const title = isAppError
        ? error.message
        : 'Nao foi possivel atualizar os dados, tente novamente mais tarde';

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <VStack flex={1}>
      <ScreenHeader title='Perfil' />
      <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
        <Center
          mt={6}
          px={10}
        >
          {isLoading ? (
            <Skeleton
              w={33}
              h={33}
              rounded='full'
              startColor='gray.500'
              endColor='gray.400'
            />
          ) : (
            <Image
              source={
                user.avatar
                  ? { uri: `${api.defaults.baseURL}/avatar/${user.avatar}` }
                  : defaultUserPhotoImg
              }
              w={33}
              h={33}
              rounded='full'
              alt='Foto de perfil do usuario'
            />
          )}

          <TouchableOpacity onPress={handleSelectUserPhoto}>
            <Text
              color='green.500'
              fontWeight='bold'
              fontSize='md'
              mt={2}
              mb={8}
            >
              Alterar Foto
            </Text>
          </TouchableOpacity>

          <Controller
            control={control}
            name='name'
            render={({ field: { value, onChange } }) => (
              <Input
                bg='gray.600'
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
            render={({ field: { value, onChange } }) => (
              <Input
                bg='gray.600'
                placeholder='E-mail'
                isDisabled
                onChangeText={onChange}
                value={value}
              />
            )}
          />

          <Text
            mb={2}
            mt={10}
            alignSelf='flex-start'
          >
            Alterar senha
          </Text>

          <Controller
            control={control}
            name='old_password'
            render={({ field: { onChange } }) => (
              <Input
                bg='gray.600'
                placeholder='Senha antiga'
                secureTextEntry
                onChangeText={onChange}
                errorMessage={errors.old_password?.message}
              />
            )}
          />

          <Controller
            control={control}
            name='password'
            render={({ field: { onChange } }) => (
              <Input
                bg='gray.600'
                placeholder='Nova senha'
                secureTextEntry
                onChangeText={onChange}
                errorMessage={errors.password?.message}
              />
            )}
          />

          <Controller
            control={control}
            name='confirm_password'
            render={({ field: { onChange } }) => (
              <Input
                bg='gray.600'
                placeholder='Confirme sua senha'
                secureTextEntry
                onChangeText={onChange}
                errorMessage={errors.confirm_password?.message}
              />
            )}
          />

          <Button
            title='Atualizar'
            mt={4}
            onPress={handleSubmit(handleUpdateProfile)}
            isLoading={isLoading}
          />
        </Center>
      </ScrollView>
    </VStack>
  );
}
