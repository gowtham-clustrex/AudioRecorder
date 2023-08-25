import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
  Blob,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import tw from 'twrnc';
import AudioRecorderPlayer, {
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AudioEncoderAndroidType,
  AudioSet,
  AudioSourceAndroidType,
} from 'react-native-audio-recorder-player';
import {decode} from 'base64-arraybuffer';
import axios from 'axios';
// import RNFetchBlob from 'rn-fetch-blob';
import {Buffer} from 'buffer';
import RNFS, {completeHandlerIOS, uploadFiles} from 'react-native-fs';
import {get_presigned_url, uploadAudio} from './src/Api/ApiCall';

const App = () => {
  // create a instance of recorder object
  const rec = useRef();

  // setting the pause and resume state
  const [pause, setpause] = useState(false);

  // set the path to the audio to play
  const [path, setPath] = useState('');

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
    rec.current = new AudioRecorderPlayer();
  }, []);

  // start the recording
  const startListener = async () => {
    rec.current.setSubscriptionDuration(0.08);
    const audioSet = {
      AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
      AudioSourceAndroid: AudioSourceAndroidType.MIC,
      AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
      AVNumberOfChannelsKeyIOS: 2,
      AVFormatIDKeyIOS: AVEncodingOption.aac,
    };
    const path =
      Platform.OS === 'android' ? `${folderPath}/new01.aac` : 'new01.aac';
    await rec.current.startRecorder(path, audioSet);
    rec.current.addRecordBackListener(r => {
      console.log(r);
    });
  };

  const stopListener = async () => {
    console.log(rec.current);
    const result = await rec.current.stopRecorder();
    rec.current.removeRecordBackListener();
    if (result) {
      console.log('URL', result);
      name = result.substring(result.lastIndexOf('/') + 1, result.length);

      // getting a presigned url 
      const presigned_url = await get_presigned_url(name);
      const data = await RNFS.readFile(result, 'base64');

      // convert base64 to buffer  
      const bufferAudio = Buffer.from(data, 'base64');
      console.log(bufferAudio);

      // upload to s3 bucket 
      uploadAudio(presigned_url, bufferAudio).then(re => {
        console.log('Updated');
      });
      setPath(result);
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
    const play = await rec.current.startPlayer(path);
    rec.current.addPlayBackListener(res => {
      console.log(res);
    });
  };

  return (
    <View style={tw`flex-1 items-center justify-center bg-gray-400`}>
      <Text>Recoder App</Text>
      <View style={tw`flex flex-row items-center gap-3 `}>
        <TouchableOpacity
          style={tw`p-3 bg-black my-3 rounded-lg`}
          onPress={startListener}>
          <Text style={tw`text-white`}>Start </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={tw`p-3 bg-black my-3 rounded-lg`}
          onPress={stopListener}>
          <Text style={tw`text-white`}>Stop </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={tw`p-3 bg-black my-3 rounded-lg`}
          onPress={() => {
            !pause ? pauseAudio() : resumeAudio();
          }}>
          <Text style={tw`text-white`}>{!pause ? 'Pause' : 'Play'} </Text>
        </TouchableOpacity>
      </View>

      <Text>Playing a Audio in app</Text>
      <TouchableOpacity
        style={tw`bg-gray-200 p-2 rounded-full my-2`}
        onPress={playAudio}>
        <Text>Play </Text>
      </TouchableOpacity>
    </View>
  );
};

export default App;
