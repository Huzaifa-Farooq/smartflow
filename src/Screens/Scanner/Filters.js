import { Image } from 'react-native';
import {
    Sepia,
    Grayscale,
    Tint,
    Invert,
    Saturate,
    Contrast,
    Sharpen,
    Brightness
} from 'react-native-image-filter-kit';



export const GrayscaledImage = ({ imageSource, style, onExtractImage }) => {
    return (
        <Grayscale
            onExtractImage={onExtractImage}
            extractImageEnabled={onExtractImage ? true : onExtractImage}
            image={<Image source={imageSource} style={style} />}
        />
    );
}



const CombinedFiltersImage = ({ imageSource, style, onExtractImage }) => (
    <Sharpen
        onExtractImage={onExtractImage}
        extractImageEnabled={onExtractImage ? true : false}
        image={<Contrast
            amount={2}
            image={
                <Saturate
                    image={<Image source={imageSource} style={style} />}
                    amount={2}
                />
            }
        />}
    />
);

const InvertedImage = ({ imageSource, style, onExtractImage }) => (
    <Invert
        onExtractImage={onExtractImage}
        extractImageEnabled={onExtractImage ? true : false}
        image={<Image source={imageSource} style={style} />}
    />
);

const SaturatedImage = ({ imageSource, style, onExtractImage }) => (
    <Saturate
        onExtractImage={onExtractImage}
        extractImageEnabled={onExtractImage ? true : false}
        amount={2}
        image={<Image source={imageSource} style={style} />}
    />
);

const SepiaTintedImage = ({ imageSource, style, onExtractImage }) => (
    <Sepia
        onExtractImage={onExtractImage}
        extractImageEnabled={onExtractImage ? true : false}
        amount={0.4}
        image={
            <Tint
                amount={0.2}
                image={<Image source={imageSource} style={style} />}
            />
        }
    />
);

const HighContrastImage = ({ imageSource, style, onExtractImage }) => (
    <Contrast
        onExtractImage={onExtractImage}
        extractImageEnabled={onExtractImage ? true : false}
        amount={2}
        image={<Image source={imageSource} style={style} />}
    />
);

const sharpenImage = ({ imageSource, style, onExtractImage }) => (
    <Sharpen
        onExtractImage={onExtractImage}
        extractImageEnabled={onExtractImage ? true : false}
        image={<Image source={imageSource} style={style} />}
    />
);

const defaultImage = ({ imageSource, style }) => (
    <Image source={imageSource} style={style} />
);

const lightenImage = ({ imageSource, style, onExtractImage }) => (
    <Brightness
        onExtractImage={onExtractImage}
        extractImageEnabled={onExtractImage ? true : false}
        amount={0.5}
        image={<Image source={imageSource} style={style} />}
    />
);


const Filters = {
    'Original': defaultImage,
    // 'Text Magic': CombinedFiltersImage,
    // 'Grayscale': GrayscaledImage,
    // 'Sharpen': sharpenImage,
    // 'High Contrast': HighContrastImage,
    // 'Inverted': InvertedImage,
    // 'Saturated': SaturatedImage,
    // 'SepiaTinted': SepiaTintedImage,
    // 'Lighten': lightenImage
};

export const Filter = ({ filterName, imageSource, style, onExtractImage }) => {
    const FilterComponent = Filters[filterName];
    return (
        <FilterComponent imageSource={imageSource} style={style} onExtractImage={onExtractImage} />
    );
}


export default Filters;
