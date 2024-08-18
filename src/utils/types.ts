import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

export type RootStackParamList = {
	'首页': undefined;
	'音乐': undefined;
	TabNavigator: undefined;
};


export type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, '首页'>;
export type HomeScreenRouteProp = RouteProp<RootStackParamList, '首页'>;
export type HomeProps = {
	navigation: HomeScreenNavigationProp;
	route: HomeScreenRouteProp;
};

export type MusicScreenNavigationProp = StackNavigationProp<RootStackParamList, '音乐'>;
export type MusicScreenRouteProp = RouteProp<RootStackParamList, '音乐'>;
export type MusicProps = {
	navigation: MusicScreenNavigationProp;
	route: MusicScreenRouteProp;
};
