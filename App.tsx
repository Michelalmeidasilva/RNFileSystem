/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */
import RNFetchBlob from 'rn-fetch-blob';
import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Platform,
  TextInput,
} from 'react-native';

const {fs} = RNFetchBlob;

export const DIRECTORY_NAME = `${
  Platform.OS === 'android' ? fs.dirs.DownloadDir : fs.dirs.DocumentDir
}/.myapp`;

const App = () => {
  const [fileName, setFileName] = useState<string>('');
  const [searchFile, setSearchFile] = useState<string>('');
  const [fileFound, setFileFound] = useState<any>(null);

  const [filesAtFileSystem, setFilesAtFileSystem] = useState<string[]>([]);

  const makeDirectory = async (): Promise<void> => {
    try {
      if (!(await fs.exists(DIRECTORY_NAME))) {
        await fs.mkdir(DIRECTORY_NAME);
      }
    } catch (error) {
      throw error;
    }
  };

  const listFiles = async (): Promise<void> => {
    setFilesAtFileSystem(await fs.ls(DIRECTORY_NAME));
  };

  const hasDownloadedMedia = async (): Promise<void> => {
    const filePath = DIRECTORY_NAME + '/' + searchFile;

    console.log('search at', filePath);
    const fileFound = filesAtFileSystem?.find((item) => {
      console.log('name searching', item);
      console.log('includes ', filePath?.includes(item));

      return filePath?.includes(item);
    });

    fileFound
      ? setFileFound({filename: fileFound, exists: true, filePath})
      : setFileFound(undefined);
  };

  const downloadFile = async (fileName: string) => {
    try {
      if (fileName) {
        await makeDirectory();

        var outputPath = DIRECTORY_NAME + '/' + fileName + '.txt';

        console.log(outputPath);

        await fs.writeFile(outputPath, 'Lorem ipsum dolor sit amet', 'utf8');
      }
    } catch (err) {
    } finally {
      setFileName('');
    }
  };

  useEffect(() => {
    listFiles();
  }, [fileName]);

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{flex: 1, backgroundColor: '#ffeded'}}>
        <ScrollView contentInsetAdjustmentBehavior="automatic">
          <View
            style={{
              padding: 30,
            }}>
            <TextInput
              placeholder="Digite o nome do arquivo"
              onChangeText={setFileName}
              style={{
                width: 300,
                height: 40,
                fontSize: 20,
              }}
            />

            <Button
              title={'Salvar arquivo'}
              onPress={() => downloadFile(fileName)}
            />

            {filesAtFileSystem && (
              <>
                <Text style={{marginTop: 40, fontSize: 20, marginBottom: 10}}>
                  Arquivos no file system:
                </Text>

                {filesAtFileSystem?.map((item) => (
                  <Text style={{marginTop: 5, fontSize: 16}}>{item}</Text>
                ))}
              </>
            )}

            <TextInput
              placeholder="Digite o nome do arquivo a ser pesquisado"
              onChangeText={setSearchFile}
              style={{
                marginTop: 30,
                width: 300,
                height: 40,
                fontSize: 20,
              }}
            />

            <Button
              title={'Procurar arquivo no file system'}
              onPress={hasDownloadedMedia}
              style={{
                marginBottom: 10,
              }}
            />

            {fileFound === null ? (
              <></>
            ) : fileFound === undefined ? (
              <Text>Arquivo não encontrado</Text>
            ) : (
              <Text>
                Arquivo Encontrado: {JSON.stringify(fileFound, null, 2)}
              </Text>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const Button = ({
  onPress,
  title,
  ...rest
}: {
  onPress: () => void;
  title: string;
}) => {
  return (
    <View {...rest}>
      <TouchableOpacity
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 4,
          borderWidth: 1,
          marginTop: 10,
          padding: 10,
          width: 290,
          borderColor: 'grey',
        }}
        onPress={onPress}>
        <Text style={{fontSize: 14}}>{title}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default App;
