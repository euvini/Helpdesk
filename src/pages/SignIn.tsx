import { Heading, Icon, VStack, useTheme, useToast, Box, Text, HStack } from 'native-base'
import React, { useState } from 'react'
import auth from '@react-native-firebase/auth'
import Logo from '../assets/logo_primary.svg'
import Input from '../components/Input'
import { Envelope, Key } from 'phosphor-react-native'
import Button from '../components/Button'

export default function SignIn() {
    const [isLoading, setIsLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const { colors } = useTheme()
    const toast = useToast()

    function handleSignIn() {
        if (!email || !password) {
            return (
                toast.show({
                    render: () => {
                        return <Box bg="red.400" px="2" py="1" rounded="sm" mb={5}>
                            <Text color='white'>Informe e-mail e senha</Text>
                        </Box>;
                    }
                })
            )
        }
        setIsLoading(true)
        auth().signInWithEmailAndPassword(email, password)
            .catch((e) => {
                setIsLoading(false)
                if (e.code === 'auth/invalid-email') {
                    toast.show({
                        render: () => {
                            return <Box bg="red.400" px="2" py="1" rounded="sm" mb={5}>
                                <Text color='white'>E-mail informado não é válido</Text>
                            </Box>;
                        }
                    })
                }
                if (e.code === 'auth/user-disabled') {
                    toast.show({
                        render: () => {
                            return <Box bg="red.400" px="2" py="1" rounded="sm" mb={5}>
                                <Text color='white'>Usuário desativado</Text>
                            </Box>;
                        }
                    })
                }
                if (e.code === 'auth/user-not-found') {
                    toast.show({
                        render: () => {
                            return <Box bg="red.400" px="2" py="1" rounded="sm" mb={5}>
                                <Text color='white'>Usuário não encontrado</Text>
                            </Box>;
                        }
                    })
                }
                if (e.code === 'auth/wrong-password') {
                    toast.show({
                        render: () => {
                            return <Box bg="red.400" px="2" py="1" rounded="sm" mb={5}>
                                <Text color='white'>Senha incorreta</Text>
                            </Box>;
                        }
                    })
                }
            })
    }

    return (
        <VStack flex={1} alignItems='center' bg='gray.600' px={8} pt={24} >
            <Logo />
            <Heading color='gray.100' fontSize='xl' mt={20} mb={6} >
                Acesse sua conta
            </Heading>
            <Input
                placeholder='E-mail'
                mb={4}
                InputLeftElement={<Icon as={<Envelope color={colors.gray[300]} />} ml={4} />}
                onChangeText={setEmail}
            />
            <Input
                placeholder='Senha'
                mb={8}
                InputLeftElement={<Icon as={<Key color={colors.gray[300]} />} ml={4} />}
                onChangeText={setPassword}
                secureTextEntry
            />
            <Button
                title='Entrar'
                w='full'
                onPress={handleSignIn}
                isLoading={isLoading}
            />
            <HStack justifyContent='space-between' width='full' mt={5}>
                <Button
                    title='Esqueci minha senha'
                    bg='transparent'
                    _pressed={{ bg: 'transparent' }}
                    onPress={handleSignIn}
                />
                <Button
                    title='Cadastrar'
                    bg='transparent'
                    _pressed={{ bg: 'transparent' }}
                    onPress={handleSignIn}
                />

            </HStack>
        </VStack>
    )
}