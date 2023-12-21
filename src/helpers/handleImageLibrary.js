import {launchCamera} from 'react-native-image-picker';
import Upload from './Upload';

const handleImageLibrary = async () => {
  let options = {
    maxWidth: 600,
    maxHeight: 600,
    quality: 1,
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
  };
  return new Promise((resolve, reject) => {
    launchCamera(options, response => {
      if (response.didCancel) {
        reject('User cancelled image picker');
      } else if (response.error) {
        reject('ImagePicker Error: ', response.error);
      } else {
        let image = {
          name: response.assets[0].fileName,
          type: response.assets[0].type,
          uri: response.assets[0].uri,
        };

        const data = new FormData();
        data.append('file', image);
        Upload.post(`my-orders/uploadPaymentProof`, data)
          .then(res => {
            let source = {
              uri: response.assets[0].uri,
              name: response.assets[0].fileName,
              url: res.data.data,
            };

            resolve(source);
          })
          .catch(err => {
            reject(err);
          });
      }
    });
  });
};

export default handleImageLibrary;
