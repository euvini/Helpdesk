import { HStack, ScrollView, Text, useTheme, VStack, useToast, Box } from "native-base";
import { CircleWavyCheck, Hourglass, DesktopTower, ClipboardText, CheckCircle } from 'phosphor-react-native'
import firestore from '@react-native-firebase/firestore'
import { Header } from "../components/Header";
import { useNavigation, useRoute } from '@react-navigation/native'
import { OrderProps } from "../components/Order";
import { useEffect, useState } from "react";
import { OrderFirestoreDTO } from "../DTOs/OrderFirestoreDTO";
import { dateFormat } from "../utils/firestoreDateFormat";
import Loading from "../components/Loading";
import { CardDetails } from "../components/CardDetails";
import Input from "../components/Input";
import Button from "../components/Button";

type RouteParams = {
    orderId: string
}

type OrderDetails = OrderProps & {
    description: string
    solution: string
    closed: string
}

export function Details() {
    const [order, setOrder] = useState<OrderDetails>({} as OrderDetails)
    const [isLoading, setIsLoading] = useState(true)
    const [loader, setLoader] = useState(false)
    const [solution, setSolution] = useState('')

    const { colors } = useTheme()
    const route = useRoute()
    const navigation = useNavigation()
    const { orderId } = route.params as RouteParams
    const toast = useToast()

    function handleOrderClose() {
        if (!solution) {
            return (
                toast.show({
                    render: () => {
                        return <Box bg="gray.400" px="2" py="1" rounded="sm" mb={5}>
                            <Text color='white'>Informe a solução para finalizar</Text>
                        </Box>;
                    }
                })
            )
        }
        setLoader(true)
        firestore()
            .collection('Orders')
            .doc(orderId)
            .update({
                status: 'closed',
                solution,
                closed_at: firestore.FieldValue.serverTimestamp()
            })
            .then(() => {
                toast.show({
                    render: () => {
                        return <Box bg="green.400" px="2" py="1" rounded="sm" mb={5}>
                            <Text color='white'>Solicitação finalizada</Text>
                        </Box>;
                    }
                })
                navigation.goBack()
            })
            .catch((e) => {
                setLoader(false)
                toast.show({
                    render: () => {
                        return <Box bg="red.400" px="2" py="1" rounded="sm" mb={5}>
                            <Text color='white'>Não foi possível finalizar a solicitação</Text>
                        </Box>;
                    }
                })
                console.log(e)
            })
    }

    useEffect(() => {
        firestore()
            .collection<OrderFirestoreDTO>('Orders')
            .doc(orderId)
            .get()
            .then((doc) => {
                const { patrimony, description, status, created_at, closed_at, solution, uid } = doc.data()
                const closed = closed_at ? dateFormat(closed_at) : null
                setOrder({
                    id: doc.id,
                    patrimony,
                    description,
                    status,
                    solution,
                    when: dateFormat(created_at),
                    closed,
                    uid
                })
                setIsLoading(false)
            })
    }, [])

    if (isLoading) {
        return <Loading />
    }

    return (
        <VStack
            flex={1} bg='gray.700'
        >
            <Box px={6} pt={6} bg='gray.600'>
                <Header
                    title="Detalhes"
                />
            </Box>

            <HStack bg='gray.500' justifyContent='center' p={4} >
                {
                    order.status === 'closed'
                        ? <CircleWavyCheck size={22} color={colors.green[300]} />
                        : <Hourglass size={22} color={colors.secondary[700]} />
                }
                <Text
                    fontSize='sm'
                    color={order.status === 'closed' ? colors.green[300] : colors.secondary[700]}
                    ml={2}
                    textTransform='uppercase'
                >
                    {order.status === 'closed' ? 'finalizado' : 'em andamento'}
                </Text>
            </HStack>
            <ScrollView mx={5} showsVerticalScrollIndicator={false} >
                <CardDetails
                    title='Equipamento'
                    description={`Patrimônio: ${order.patrimony}`}
                    icon={DesktopTower}
                />
                <CardDetails
                    title='descrição do problema'
                    description={order.description}
                    icon={ClipboardText}
                    footer={order.when}
                />
                <CardDetails
                    title='solução'
                    description={order.solution}
                    icon={CircleWavyCheck}
                    footer={order.closed && `Encerrado em ${order.closed}`}
                >
                    {
                        !order.solution &&
                        <Input
                            placeholder="Descrição da solução"
                            onChangeText={setSolution}
                            h={24}
                            textAlignVertical="top"
                            multiline
                        />
                    }
                </CardDetails>
            </ScrollView>
            {
                !order.closed &&
                <Button
                    title="Finalizar"
                    m={5}
                    mb={6}
                    onPress={handleOrderClose}
                    isLoading={loader}
                />
            }
        </VStack>
    )
}