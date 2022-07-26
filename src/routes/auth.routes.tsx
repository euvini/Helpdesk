import { createNativeStackNavigator } from '@react-navigation/native-stack'
import SignIn from '../pages/SignIn'
import SignUp from '../pages/SignUp'

const { Navigator, Screen } = createNativeStackNavigator()

export function AuthRoutes() {
    return (
        <Navigator screenOptions={{
            headerShown: false
        }}
            initialRouteName='signIn'>
            <Screen
                name='signIn'
                component={SignIn}
            />
            <Screen
                name='signUp'
                component={SignUp}
            />
        </Navigator>
    )
}