import {View, Text, SafeAreaView} from 'react-native';
import React, {useEffect} from 'react';
import Icon from '../../assets/svg/Icon';

const SplashScreen = (props) => {
    useEffect(()=>{
        setTimeout(()=>{
            props.navigation.replace("Home")
        },1000)
    },[])
  return (
    <SafeAreaView className="flex flex-1 items-center justify-center bg-[#1E202E]">
        <Icon />
      <Text style={{fontFamily:'Poppins-SemiBold'}} className="text-white text-[24px]">  Audio Recorder </Text>
    </SafeAreaView>
  );
};

export default SplashScreen;
