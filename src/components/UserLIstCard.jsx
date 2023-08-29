import {View, Text, TouchableOpacity} from 'react-native';
import React, {useRef, useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faPlay,
  faPlus,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import LinearGradient from 'react-native-linear-gradient';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';

const UserLIstCard = props => {
  const [play, setplay] = useState(false);
  console.log(props.data);
  const audio = useRef(new AudioRecorderPlayer());

  const playAudio = async () => {
    console.log(audio.current);
    await audio.current.startPlayer(props.path);
    setplay(!play);
    audio.current.addPlayBackListener(r => {
      console.log(audio.current.mmss(r.currentPosition));
    });
  };

  // const PauseAudio = async () => {
  //   await audio.current.pausePlayer().then(() => {
  //     setplay(!play);
  //   });
  // };

  return (
    <View className="flex rounded-lg  my-2 flex-row w-full bg-[#3E456F] items-center gap-x-2   py-2 px-7">
      <View className="bg-gray-400 mr-4  p-4 h-[84px] w-[84px] items-center justify-center rounded-full">
        <FontAwesomeIcon icon={faUser} size={40} />
      </View>
      <View>
        <View>
          <Text
            className="text-[#fff] font-semibold mt-2 text-[#8a2cf5] pb-2 text-[25px]"
            style={{fontFamily: 'Poppins-SemiBold'}}>
            {props.date}
          </Text>
          <Text className="text-[#fff] text-[13px]">{props.time}</Text>
          <View className="flex flex-row items-center justify-between">
            <View>
              <Text className="text-[#fff] text-[13px] mt-1">
                {props.chartNumber}
              </Text>
              <Text className="text-white text-[13px] mt-1">
                {props.Duration}
              </Text>
            </View>
            {props.path === '' ? (
              <TouchableOpacity
                className="bg-white p-2 rounded-full"
                onPress={() => {
                  console.log(props);
                  console.log(props.data);
                  props.nav.navigate('Home', {
                    data: props.data,
                    alldata: props.allData,
                  });
                }}>
                <FontAwesomeIcon icon={faPlus} size={20} color="#A320D1" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                className="rounded-full "
                activeOpacity={0.7}
                onPress={playAudio}>
                <LinearGradient
                  colors={['#8B20D2', '#4E20D3', '#A320D1']}
                  start={{x: 0, y: 0.5}}
                  end={{x: 1, y: 0.5}}
                  style={{
                    flex: 1,
                    width: 38,
                    borderRadius: 100,
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 1,
                  }}>
                  <FontAwesomeIcon icon={faPlay} color="white" />
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

export default UserLIstCard;
