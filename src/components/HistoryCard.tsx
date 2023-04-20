import { HStack, VStack, Heading, Text } from 'native-base';
import { HistoryDTO } from '../dtos/HistoryDTO';

type Props = {
  data: HistoryDTO;
};

export function HistoryCard({ data }: Props) {
  return (
    <HStack
      w='full'
      px={5}
      py={4}
      mb={3}
      bg='gray.600'
      rounded='md'
      alignItems='center'
      justifyContent='space-between'
    >
      <VStack flex={1}>
        <Heading
          color='white'
          fontSize='md'
          fontFamily='heading'
          textTransform='capitalize'
        >
          {data.group}
        </Heading>
        <Text
          color='gray.100'
          fontSize='lg'
        >
          {data.name}
        </Text>
      </VStack>

      <Text
        color='gray.300'
        fontSize='md'
      >
        {data.hour}
      </Text>
    </HStack>
  );
}
