package com.ppttotext;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.Arguments;

import org.apache.poi.hslf.usermodel.HSLFShape;
import org.apache.poi.hslf.usermodel.HSLFSlide;
import org.apache.poi.hslf.usermodel.HSLFSlideShow;
import org.apache.poi.hslf.usermodel.HSLFTextShape;
import org.apache.poi.xslf.usermodel.XMLSlideShow;
import org.apache.poi.xslf.usermodel.XSLFShape;
import org.apache.poi.xslf.usermodel.XSLFSlide;
import org.apache.poi.xslf.usermodel.XSLFTextShape;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.ArrayList;

@ReactModule(name = PptToTextModule.NAME)
public class PptToTextModule extends ReactContextBaseJavaModule {
    public static final String NAME = "PptToText";

    public PptToTextModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    @NonNull
    public String getName() {
        return NAME;
    }


    // Example method
    // See https://reactnative.dev/docs/native-modules-android
    @ReactMethod
    public void multiply(double a, double b, Promise promise) {
        promise.resolve(a * b);
    }

    public ArrayList < String > readPptFile(String filePath) throws IOException {
        // method to read a .ppt file
        ArrayList < String > slideTexts = new ArrayList < String > ();
        FileInputStream stream = new FileInputStream(filePath);
        HSLFSlideShow ppt = new HSLFSlideShow(stream);
        for (HSLFSlide slide: ppt.getSlides()) {
            String text = "";
            for (HSLFShape shape: slide.getShapes()) {
                if (shape instanceof HSLFTextShape) {
                    HSLFTextShape textShape = (HSLFTextShape) shape;
                    text += textShape.getText() + "\n";
                }
            }
            slideTexts.add(text);
        }
        stream.close();
        return slideTexts;
    }

    public ArrayList < String > readPptxFile(String filePath) throws IOException {
        // method to read a .pptx file
        ArrayList < String > slideTexts = new ArrayList < String > ();
        FileInputStream stream = new FileInputStream(filePath);
        XMLSlideShow ppt = new XMLSlideShow(stream);
        for (XSLFSlide slide: ppt.getSlides()) {
            String text = "";
            for (XSLFShape shape: slide.getShapes()) {
                if (shape instanceof XSLFTextShape) {
                    XSLFTextShape textShape = (XSLFTextShape) shape;
                    text += textShape.getText() + "\n";
                }
            }
            slideTexts.add(text);
        }
        stream.close();
        return slideTexts;
    }

    @ReactMethod
    public void readPpt(String filePath, Promise promise) {
        try {
            ArrayList < String > slideTexts = new ArrayList < String > ();
            if (filePath.endsWith(".pptx")) {
                try {
                    slideTexts = readPptxFile(filePath);
                } catch (Exception e) {
                    promise.reject("Error reading pptx " + e.getMessage());
                }
            } else if (filePath.endsWith(".ppt")) {
                try {
                    slideTexts = readPptFile(filePath);
                } catch (Exception e) {
                    promise.reject("Error reading pptx " + e.getMessage());
                }
            } else {
                promise.reject("Invalid file type");
            }

            WritableArray array = Arguments.createArray();
            for (String text: slideTexts) {
                array.pushString(text);
            }
            promise.resolve(array);
        } catch (Exception e) {
            promise.reject("Error reading ppt " + e.getMessage());
        }
    }
}