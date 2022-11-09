import { HStack, useToast, VStack } from "native-base";
import { Header } from "../components/Header";
import { useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Loading } from "../components/Loading";
import { api } from "../services/api";
import { PoolCardProps } from '../components/PoolCard'
import { PoolHeader } from "../components/PoolHeader";
import { EmptyMyPoolList } from "../components/EmptyMyPoolList";
import { Option } from '../components/Option';
import { Share } from 'react-native';
import { Guesses } from '../components/Guesses'

interface RouteParams {
    id: string;
}

export function Details () {
    const route = useRoute();
    const {id} = route.params as RouteParams;
    const [ isLoading, setIsloading] = useState(true);
    const [poolDetails, setPoolDetails] = useState<PoolCardProps>({} as PoolCardProps);
    const [optionSelected, setOptionSelected] = useState<'Seus Palpites' | 'Ranque do grupo'>('Seus Palpites') 
    const toast = useToast();

    async function fetchPoolDetails() {
        try {
            setIsloading(true);
            const response = await api.get('/pools/`${id}')
            setPoolDetails(response.data.pool);
        } catch (error) {
            console.log(error);

            toast.show({
                title: 'Não foi possivel caregar os detalhes',
                placement: 'top',
                bgColor: 'red.500'
            })
        }finally{
            setIsloading(false);
        }
    }

    async function handleCoeShare() {
        await Share.share({
            message: poolDetails.code
        });
    }

    useEffect(()=>{
        fetchPoolDetails();
    },[id])

    if(isLoading){
        return <Loading/>
    }

    return(
        <VStack flex={1} bgColor='gray.900'>
            <Header 
                title={id}
                showBackButton
                showShareButton
                onShare={handleCoeShare}
            />

            {
                poolDetails._count?.participants> 0?
                <VStack px={5} flex={1}>
                    <PoolHeader data={poolDetails}/>

                    <HStack bgColor="gray.800" p={1} rounded="sm" mb={5}>
                        <Option
                            title="Seus palpites"
                            isSelected={optionSelected === 'Seus Palpites'}
                            onPress={()=>setOptionSelected('Seus Palpites')}
                        />
                         <Option
                            title="Ranque do grupo"
                            isSelected={optionSelected === 'Ranque do grupo'}
                            onPress={()=>setOptionSelected('Ranque do grupo')}
                        />
                    </HStack>
                    <Guesses poolId={poolDetails.id} code={poolDetails.code}/>
                </VStack>

              
                :
                <EmptyMyPoolList code={poolDetails.code}/>
                 
            }

        </VStack>
    )
}

