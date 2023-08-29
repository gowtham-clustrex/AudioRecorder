import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faArrowsRotate,
  faMicrophone,
  faPause,
  faPlay,
  faRecordVinyl,
  faStop,
  faUpload,
} from '@fortawesome/free-solid-svg-icons';
import LinearGradient from 'react-native-linear-gradient';
import AudioRecorderPlayer, {
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AudioEncoderAndroidType,
  AudioSourceAndroidType,
} from 'react-native-audio-recorder-player';
import {Buffer} from 'buffer';
import RNFS from 'react-native-fs';
import NetInfo from '@react-native-community/netinfo';
import {uploadAudio, get_presigned_url} from '../Api/ApiCall';
import LottieView from 'lottie-react-native';

const Home = () => {
  const rec = useRef(new AudioRecorderPlayer());
  const animationref = useRef(null);
  const [loading, setLoading] = useState(false);
  const [upload, setupload] = useState(true);

  const now = new Date();
  const date = `${now.getDate()} ${now.toLocaleString('default', {
    month: 'short',
  })} ${now.getFullYear()}`;

  // setting the pause and resume state
  const [pause, setpause] = useState(false);

  // set the path to the audio to play
  const [path, setPath] = useState('');
  const [startStopRecord, setStartStopRecord] = useState(false);
  const [playerPause, setPlayerPause] = useState(false);
  // recorder timer
  const [timer, setTimer] = useState('00:00');

  // getting android permissions
  const Permission = async () => {
    if (Platform.OS === 'android') {
      try {
        const grants = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ]);

        console.log('write external stroage', grants);

        if (
          grants['android.permission.WRITE_EXTERNAL_STORAGE'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          grants['android.permission.READ_EXTERNAL_STORAGE'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          grants['android.permission.RECORD_AUDIO'] ===
            PermissionsAndroid.RESULTS.GRANTED
        ) {
          console.log('Permissions granted');
        } else {
          console.log('All required permissions not granted');
          return;
        }
      } catch (err) {
        console.warn(err);
        return;
      }
    }
  };

  // android folder path
  const folderPath = '/sdcard/AudioRecorder';

  // create folder in android
  const folder = () => {
    console.log(folderPath);
    RNFS.exists(folderPath)
      .then(res => {
        if (!res) {
          console.log('no folder');
          RNFS.mkdir(folderPath).then(res => {
            console.log('res', res);
          });
        }
      })
      .catch(err => {
        console.error(err);
      });
  };

  useEffect(() => {
    Permission();
    Platform.OS === 'android' && folder();
    NetInfo.fetch().then(res => {
      if (!res.isConnected) {
        console.log('ello');
        Alert.alert('internet connectivity', 'no connection available');
      }
    });
  }, []);

  // start the recording
  const startListener = async () => {
    rec.current.setSubscriptionDuration(0.08);
    animationref.current?.play()
    const audioSet = {
      AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
      AudioSourceAndroid: AudioSourceAndroidType.MIC,
      AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
      AVNumberOfChannelsKeyIOS: 2,
      AVFormatIDKeyIOS: AVEncodingOption.aac,
    };
    const path =
      Platform.OS === 'android' ? `${folderPath}/new01.aac` : 'new01.aac';
    setStartStopRecord(!startStopRecord);

    await rec.current.startRecorder(path, audioSet);
    rec.current.addRecordBackListener(r => {
      console.log('Rec', r);
      setTimer(rec.current.mmss(Math.floor(r.currentPosition)));
    });
  };

  const stopListener = async () => {
    const result = await rec.current.stopRecorder();
    rec.current.removeRecordBackListener();
    setPath(result);
    animationref.current?.reset()
    animationref.current?.stop()

    setStartStopRecord(!startStopRecord);
    // uploadAudioFile(result);
  };

  const uploadAudioFile = async result => {
    try {
      if (result) {
        setLoading(true);
        setPath(result);
        console.log('URL', result);
        name = result.substring(result.lastIndexOf('/') + 1, result.length);
        // console.log('inter', internet);

        //get presigned  url for s3 upload
        const presigned_url = await get_presigned_url(name);
        if (!presigned_url) {
          Alert.alert('error', 'unable to upload a File');
          setupload(false);
        }
        const data = await RNFS.readFile(result, 'base64');

        // convert base64 to buffer
        const bufferAudio = Buffer.from(data, 'base64');
        console.log(bufferAudio);
        setupload(true);

        // upload to s3 bucket
        uploadAudio(presigned_url, bufferAudio)
          .then(re => {
            console.log('Updated');
            setTimer('00:00');
            setLoading(false);
            setupload(true);
          })
          .catch(err => {
            setLoading(false);
            Alert.alert('error', 'unable to upload a File');
            setupload(false);
          });
      }
    } catch (err) {
      setLoading(false);
      setupload(false);
      Alert.alert('error', 'unable to upload a File');
    }
  };

  const pauseAudio = async () => {
    console.log('pauseAudio');
    rec.current.pauseRecorder().then(() => {
      setpause(!pause);
    });
  };

  const resumeAudio = async () => {
    console.log('resume');

    rec.current.resumeRecorder().then(() => {
      setpause(!pause);
    });
    setpause(!pause);
  };

  const playAudio = async () => {
    console.log(rec.current);
    const play = await rec.current.startPlayer(path);
    rec.current.addPlayBackListener(r => {
      setTimer(rec.current.mmss(r.currentPosition));
      console.log(rec.current.mmss(r.currentPosition));
      setPlayerPause(!playerPause);
    });
  };

  const pausePlayAudio = async () => {
    rec.current.resumePlayer().then(() => {
      setPlayerPause(!playerPause);
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-[#383248]">
      <View className="px-[25px] mt-6">
        <Text
          className="text-[20px] text-[#fff] "
          style={{fontFamily: 'Poppins-Medium'}}>
          Hi Standley
        </Text>
      </View>
      <View className="h-[50%] items-center justify-center">
        <View>
          <LottieView 
          ref={animationref}
          source={require('../../assets/lottieJson/musicLoader.json')}
          style={{height: 300,width:300}}
          />
        </View>
      </View>
      <View className="h-full w-full p-[20px] gap-y-2 flex flex-1 items-center justify-end">
        <Text
          className="text-[20px] text-[#fff] "
          style={{fontFamily: 'Poppins-SemiBold'}}>
          {date} #532652
        </Text>
        <Text
          style={{
            color: 'rgba(255, 255, 255, 0.50)',
            fontFamily: 'Poppins-Medium',
          }}>
          New01.aac
        </Text>
        <View className="my-4 mt-3  ">
          <Text>Progress Bar</Text>
        </View>
        <View className="flex my-12 flex-row items-center justify-around w-full ">
          <View className="flex flex-col items-center justify-center">
            <TouchableOpacity
              className="rounded-full p-2 flex flex-col w-auto items-center justify-center border-2 border-[#fff]"
              onPress={() => {
                startStopRecord ? stopListener() : startListener();
              }}>
              {startStopRecord ? (
                <FontAwesomeIcon icon={faStop} color="#FF3D33" size={29} />
              ) : (
                <FontAwesomeIcon
                  icon={faRecordVinyl}
                  color="#FF3D33"
                  size={29}
                />
              )}
            </TouchableOpacity>
            <Text className="text-white my-2 whitespace-pre-wrap w-12 text-center ">
              {startStopRecord ? 'Stop' : 'Record'}
            </Text>
          </View>
          <View className="flex flex-col items-center justify-center ">
            <TouchableOpacity
              className="rounded-full p-2 flex flex-col w-auto items-center justify-center border-2 border-[#fff]"
              onPress={async () => {
                (await pause) ? resumeAudio() : pauseAudio();
              }}>
              {!pause ? (
                <FontAwesomeIcon
                  icon={faPlay}
                  style={{color: '#FFf'}}
                  size={29}
                />
              ) : (
                <FontAwesomeIcon
                  icon={faPause}
                  style={{color: '#fff'}}
                  size={29}
                />
              )}
            </TouchableOpacity>
            <Text className="text-white my-2 whitespace-pre-wrap w-13 text-center ">
              {pause ? 'Resume' : 'Pause'}
            </Text>
          </View>
          
          <View className="flex flex-col items-center justify-center">
            <TouchableOpacity className="p-2">
              <FontAwesomeIcon
                icon={faUpload}
                size={29}
                style={{color: '#fff'}}
              />
            </TouchableOpacity>
            <Text className="text-white my-2 whitespace-pre-wrap w-12 text-center ">
              Upload
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Home;
