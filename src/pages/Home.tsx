import { Heading, VStack, useTheme, HStack, IconButton, Text, FlatList, Center, useToast, Box } from 'native-base'
import { useNavigation } from '@react-navigation/native'
import auth from '@react-native-firebase/auth'
import firestore from "@react-native-firebase/firestore"
import React, { useEffect, useState } from 'react'
import Logo from '../assets/logo_secondary.svg'
import { ChatTeardropText } from 'phosphor-react-native'
import { SignOut } from 'phosphor-react-native'
import Button from '../components/Button'
import Filter from '../components/Filter'
import Order, { OrderProps } from '../components/Order'
import { dateFormat } from '../utils/firestoreDateFormat'
import Loading from '../components/Loading'

export function Home() {
    const [loading, setLoading] = useState(true)
    const [statusSelected, setStatusSelected] = useState<'open' | 'closed'>('open')
    const [orders, setOrders] = useState<OrderProps[]>([])

    const { colors } = useTheme()
    const navigation = useNavigation()
    const toast = useToast()
    const user = auth().currentUser.uid

    function handleNewOrder() {
        navigation.navigate('newOrder')
    }

    function handleDetails(orderId: string) {
        navigation.navigate('details', { orderId })
    }

    function handleSignOut() {
        auth().signOut()
            .catch((e) => {
                console.log(e)
                return (
                    toast.show({
                        render: () => {
                            return <Box bg="red.400" px="2" py="1" rounded="sm" mb={5}>
                                <Text color='white'>Não foi possível sair</Text>
                            </Box>;
                        }
                    })
                )
            })
        toast.show({
            render: () => {
                return <Box bg="gray.400" px="2" py="1" rounded="sm" mb={5}>
                    <Text color='white'>Você foi desconectado</Text>
                </Box>;
            }
        })
    }

    useEffect(() => {
        setLoading(true)

        const subscriber = firestore()
            .collection('Orders')
            .where('status', '==', statusSelected)
            .where('uid', '==', user)
            .onSnapshot(snapshot => {
                const data = snapshot.docs.map(doc => {
                    const { patrimony, description, status, created_at, uid } = doc.data()

                    return {
                        id: doc.id,
                        patrimony,
                        description,
                        status,
                        when: dateFormat(created_at),
                        uid
                    }
                })
                setOrders(data)
                setLoading(false)
            })
        return subscriber;
    }, [statusSelected])

    return (
        <VStack flex={1} bg='gray.700' pb={6} >
            <HStack
                w='full'
                justifyContent='space-between'
                alignItems='center'
                bg='gray.600'
                pt={12}
                pb={5}
                px={6}
            >
                <Logo />
                <IconButton
                    icon={<SignOut size={26} color={colors.gray[300]} />}
                    onPress={handleSignOut}
                />
            </HStack>
            <VStack flex={1} px={6} >
                <HStack w='full' mt={8} mb={4} justifyContent='space-between' alignItems='center' >
                    <Heading color='gray.100' size='md' >
                        Solicitações
                    </Heading>
                    <Text color='gray.200' >
                        {orders.length}
                    </Text>
                </HStack>
                <HStack space={3} mb={8} >
                    <Filter
                        title='Em andamento'
                        type='open'
                        onPress={() => setStatusSelected('open')}
                        isActive={statusSelected === 'open'}
                    />
                    <Filter
                        title='Finalizados'
                        type='closed'
                        onPress={() => setStatusSelected('closed')}
                        isActive={statusSelected === 'closed'}
                    />
                </HStack>
                {
                    loading
                        ? <Loading />
                        : <FlatList
                            data={orders}
                            keyExtractor={item => item.id}
                            renderItem={({ item }) => <Order data={item} onPress={() => handleDetails(item.id)} />}
                            ListEmptyComponent={() => (
                                <Center>
                                    <ChatTeardropText color={colors.gray[300]} size={40} />
                                    <Text color='gray.300' fontSize='xl' textAlign='center' >
                                        Você ainda não tem {'\n'}
                                        solicitações {statusSelected === 'open' ? 'em andamento' : 'finalizadas'}
                                    </Text>
                                </Center>
                            )}
                        />
                }
                <Button mb={8} title='Nova solicitação' onPress={handleNewOrder} />
            </VStack>


        </VStack>
    )
}