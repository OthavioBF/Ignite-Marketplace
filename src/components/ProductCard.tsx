import { HStack, Image, VStack, Heading, Text, Icon, Badge } from "native-base";
import { Entypo } from "@expo/vector-icons";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";

import { ProductsDTO } from "../dtos/ExerciseDTO";
import defaultUserPhotoImg from "../assets/userPhotoDefault.png";
import { api } from "../services/api";

import bikeImg from "../assets/bike.png";

type ExerciseProps = TouchableOpacityProps & {
  data?: ProductsDTO;
};

export function ProductCard({ data, ...rest }: ExerciseProps) {
  return (
    <TouchableOpacity {...rest}>
      <VStack bg="gray.200" w={40} rounded="md" mb={6} style={{ height: 143 }}>
        <Image
          source={bikeImg}
          w={40}
          h={24}
          rounded="md"
          resizeMode="cover"
          position="absolute"
          alt="Imagem do exercicio"
        />
        <HStack
          alignItems="center"
          justifyContent="space-between"
          p={1}
          position="relative"
        >
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
          <Badge rounded="full" bg="blue.700" _text={{ color: "gray.100" }}>
            NOVO
          </Badge>
        </HStack>

        <VStack flex={1} justifyContent="flex-end">
          <Text fontSize="md" color="gray.600" numberOfLines={1}>
            Bicicleta
          </Text>
          <Heading fontSize="lg" fontFamily="heading" color="gray.700">
            R$ 100,00
          </Heading>
        </VStack>
      </VStack>
    </TouchableOpacity>
  );
}
