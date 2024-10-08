package com.reactlibrary;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;

import org.opencv.core.CvType;
import org.opencv.core.Mat;
import org.opencv.core.*;

import java.io.*;


import org.opencv.android.Utils;
import org.opencv.imgproc.Imgproc;

import android.util.Base64;

public class RNOpenCvLibraryModule extends ReactContextBaseJavaModule {

  private final ReactApplicationContext reactContext;

  public RNOpenCvLibraryModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
  }

  @Override
  public String getName() {
    return "RNOpenCvLibrary";
  }

  @ReactMethod
  public void checkForBlurryImage(String imageAsBase64, Callback errorCallback, Callback successCallback) {
    try {
      BitmapFactory.Options options = new BitmapFactory.Options();
      options.inDither = true;
      options.inPreferredConfig = Bitmap.Config.ARGB_8888;

      byte[] decodedString = Base64.decode(imageAsBase64, Base64.DEFAULT);
      Bitmap image = BitmapFactory.decodeByteArray(decodedString, 0, decodedString.length);

//      Bitmap image = decodeSampledBitmapFromFile(imageurl, 2000, 2000);
      int l = CvType.CV_8UC1; //8-bit grey scale image
      Mat matImage = new Mat();
      Utils.bitmapToMat(image, matImage);
      Mat matImageGrey = new Mat();
      Imgproc.cvtColor(matImage, matImageGrey, Imgproc.COLOR_BGR2GRAY);

      Bitmap destImage;
      destImage = Bitmap.createBitmap(image);
      Mat dst2 = new Mat();
      Utils.bitmapToMat(destImage, dst2);
      Mat laplacianImage = new Mat();
      dst2.convertTo(laplacianImage, l);
      Imgproc.Laplacian(matImageGrey, laplacianImage, CvType.CV_8U);
      Mat laplacianImage8bit = new Mat();
      laplacianImage.convertTo(laplacianImage8bit, l);

      Bitmap bmp = Bitmap.createBitmap(laplacianImage8bit.cols(), laplacianImage8bit.rows(), Bitmap.Config.ARGB_8888);
      Utils.matToBitmap(laplacianImage8bit, bmp);
      int[] pixels = new int[bmp.getHeight() * bmp.getWidth()];
      bmp.getPixels(pixels, 0, bmp.getWidth(), 0, 0, bmp.getWidth(), bmp.getHeight());
      int maxLap = -16777216; // 16m
      for (int pixel : pixels) {
        if (pixel > maxLap)
          maxLap = pixel;
      }

//            int soglia = -6118750;
      int soglia = -8118750;
      if (maxLap <= soglia) {
        System.out.println("is blur image");
      }

      successCallback.invoke(maxLap <= soglia);
    } catch (Exception e) {
      errorCallback.invoke(e.getMessage());
    }
  }


  // private static Bitmap getResizedBitmapCV(Bitmap inputBitmap, int newWidth, int newHeight) {
  //   // Convert the input Bitmap to a Mat
  //   Mat inputMat = new Mat();
  //   Utils.bitmapToMat(inputBitmap, inputMat);
  //   // Create a new Mat for the resized image
  //   Mat resizedMat = new Mat();
  //   Imgproc.resize(inputMat, resizedMat, new Size(newWidth, newHeight));
  //   // Convert the resized Mat back to a Bitmap
  //   Bitmap resizedBitmap = Bitmap.createBitmap(newWidth, newHeight, Bitmap.Config.ARGB_8888);
  //   Utils.matToBitmap(resizedMat, resizedBitmap);
  //   inputMat.release();
  //   resizedMat.release();
  //   return resizedBitmap;
  // }

  @ReactMethod
  public void applyFilter(String imageAsBase64, String filterName, Callback errorCallback, Callback successCallback) {
    try {
      successCallback.invoke("Applying filter " + filterName);
    }
    catch (Exception e) {
      errorCallback.invoke(e.getMessage());
    }
  }

  @ReactMethod
  public void toGrayscale(String imageAsBase64, Callback errorCallback, Callback successCallback) {
    try {
      // convert image to grayscale and return as base64
      BitmapFactory.Options options = new BitmapFactory.Options();
      options.inDither = true;
      options.inPreferredConfig = Bitmap.Config.ARGB_8888;

      byte[] decodedString = Base64.decode(imageAsBase64, Base64.DEFAULT);
      Bitmap image = BitmapFactory.decodeByteArray(decodedString, 0, decodedString.length);

      Mat matImage = new Mat();
      Utils.bitmapToMat(image, matImage);
      Mat matImageGrey = new Mat();
      Imgproc.cvtColor(matImage, matImageGrey, Imgproc.COLOR_BGR2GRAY);
      // Convert Mat back to Bitmap
      Bitmap resultBitmap = Bitmap.createBitmap(matImageGrey.cols(), matImageGrey.rows(), Bitmap.Config.ARGB_8888);
      Utils.matToBitmap(matImageGrey, resultBitmap);

      // Convert Bitmap to base64
      ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
      resultBitmap.compress(Bitmap.CompressFormat.PNG, 100, byteArrayOutputStream);
      byte[] byteArray = byteArrayOutputStream.toByteArray();
      String resultBase64 = Base64.encodeToString(byteArray, Base64.DEFAULT);

      successCallback.invoke(resultBase64);
    }
    catch (Exception e) {
      errorCallback.invoke(e.getMessage());
    }
  }
}