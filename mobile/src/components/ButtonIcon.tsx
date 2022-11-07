import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import { IconProps } from "phosphor-react-native";
import { useTheme } from "native-base";
import { useNavigation } from "@react-navigation/native";

interface Props extends TouchableOpacityProps {
  icon: React.FC<IconProps>;
}

export function ButtonIcon({ icon: Icon, ...rest }: Props) {
  const { colors, sizes } = useTheme();
  const {navigate} = useNavigation();


  return (
    <TouchableOpacity {...rest} onPress={()=> navigate('pools')}>
      <Icon color={colors.gray[300]} size={sizes[6]} />
      
    </TouchableOpacity>
  );
}