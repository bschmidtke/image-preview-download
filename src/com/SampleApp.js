import React from 'react';
import PropTypes from 'prop-types';
import ImageSelector from './components/ImageSelector';
import {
    getStyleSheet,
    addStyleSheet,
    addStylesToStyleSheet,
    createBackgroundImageStyle,
    createBackgroundDataImageStyle
} from './utils/CSSUtils';
import {
    buildImagePath,
    download
} from './utils/DownloadUtils';

class SampleApp extends React.Component {

    constructor( props ) {
        super(props)
        this.state = {
            fileName: null,
            fileData: null
        }
    }

    previewStyle( styleObj ) {
        this.previewStyles([styleObj]);
    }

    previewStyles( styles ) {
        // Get the stylesheet we want to apply styles to.
        const styleSheet = getStyleSheet( this.props.styleSheetName );
        addStylesToStyleSheet( styleSheet, styles );
    }

    applySecondaryPreviewHandler( selector ) {
        const previewCSS = createBackgroundDataImageStyle( selector, this.state.fileData );
        this.previewStyle( previewCSS );
    }

    // Section 1: Image Change Handler.
    imageChangeHandler( fileName, fileData ) {
        this.setState({fileName: fileName, fileData: fileData})
    }

    downloadClickHandler( event ) {
        // If no images are selected - exit;
        if(!this.state.fileName || !this.state.fileName.trim()) return;

        // Downloading we need to do a few thing:
        // Assemble an array of styles we want to write to a css file.
        const styles = this.getStylesForDownload();

        // Assemble an array of images that we will write into a target directory.
        const images = this.getImagesForDownload();

        // 1) Generate a stylesheet file.
        // 2) Generate an images folder.
        // 3) Merge together in a zip or other grouping for a single file download.
        // 4) Initiate File Download.
        download( styles, images, "styles.css", this.state.imageFolderName, "bundle.zip");
    }

    getStylesForDownload() {
        const styles = [];

        // In this case, we want to write the path to the file into the style, not the image data.
        const targetFileURL = buildImagePath( this.props.imageFolderName, this.state.fileName );
        const imagePreviewStyle = createBackgroundImageStyle( ".image-preview", targetFileURL );

        // For this style object, we only care about the cssText when writing to the file.
        if(imagePreviewStyle) styles.push( imagePreviewStyle.cssText );

        return styles;
    }

    getImagesForDownload() {
        return [{
            fileName: this.state.fileName,
            fileData: this.state.fileData
        }];
    }

    componentWillUpdate (nextProps, nextState) {
        if( nextState.fileData ) {
            // apply css.
            const previewCSS = createBackgroundDataImageStyle( ".image-preview", nextState.fileData );
            this.previewStyle( previewCSS );
        } else {
            // Reapply default / Clear.
            // Or other business logic.
        }
    }

    componentDidMount() {
        // Add a stylesheet for us to inject styles into.
        addStyleSheet( this.props.styleSheetName );
    }

    render() {
        return (
            <div className="sample-app">
                <h2>Image Preview and Download from Browser</h2>
                <div>
                    <div>This is a example of the following:</div>
                    <ul>
                        <li>Selecting an Image on the file system.</li>
                        <li>Previewing that image in the browser.</li>
                        <li>Applying the image data to another css style.</li>
                        <li>Downloading the image data out of the browser.</li>
                    </ul>
                </div>
                <div className="sections flex-box horizontal">
                    <div className="section flex-box flex-grow content-item vertical">
                        <div>Simple image selector component that retrieves the file name and image data after it is loaded into the browser.</div>
                        <div>&nbsp;</div>
                        <ImageSelector
                            fileName={this.state.fileName}
                            onImageLoaded={ this.imageChangeHandler.bind(this) } />
                    </div>
                    <div className="section flex-box flex-grow content-item vertical">
                        <div>Viewing Selected File</div>
                        <div>&nbsp;</div>
                        <div>File Name: {this.state.fileName}</div>
                        <div>&nbsp;</div>
                        <div className="flex-box image-preview"></div>
                    </div>
                    <div className="section flex-box flex-grow content-item vertical">
                        <div>Applied to Another Style</div>
                        <div>&nbsp;</div>
                        <button className="button" onClick={this.applySecondaryPreviewHandler.bind(this, ".another-preview")}>Copy</button>
                        <div>&nbsp;</div>
                        <div className="flex-box another-preview"></div>
                    </div>
                    <div className="section flex-box flex-grow content-item vertical">
                        <div>Download Content</div>
                        <div>&nbsp;</div>
                        <button className="button" onClick={this.downloadClickHandler.bind(this)}>Download</button>
                    </div>
                </div>
            </div>
        )
    }
}

SampleApp.propTypes = {
    styleSheetName: PropTypes.string.isRequired
};

SampleApp.defaultProps = {
    styleSheetName: "demo-style-sheet",
    imageFolderName: "images"
};

export default SampleApp;