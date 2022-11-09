import { VStack, Icon, useToast, FlatList } from "native-base";
import { Button } from "../components/Button";
import { Header } from "../components/Header";
import {Octicons} from "@expo/vector-icons";
import {useNavigation} from '@react-navigation/native';
import { useCallback, useState } from "react";
import { api } from "../services/api";
import { PoolCard, PoolCardProps } from "../components/PoolCard"
import { Loading } from "../components/Loading";
import { EmptyPoolList } from "../components/EmptyPoolList";
import { useFocusEffect,  } from "@react-navigation/native";

export function Pools() {
    const [ isLoading, setIsloading] = useState(true);
    const [pools, setPools] = useState<PoolCardProps[]>([]);
    const { navigate } = useNavigation();
    const toast = useToast();

    async function fetchPools() {
        try {
            setIsloading(true)
            const response = await api.get('/pools')
            setPools(response.data.pools)
        } catch (error) {
            console.log(error);

            toast.show({
                title: 'Não foi possivel caregar os bolões',
                placement: 'top',
                bgColor: 'red.500'
            })

        } finally {
            setIsloading(false)
        }
    };

    useFocusEffect(useCallback(()=>{
        fetchPools();
    },[]));


    return(
        <VStack flex={1} bgColor="gray.900">
            <Header title="Meus Bolões"/>
            <VStack mt={6} mx={5} borderBottomWidth={1} borderBottomColor="gray.600" pb={4} mb={4}>

                <Button leftIcon={<Icon as ={Octicons}name="search" color="black" size="md"/>} title="BUSCAR BOLÃO POR CÓDIGO" onPress={()=>navigate('find')} />

            </VStack>

            {
                isLoading? <Loading/> :
                <FlatList
                data={pools}
                keyExtractor={item=> item.id}
                renderItem={({item})=>( 
                <PoolCard 
                onPress={()=>navigate('details', {id: item.id})}
                data={item} />)}
                px={5}
                showsVerticalScrollIndicator={false}
                _contentContainerStyle={{ pb:10 }}
                ListEmptyComponent = {()=> <EmptyPoolList />}
                />
            }

        </VStack>
    )
}