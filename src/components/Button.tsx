import { Button as NativeBaseButton, IButtonProps, Text } from "native-base";
import { LightenDarkenColor } from "lighten-darken-color";

type ButtonProps = IButtonProps & {
  title: string;
  background?: string;
  color?: string;
  variant?: "solid" | "outline";
};

export function Button({ title, background, color, ...rest }: ButtonProps) {
  return (
    <NativeBaseButton
      flex={1}
      bg={background}
      h={12}
      rounded={8}
      _pressed={{
        bg: background ? LightenDarkenColor(background, 70) : "blue.500",
      }}
      {...rest}
    >
      <Text
        color={color ? color : "gray.100"}
        fontSize="sm"
        fontFamily="heading"
      >
        {title}
      </Text>
    </NativeBaseButton>
  );
}
