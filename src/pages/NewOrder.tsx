import { useTheme, VStack, useToast, Box, Text } from "native-base"
import firestore from "@react-native-firebase/firestore"
import auth  from "@react-native-firebase/auth"
import { useNavigation } from '@react-navigation/native'
import Button from "../components/Button"
import { Header } from "../components/Header"
import Input from "../components/Input"
import { useState } from "react"

export function NewOrder() {
    const navigation = useNavigation()
    const user = auth().currentUser.uid

    const [isLoading, setIsLoading] = useState(false)
    const [patrimony, setPatrimony] = useState('')
    const [description, setDescription] = useState('')

    const toast = useToast()

    function handleNewOrder() {
        if (!patrimony || !description) {
            return toast.show({
                render: () => {
                    return <Box bg="red.400" px="2" py="1" rounded="sm" mb={5}>
                        <Text color='white'>Preencha todos os campos</Text>
                    </Box>;
                }
            })
        }
        setIsLoading(true)
        firestore()
            .collection('Orders')
            .add({
                patrimony,
                description,
                status: 'open',
                created_at: firestore.FieldValue.serverTimestamp(),
                uid: user
            })
            .then(() => {
                toast.show({
                    render: () => {
                        return <Box bg="green.400" px="2" py="1" rounded="sm" mb={5}>
                            <Text color='white'>Solicitação enviada</Text>
                        </Box>;
                    }
                })
                navigation.goBack()
            })
            .catch((e) => {
                console.log(e)
                setIsLoading(false)
                return toast.show({
                    render: () => {
                        return <Box bg="red.400" px="2" py="1" rounded="sm" mb={5}>
                            <Text color='white'>Falha ao enviar solicitação</Text>
                        </Box>;
                    }
                })
            })
    }

    return (
        <VStack flex={1} p={6} bg='gray.600'>
            <Header
                title="Nova solicitação"
            />
            <Input
                placeholder="Patrimônio"
                onChangeText={setPatrimony}
            />
            <Input
                placeholder="Descrição do problema"
                flex={1}
                mt={5}
                multiline
                textAlignVertical="top"
                onChangeText={setDescription}
            />
            <Button
                title="Enviar"
                mt={5}
                mb={5}
                onPress={handleNewOrder}
                isLoading={isLoading}
            />
        </VStack>
    )
}