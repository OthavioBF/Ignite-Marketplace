import { Button as NativeBaseButton, IButtonProps, Text } from 'native-base';

type ButtonProps = IButtonProps & {
  title: string;
  variant?: 'solid' | 'outline';
};

export function Button({ title, variant = 'solid', ...rest }: ButtonProps) {
  return (
    <NativeBaseButton
      bg={variant === 'outline' ? 'transparent' : 'green.700'}
      borderWidth={variant === 'outline' ? 1 : 0}
      borderColor='green.500'
      h={14}
      w='full'
      _pressed={{ bg: variant === 'outline' ? 'gray.500' : 'green.500' }}
      {...rest}
    >
      <Text
        color='white'
        fontSize='sm'
        fontFamily='heading'
      >
        {title}
      </Text>
    </NativeBaseButton>
  );
}
