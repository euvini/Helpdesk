import { Heading, Icon, VStack, useTheme, useToast, Box, Text } from 'native-base'
import React, { useState } from 'react'
import auth from '@react-native-firebase/auth'
import Logo from '../assets/logo_primary.svg'
import Input from '../components/Input'
import { Envelope, Eye, EyeSlash, Key, Phone } from 'phosphor-react-native'
import Button from '../components/Button'
import { useNavigation } from '@react-navigation/native'

export default function SignUp() {
    const [isLoading, setIsLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [validation, setValidation] = useState('')

    const { colors } = useTheme()
    const toast = useToast()

    const navigation = useNavigation()

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
        if (password != validation) {
            return (
                toast.show({
                    render: () => {
                        return <Box bg="red.400" px="2" py="1" rounded="sm" mb={5}>
                            <Text color='white'>As senhas não combinam</Text>
                        </Box>;
                    }
                })
            )
        }
        setIsLoading(true)
        auth().createUserWithEmailAndPassword(email, password)
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
                if (e.code === 'auth/email-already-in-use') {
                    toast.show({
                        render: () => {
                            return <Box bg="red.400" px="2" py="1" rounded="sm" mb={5}>
                                <Text color='white'>E-mail já está em uso</Text>
                            </Box>;
                        }
                    })
                }
                if (e.code === 'auth/weak-password') {
                    toast.show({
                        render: () => {
                            return <Box bg="red.400" px="2" py="1" rounded="sm" mb={5}>
                                <Text color='white'>Senha fraca, digite uma senha de no minimo 6 caracteres</Text>
                            </Box>;
                        }
                    })
                }
            })
            .then((response) => {
                console.log(response)
            })
    }

    return (
        <VStack flex={1} alignItems='center' bg='gray.600' px={8} pt={24} >
            <Logo />
            <Heading color='gray.100' fontSize='xl' mt={20} mb={6} >
                Cadastro
            </Heading>
            <Input
                placeholder='E-mail corporativo'
                mb={4}
                InputLeftElement={<Icon as={<Envelope color={colors.gray[300]} />} ml={4} />}
                onChangeText={setEmail}
            />

            <Input
                placeholder='Senha'
                mb={4}
                InputLeftElement={<Icon as={<Key color={colors.gray[300]} />} ml={4} />}
                onChangeText={setPassword}
                type="password"
            />
            <Input
                placeholder='Confirmar senha'
                mb={8}
                InputLeftElement={<Icon as={<Key color={colors.gray[300]} />} ml={4} />}
                onChangeText={setValidation}
                type="password"
            />
            <Button
                title='Cadastrar'
                w='full'
                onPress={handleSignIn}
                isLoading={isLoading}
            />
            <Button
                title='Voltar'
                mt={10}
                bg='transparent'
                _pressed={{ bg: 'transparent' }}
                onPress={() => navigation.goBack()}
            />
        </VStack>
    )
}