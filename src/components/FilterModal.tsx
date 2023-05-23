import React, { useEffect, useRef, useState } from "react";
import {
  Badge,
  Checkbox,
  HStack,
  Heading,
  Box,
  Modal,
  IModalProps,
  Switch,
  Button,
} from "native-base";
import { Modalize } from "react-native-modalize";
import { XCircle } from "phosphor-react-native";

type ModalProps = {
  open: boolean;
};

const background = "gray.200";

export function FilterModal({ open = false }: ModalProps) {
  // const [showModal, setShowModal] = useState(false);
  const [checkBoxValue, setCheckBoxValue] = useState<string[]>([]);

  const modalizeRef = useRef<Modalize>(null);

  if (open) {
    modalizeRef.current?.open();
  }

  function handleCloseModal() {
    modalizeRef.current?.close();
  }

  function handleResetFilters() {}

  function handleApplyFilters() {}

  // useEffect(() => {
  //   setShowModal(open);
  // }, [open]);
  return (
    <Modalize ref={modalizeRef} snapPoint={400}>
      <Box>
        <Heading fontSize="lg" fontFamily="heading">
          Filtrar anúncios
        </Heading>

        <Heading fontSize="sm" mb={3}>
          Condição
        </Heading>
        <HStack mb={6} space={2}>
          <Badge
            rounded="full"
            bg="blue.500"
            _text={{ color: "gray.100" }}
            rightIcon={<XCircle weight="fill" size={14} color="#EDECEE" />}
          >
            NOVO
          </Badge>
          <Badge
            rounded="full"
            bg="blue.500"
            _text={{ color: "gray.100" }}
            rightIcon={<XCircle weight="fill" size={14} color="#EDECEE" />}
          >
            USADO
          </Badge>
        </HStack>

        <Heading fontSize="sm" mb={1}>
          Aceita troca?
        </Heading>

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
        <Button.Group space={3} w="100%">
          <Button
            flex={1}
            bg="gray.300"
            onPress={() => {
              handleResetFilters();
            }}
          >
            <Heading color="gray.600" fontSize="sm">
              Resetar filtros
            </Heading>
          </Button>
          <Button
            flex={1}
            color="gray.100"
            bg="gray.700"
            onPress={() => {
              handleApplyFilters();
            }}
          >
            <Heading fontSize="sm" color="gray.100">
              Aplicar filtros
            </Heading>
          </Button>
        </Button.Group>
      </Box>
    </Modalize>
  );
}
