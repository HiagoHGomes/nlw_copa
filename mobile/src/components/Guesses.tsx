import {useToast, FlatList  } from 'native-base';
import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Game, GameProps } from '../components/Game';
import { Loading } from './Loading';
import { EmptyMyPoolList } from '../components/EmptyMyPoolList'

interface Props {
  poolId: string;
  code: string;
}

export function Guesses({ poolId, code }: Props) {
  const [ isLoading, setIsloading] = useState(true);
  const [games, setGames] = useState<GameProps[]>([]);
  const [firstTeamPoints, setFirstTeamPoints] = useState('');
  const [secondTeamPoints, setSecondTeamPoints] = useState('');
  const toast = useToast();


  async function fetchGames(){
    try {
      setIsloading(true);
      const response = await api.get(`/pools/${poolId}/games`);
      setGames(response.data.games)
    } catch (error) {
      console.log(error);

      toast.show({
          title: 'Não foi possivel caregar os jogos',
          placement: 'top',
          bgColor: 'red.500'
      })
  }finally{
      setIsloading(false);
  }
  }

  async function handleGuessConfirm(gameId:string){
    try {
      if(!firstTeamPoints.trim() || !secondTeamPoints.trim()){
        return toast.show({
          title: 'Informe o placar',
          placement: 'top',
          bgColor: 'red.500'
        })
      }   
      await api.post( `/pools/${poolId}/games${gameId}/guesses`,{
        firstTeamPoints: Number(firstTeamPoints),
        secondTeamPoints: Number(secondTeamPoints)
      });
      toast.show({
        title: 'Informe o placar',
        placement: 'top',
        bgColor: 'red.500'
      });
      fetchGames();

    } catch (error) {
      toast.show({
        title: 'Palpite realizado com sucesso!',
        placement: 'top',
        bgColor: 'green.500'
      })
    }
  }

  useEffect(()=>{
    fetchGames();
  },[poolId]);

  if(isLoading){
    return <Loading/>
  }

  return (
   <FlatList 
    data={games}
    keyExtractor={item => item.id}
    renderItem={({item})=> (
      <Game
        data={item}
        setFirstTeamPoints={setFirstTeamPoints}
        setSecondTeamPoints={setSecondTeamPoints}
        onGuessConfirm={()=>handleGuessConfirm(item.id)}
      />
    )}
      ListEmptyComponent={()=> <EmptyMyPoolList code={code}/>}

   />
  );
}
