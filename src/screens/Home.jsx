import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Alert,
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
import Loader from '../../assets/svg/Loader';

const Home = props => {
  const rec = useRef(new AudioRecorderPlayer());
  const animationref = useRef(null);
  const [loading, setLoading] = useState(false);
  const [upload, setupload] = useState(true);
  // params data
  const data = props.route.params.data;
  const alldata = props.route.params.alldata
  console.log("all",alldata)

  // filename 
  const today = new Date();
  const options = { month: 'short' };
  const filename =`${today.getDate()}${today.toLocaleString('en-US', options)}${today.getUTCFullYear()+data.chartNumber.substring(1)}.aac`
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
    animationref.current?.play();
    const audioSet = {
      AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
      AudioSourceAndroid: AudioSourceAndroidType.MIC,
      AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
      AVNumberOfChannelsKeyIOS: 2,
      AVFormatIDKeyIOS: AVEncodingOption.aac,
    };
    const path =
      Platform.OS === 'android' ? `${folderPath}/${filename}` : filename;
    setStartStopRecord(!startStopRecord);
    console.log(filename);
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
    animationref.current?.reset();
    data.Duration = timer;
    data.path = result;
    setStartStopRecord(!startStopRecord);
    // uploadAudioFile(result);
    console.log(data);
  };

  const uploadAudioFile = async result => {
    try {
      if (result) {
        setLoading(true);
        // console.log(result)
        // console.log('URL', result);
        name = result.substring(result.lastIndexOf('/') + 1, result.length).toString();
        //get presigned  url for s3 upload
        const presigned_url = await get_presigned_url(name);
        if (!presigned_url) {
          Alert.alert('error', 'unable to upload a File');
          setupload(false);
        }
        const filedata = await RNFS.readFile(result, 'base64');
        console.log("alldata",alldata)

        // const updatedData = alldata.map(item => {
        //   console.log("wew",item)
        //   if (item.chartNumber === data.chartNumber) {
        //     return { ...item, ...newData };
        //   }
        //   return item;
        // });

        // convert base64 to buffer
        const bufferAudio = Buffer.from(filedata, 'base64');
        console.log(bufferAudio);
        setupload(true);

        // upload to s3 bucket
        uploadAudio(presigned_url, bufferAudio)
          .then(re => {
            console.log('Updated');
            setTimer('00:00');
            setLoading(false);
            setupload(true);
            console.log('Updated',data);
            // props.navigation.replace("Appointment",data);
            Alert.alert('uploaded successfully',"Audio File uploaded successfully",[ {
              text: 'ok',
              onPress: () => {props.navigation.replace("Appointment",alldata)}
              
            }]);
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
      animationref.current?.pause();
    });
  };

  const resumeAudio = async () => {
    console.log('resume');

    rec.current.resumeRecorder().then(() => {
      setpause(!pause);
      animationref.current?.play();
    });
    setpause(!pause);
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
      <View className="h-[50%] mb-4 items-center justify-center">
        <View>
          <LottieView
            ref={animationref}
            source={require('../../assets/lottieJson/musicLoader.json')}
            style={{height: 300, width: 300}}
          />
        </View>
      </View>
      <View className="h-full w-full p-[20px] mt-3 gap-y-2 flex flex-1 items-center justify-end">
        <Text
          className="text-[20px] text-[#fff] "
          style={{fontFamily: 'Poppins-SemiBold'}}>
          {`${data.date} ${data.chartNumber}`}
        </Text>
        <Text
          style={{
            color: 'rgba(255, 255, 255, 0.50)',
            fontFamily: 'Poppins-Medium',
          }}>
          {filename}
        </Text>
        <View className="my-4 mt-3  ">
          <Loader className="w-[80%]" />
          <View className="flex flex-row px-1 mt-2 items-center justify-between">
            <Text>00:00</Text>
            <Text>{timer}</Text>
          </View>
        </View>
        <View className="flex my-12 flex-row  items-start pt-1  justify-around w-full ">
          <View className="flex flex-col items-start  justify-center">
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
              disabled={!startStopRecord}
              onPress={async () => {
                (await pause) ? resumeAudio() : pauseAudio();
              }}>
              {pause ? (
                <FontAwesomeIcon
                  icon={faRecordVinyl}
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
            <Text className="text-white my-2 whitespace-pre-wrap w-13 text-center h-[30%]">
              {pause ? 'Resume \n Recording' : 'Pause'}
            </Text>
          </View>

          <View className="flex flex-col items-center justify-center">
            <TouchableOpacity
              className="p-2"
              disabled={path === ''}
              onPress={() => {
                console.log(path !== '');
                uploadAudioFile(path);
              }}>
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
