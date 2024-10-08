import { NativeModules, Platform } from 'react-native';


const LINKING_ERROR =
  `The package 'react-native-ppt-to-text' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';
const PptToText = NativeModules.PptToText
  ? NativeModules.PptToText
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export function multiply(a: number, b: number): Promise<number> {
  return PptToText.multiply(a, b);
}

export function readPpt(path: string): Promise<string[]> {
  try {
    return PptToText.readPpt(path);
  } catch (error) {
    return Promise.reject("Error while reading ppt file " + error);
  }}

// export default PptToText;
