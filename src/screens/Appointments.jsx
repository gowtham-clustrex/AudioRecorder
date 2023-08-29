import {View, Text, SafeAreaView, FlatList} from 'react-native';
import React, {useState, useEffect} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faUser} from '@fortawesome/free-solid-svg-icons';
import UserLIstCard from '../components/UserLIstCard';
import NetInfo from '@react-native-community/netinfo';

const Appointments = props => {
  const [data, setdata] = useState([
    {
      date: '28th Aug 2023',
      time: '10:00 PM - 12:00 PM',
      chartNumber: '#54623',
      Duration: '00:00',
      path: '',
    },
    {
      date: '28th Aug 2023',
      time: '10:00 PM - 12:00 PM',
      chartNumber: '#54633',
      Duration: '00:00',
      path: '',
    },
    {
      date: '28th Aug 2023',
      time: '10:00 PM - 12:00 PM',
      chartNumber: '#54643',
      Duration: '00:00',
      path: '',
    },
  ]);

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

  useEffect(() => {
    if (props.route.params) {
      setdata(props.route.params);
    }
    NetInfo.fetch().then(res => {
      if (!res.isConnected) {
        console.log('ello');
        Alert.alert('internet connectivity', 'no connection available');
      }
    });
    Permission();
  }, []);
  return (
    <SafeAreaView className="bg-[#1E202E] flex-1 ">
      <Text
        className="text-center m-5 text-[#fff] text-[24px]"
        style={{fontFamily: 'Poppins-SemiBold'}}>
        Appointments
      </Text>
      <View className="my-2 flex px-2 flex-col items-center justify-center gap-y-2">
        <FlatList
          data={data}
          renderItem={items => {
            return (
              <UserLIstCard
                date={items.item.date}
                time={items.item.time}
                chartNumber={items.item.chartNumber}
                Duration={items.item.Duration}
                nav={props.navigation}
                data={items.item}
                allData={data}
                path={items.item.path}
              />
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default Appointments;
